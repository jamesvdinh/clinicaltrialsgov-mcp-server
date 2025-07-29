/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_search_studies` tool.
 * @module src/mcp-server/tools/searchStudies/logic
 */
import { z } from "zod";
import {
  ClinicalTrialsGovService,
  PagedStudiesSchema,
} from "../../../services/clinical-trials-gov/index.js";
import { cleanStudy } from "../../../utils/clinicaltrials/jsonCleaner.js";
import { logger, type RequestContext } from "../../../utils/index.js";

/**
 * Zod schema for the `clinicaltrials_search_studies` tool input.
 */
export const SearchStudiesInputSchema = z.object({
  query: z
    .object({
      cond: z
        .string()
        .optional()
        .describe("Search for conditions or diseases."),
      term: z
        .string()
        .optional()
        .describe(
          "Search for other terms like interventions, outcomes, or sponsors.",
        ),
      locn: z.string().optional().describe("Search for study locations."),
      titles: z
        .string()
        .optional()
        .describe("Search within study titles or acronyms."),
      intr: z
        .string()
        .optional()
        .describe("Search for specific interventions or treatments."),
      outc: z
        .string()
        .optional()
        .describe("Search for specific outcome measures."),
      spons: z
        .string()
        .optional()
        .describe("Search for sponsors or collaborators."),
      id: z
        .string()
        .optional()
        .describe("Search for study identifiers (e.g., NCT ID)."),
    })
    .optional()
    .describe("A set of search terms that influence result ranking."),
  filter: z
    .object({
      ids: z
        .array(z.string())
        .optional()
        .describe("Return only studies with the specified NCT IDs."),
      overallStatus: z
        .array(
          z.enum([
            "ACTIVE_NOT_RECRUITING",
            "COMPLETED",
            "ENROLLING_BY_INVITATION",
            "NOT_YET_RECRUITING",
            "RECRUITING",
            "SUSPENDED",
            "TERMINATED",
            "WITHDRAWN",
            "UNKNOWN",
          ]),
        )
        .optional()
        .describe("Filter results by one or more study statuses."),
      geo: z
        .object({
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
          radius: z.number().positive(),
          unit: z.enum(["km", "mi"]).default("km"),
        })
        .optional()
        .describe(
          "Filter results to a geographic area by providing a point and radius.",
        ),
      advanced: z
        .string()
        .optional()
        .describe("Apply an advanced filter using Essie expression syntax."),
    })
    .optional()
    .describe(
      "A set of filters that narrow the search results without affecting ranking.",
    ),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      "A list of specific top-level fields to include in the response.",
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe("Specify the sort order for the results."),
  pageSize: z
    .number()
    .int()
    .min(1)
    .max(200)
    .default(10)
    .optional()
    .describe(
      "The number of studies to return per page (1-200). Defaults to 10.",
    ),
  pageToken: z
    .string()
    .optional()
    .describe("A token used to retrieve the next page of results."),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type SearchStudiesInput = z.infer<typeof SearchStudiesInputSchema>;

/**
 * Zod schema for the output of the `clinicaltrials_search_studies` tool.
 */
export const SearchStudiesOutputSchema = PagedStudiesSchema;

/**
 * TypeScript type inferred from the output schema.
 */
export type SearchStudiesOutput = z.infer<typeof SearchStudiesOutputSchema>;

/**
 * Searches for clinical studies using a combination of queries and filters.
 * Supports pagination, sorting, and geographic filtering.
 *
 * @param params - The validated input parameters for the tool.
 * @param context - The request context for logging and tracing.
 * @returns A promise that resolves with a paginated list of studies.
 * @throws {McpError} If the API request fails.
 */
export async function searchStudiesLogic(
  params: SearchStudiesInput,
  context: RequestContext,
): Promise<SearchStudiesOutput> {
  logger.debug("Executing searchStudiesLogic", {
    ...context,
    toolInput: params,
  });

  // Explicitly construct parameters for the service to ensure clarity and prevent side effects.
  const apiParams: Record<string, unknown> = {
    query: params.query,
    fields: params.fields,
    sort: params.sort,
    pageSize: params.pageSize,
    pageToken: params.pageToken,
    countTotal: true,
  };

  // Handle filter transformation separately.
  if (params.filter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { ...params.filter };
    if (filter.geo) {
      const { latitude, longitude, radius, unit } = filter.geo as {
        latitude: number;
        longitude: number;
        radius: number;
        unit: string;
      };
      // The API expects the geo filter as a single string.
      filter.geo = `distance(${latitude},${longitude},${radius}${unit})`;
      logger.debug(`Transformed geo filter to: ${filter.geo}`, {
        ...context,
      });
    }
    apiParams.filter = filter;
  }

  const service = ClinicalTrialsGovService.getInstance();
  const pagedStudies = await service.listStudies(apiParams, context);
  logger.info("Successfully listed studies.", { ...context });

  // Clean each study in the response to remove extraneous fields.
  if (pagedStudies.studies) {
    pagedStudies.studies = pagedStudies.studies.map(cleanStudy);
  }

  return pagedStudies;
}
