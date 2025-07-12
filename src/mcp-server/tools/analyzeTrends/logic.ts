/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_analyze_trends` tool.
 * @module src/mcp-server/tools/analyzeTrends/logic
 */
import { z } from "zod";
import {
  ClinicalTrialsGovService,
  Study,
} from "../../../services/clinical-trials-gov/index.js";
import { logger, type RequestContext } from "../../../utils/index.js";
import { ListStudiesInputSchema } from "../listStudies/logic.js";

/**
 * Defines the types of analysis that can be performed.
 */
export const AnalysisTypeSchema = z.enum([
  "countByStatus",
  "countByCountry",
  "countBySponsorType",
  "countByPhase",
]);

/**
 * Zod schema for the `clinicaltrials_analyze_trends` tool input.
 */
export const AnalyzeTrendsInputSchema = ListStudiesInputSchema.pick({
  query: true,
  filter: true,
}).extend({
  analysisType: AnalysisTypeSchema.describe(
    "The type of statistical analysis to perform on the study set.",
  ),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;

/**
 * Defines the structure for the analysis result.
 */
export type AnalysisResult = {
  analysisType: z.infer<typeof AnalysisTypeSchema>;
  totalStudies: number;
  results: Record<string, number>;
};

/**
 * Fetches all studies for a given query, handling pagination.
 * @param params - The query and filter parameters.
 * @param context - The request context.
 * @returns A promise that resolves with an array of all matching studies.
 */
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";

const MAX_STUDIES_FOR_ANALYSIS = 5000;
const API_CALL_DELAY_MS = 250;

/**
 * A simple promise-based delay function.
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAllStudies(
  params: Omit<AnalyzeTrendsInput, "analysisType">,
  context: RequestContext,
): Promise<Study[]> {
  const service = ClinicalTrialsGovService.getInstance();
  let allStudies: Study[] = [];
  let pageToken: string | undefined = undefined;
  let hasMore = true;

  logger.debug("Fetching all studies for analysis...", { ...context });

  // First, make one call to check the total number of studies
  const initialResponse = await service.listStudies(
    { ...params, pageSize: 1, countTotal: true },
    context,
  );
  const totalStudies = initialResponse.totalCount ?? 0;

  if (totalStudies > MAX_STUDIES_FOR_ANALYSIS) {
    throw new McpError(
      BaseErrorCode.INVALID_INPUT,
      `The query returned ${totalStudies} studies, which exceeds the limit of ${MAX_STUDIES_FOR_ANALYSIS} for analysis. Please provide a more specific query.`,
      { totalStudies, limit: MAX_STUDIES_FOR_ANALYSIS },
    );
  }

  if (totalStudies === 0) {
    return [];
  }

  // If within limits, proceed to fetch all studies
  while (hasMore) {
    const pagedStudies = await service.listStudies(
      { ...params, pageToken, pageSize: 1000 },
      context,
    );
    if (pagedStudies.studies) {
      allStudies = allStudies.concat(pagedStudies.studies);
    }
    pageToken = pagedStudies.nextPageToken;
    // Stop if we have all studies or if there's no next page token
    hasMore = !!pageToken && allStudies.length < totalStudies;

    if (hasMore) {
      await delay(API_CALL_DELAY_MS);
    }
  }

  logger.info(`Fetched a total of ${allStudies.length} studies for analysis.`, {
    ...context,
  });
  return allStudies;
}

/**
 * Performs a statistical analysis on a set of clinical trials matching the given criteria.
 * It fetches all studies (up to a limit) and aggregates data based on the specified analysis type.
 *
 * @param params - The validated input parameters for the tool.
 * @param context - The request context for logging and tracing.
 * @returns A promise that resolves with the structured analysis results.
 * @throws {McpError} If the query returns more studies than the analysis limit.
 */
export async function analyzeTrendsLogic(
  params: AnalyzeTrendsInput,
  context: RequestContext,
): Promise<AnalysisResult> {
  const { analysisType, ...searchParams } = params;
  const allStudies = await fetchAllStudies(searchParams, context);

  const results: Record<string, number> = {};

  for (const study of allStudies) {
    let key: string | undefined;
    switch (analysisType) {
      case "countByStatus":
        key = study.protocolSection?.statusModule?.overallStatus ?? "Unknown";
        break;
      case "countByCountry":
        study.protocolSection?.contactsLocationsModule?.locations?.forEach(
          (loc) => {
            const country = loc.country ?? "Unknown";
            results[country] = (results[country] || 0) + 1;
          },
        );
        // Skip the default increment logic for this case
        continue;
      case "countBySponsorType":
        key =
          study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor
            ?.class ?? "Unknown";
        break;
      case "countByPhase": {
        const phases = study.protocolSection?.designModule?.phases ?? [
          "Unknown",
        ];
        phases.forEach((phase) => {
          const phaseKey = phase ?? "Unknown";
          results[phaseKey] = (results[phaseKey] || 0) + 1;
        });
        // Skip the default increment logic for this case
        continue;
      }
    }
    if (key) {
      results[key] = (results[key] || 0) + 1;
    }
  }

  return {
    analysisType,
    totalStudies: allStudies.length,
    results,
  };
}
