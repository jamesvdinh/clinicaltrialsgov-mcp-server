/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_get_study` tool.
 * @module src/mcp-server/tools/getStudy/logic
 */
import { z } from "zod";
import {
  ClinicalTrialsGovService,
  Study,
  StudySchema,
} from "../../../services/clinical-trials-gov/index.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { logger, type RequestContext } from "../../../utils/index.js";

/**
 * Zod schema for the input of the `clinicaltrials_get_study` tool.
 */
export const GetStudyInputSchema = z.object({
  nctIds: z
    .union([
      z
        .string()
        .regex(/^[Nn][Cc][Tt]\d{8}$/)
        .transform((id) => [id]),
      z
        .array(z.string().regex(/^[Nn][Cc][Tt]\d{8}$/))
        .min(1)
        .max(5),
    ])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .describe(
      "A single NCT ID (e.g., 'NCT12345678') or an array of up to 5 NCT IDs to fetch. Each ID must be 8 digits."
    ),
  markupFormat: z
    .enum(["markdown", "legacy"])
    .default("markdown")
    .optional()
    .describe(
      "Format for rich text fields. 'markdown' provides formatted text, while 'legacy' provides the original. Defaults to 'markdown'."
    ),
  fields: z
    // .array(z.string())
    .any()
    .optional()
    .describe(
      "A list of specific top-level fields to return (e.g., ['protocolSection', 'derivedSection']). If omitted, all fields are returned."
    ),
  summaryOnly: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      "If true, returns a concise summary of each study. If false (default), returns the complete study data."
    ),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type GetStudyInput = z.infer<typeof GetStudyInputSchema>;

/**
 * Zod schema for a summarized study, containing only essential fields for a concise overview.
 */
export const StudySummarySchema = z
  .object({
    nctId: z.string().optional(),
    title: z.string().optional(),
    briefSummary: z.string().optional(),
    overallStatus: z.string().optional(),
    conditions: z.array(z.string()).optional(),
    interventions: z
      .array(
        z.object({ name: z.string().optional(), type: z.string().optional() })
      )
      .optional(),
    leadSponsor: z.string().optional(),
  })
  .passthrough();

/**
 * TypeScript type inferred from the summary schema.
 */
export type StudySummary = z.infer<typeof StudySummarySchema>;

/**
 * Zod schema for the output of the `clinicaltrials_get_study` tool.
 */
export const GetStudyOutputSchema = z.object({
  studies: z.array(z.union([StudySchema, StudySummarySchema])),
  errors: z
    .array(
      z.object({
        nctId: z.string(),
        error: z.string(),
      })
    )
    .optional(),
});

/**
 * TypeScript type inferred from the output schema.
 */
export type GetStudyOutput = z.infer<typeof GetStudyOutputSchema>;

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
        (i) => ({
          name: i.name,
          type: i.type,
        })
      ),
    leadSponsor:
      study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name,
  };
}

/**
 * Fetches one or more clinical studies from ClinicalTrials.gov by their NCT IDs.
 * Returns either complete study data or concise summaries for each.
 *
 * @param params - The validated input parameters, defining which studies to fetch and in what format.
 * @param context - The request context for logging and tracing.
 * @returns A promise resolving to an object containing an array of studies or summaries.
 * @throws {McpError} Throws if a study is not found or if the API request fails.
 */
export async function getStudyLogic(
  params: GetStudyInput,
  context: RequestContext
): Promise<GetStudyOutput> {
  const nctIds = Array.isArray(params.nctIds) ? params.nctIds : [params.nctIds];
  const markupFormat = params.markupFormat ?? "markdown";

  logger.debug(`Executing getStudyLogic for NCT IDs: ${nctIds.join(", ")}`, {
    ...context,
    toolInput: params,
  });

  const service = ClinicalTrialsGovService.getInstance();
  const studies: (Study | StudySummary)[] = [];
  const errors: { nctId: string; error: string }[] = [];

  const studyPromises = nctIds.map(async (nctId) => {
    try {
      const study = await service.fetchStudy(nctId, context, {
        // fields: params.fields,
        markupFormat: markupFormat,
      });

      if (!study) {
        // This case might be redundant if fetchStudy throws a 404, but it's a safe fallback.
        throw new McpError(
          BaseErrorCode.NOT_FOUND,
          `Study with NCT ID '${nctId}' not found.`
        );
      }

      logger.info(`Successfully fetched study ${nctId}`, { ...context });

      if (params.summaryOnly) {
        logger.debug(`Creating summary for study ${nctId}`, { ...context });
        studies.push(createStudySummary(study));
      } else {
        studies.push(study);
      }
    } catch (error) {
      const errorMessage =
        error instanceof McpError
          ? error.message
          : "An unexpected error occurred";
      logger.warning(`Failed to fetch study ${nctId}: ${errorMessage}`, {
        ...context,
        nctId,
        error,
      });
      errors.push({ nctId, error: errorMessage });
    }
  });

  await Promise.all(studyPromises);

  const result: GetStudyOutput = { studies };
  if (errors.length > 0) {
    result.errors = errors;
  }
  return result;
}
