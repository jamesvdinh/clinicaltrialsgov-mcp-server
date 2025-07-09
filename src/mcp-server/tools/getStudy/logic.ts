/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_get_study` tool.
 * @module src/mcp-server/tools/getStudy/logic
 */
import { z } from "zod";
import {
  ClinicalTrialsGovService,
  Study,
} from "../../../services/clinical-trials-gov/index.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { cleanStudy } from "../../../utils/clinicaltrials/jsonCleaner.js";
import { logger, type RequestContext } from "../../../utils/index.js";

/**
 * Zod schema for the `clinicaltrials_get_study` tool input.
 */
export const GetStudyInputSchema = z.object({
  nctIds: z
    .union([
      z.string().regex(/^[Nn][Cc][Tt]\d+$/),
      z
        .array(z.string().regex(/^[Nn][Cc][Tt]\d+$/))
        .min(1)
        .max(5),
    ])
    .describe(
      "A single NCT ID or an array of up to 5 NCT IDs. Each must follow the format 'NCT' followed by 8 digits (e.g., 'NCT12345678').",
    ),
  markupFormat: z
    .enum(["markdown", "legacy"])
    .default("markdown")
    .optional()
    .describe(
      "Specifies the format for rich text fields in the response. Defaults to 'markdown'.",
    ),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      "An optional list of specific top-level fields to include in the response. If omitted, all fields are returned.",
    ),
  summaryOnly: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      "If true, returns a condensed summary of the study instead of the full data. Defaults to false.",
    ),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type GetStudyInput = z.infer<typeof GetStudyInputSchema>;

/**
 * Defines the structure for a summarized study, containing only essential fields.
 */
export type StudySummary = {
  nctId: string | undefined;
  title: string | undefined;
  briefSummary: string | undefined;
  overallStatus: string | undefined;
  conditions: string[] | undefined;
  interventions:
    | { name: string | undefined; type: string | undefined }[]
    | undefined;
  leadSponsor: string | undefined;
};

/**
 * Extracts a concise summary from a full study object.
 * @param study - The full study object.
 * @returns A `StudySummary` object.
 */
function createStudySummary(study: Study): StudySummary {
  return {
    nctId: study.protocolSection?.identificationModule?.nctId,
    title: study.protocolSection?.identificationModule?.officialTitle,
    briefSummary: study.protocolSection?.descriptionModule?.briefSummary,
    overallStatus: study.protocolSection?.statusModule?.overallStatus,
    conditions: study.protocolSection?.conditionsModule?.conditions,
    interventions:
      study.protocolSection?.armsInterventionsModule?.interventions?.map(
        (i: { name: string; type: string }) => ({
          name: i.name,
          type: i.type,
        }),
      ),
    leadSponsor:
      study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name,
  };
}

/**
 * Fetches one or more clinical studies by their NCT numbers from the ClinicalTrials.gov API.
 * It can return either full study data or condensed summaries.
 *
 * @param params - The validated input parameters for the tool.
 * @param context - The request context for logging and tracing.
 * @returns A promise that resolves with an array of detailed study data or summaries.
 * @throws {McpError} If any of the studies are not found or if an API request fails.
 */
export async function getStudyLogic(
  params: GetStudyInput,
  context: RequestContext,
): Promise<(Study | StudySummary)[]> {
  const nctIds = Array.isArray(params.nctIds) ? params.nctIds : [params.nctIds];
  logger.debug(`Executing getStudyLogic for NCT IDs: ${nctIds.join(", ")}`, {
    ...context,
    toolInput: params,
  });

  const service = new ClinicalTrialsGovService();

  const studyPromises = nctIds.map(async (nctId) => {
    const study = await service.fetchStudy(nctId, context);
    if (!study) {
      throw new McpError(
        BaseErrorCode.NOT_FOUND,
        `Study with NCT ID '${nctId}' not found.`,
        { nctId },
      );
    }
    const cleanedStudy = cleanStudy(study);
    logger.info(`Successfully fetched study ${nctId}`, { ...context });

    if (params.summaryOnly) {
      logger.debug(`Creating summary for study ${nctId}`, { ...context });
      return createStudySummary(cleanedStudy);
    }
    return cleanedStudy;
  });

  return Promise.all(studyPromises);
}
