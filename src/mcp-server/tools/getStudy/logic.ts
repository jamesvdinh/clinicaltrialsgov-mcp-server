/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_get_study` tool.
 * @module src/mcp-server/tools/getStudy/logic
 */
import { z } from "zod";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { logger, type RequestContext } from "../../../utils/index.js";
import {
  ClinicalTrialsGovService,
  Study,
} from "../../../services/clinical-trials-gov/index.js";
import { cleanStudy } from "../../../utils/clinicaltrials/jsonCleaner.js";

/**
 * Zod schema for the `clinicaltrials_get_study` tool input.
 */
export const GetStudyInputSchema = z.object({
  nctId: z
    .string()
    .regex(/^[Nn][Cc][Tt]\d+$/)
    .describe("The NCT Number of the study to fetch. Format: 'NCT12345678'"),
  markupFormat: z
    .enum(["markdown", "legacy"])
    .default("markdown")
    .optional()
    .describe("The format for markup content in the study data."),
  fields: z
    .array(z.string())
    .optional()
    .describe("List of specific fields to return."),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type GetStudyInput = z.infer<typeof GetStudyInputSchema>;

/**
 * Implements the core logic for the `clinicaltrials_get_study` tool.
 * @param params - The validated input parameters for the tool.
 * @param context - The request context for logging and tracing.
 * @returns A promise that resolves with the detailed study data.
 * @throws {McpError} If the API request fails or the study is not found.
 */
export async function getStudyLogic(
  params: GetStudyInput,
  context: RequestContext,
): Promise<Study> {
  logger.debug(`Executing getStudyLogic for NCT ID: ${params.nctId}`, {
    ...context,
    toolInput: params,
  });
  const service = new ClinicalTrialsGovService();
  const study = await service.fetchStudy(params.nctId, context);
  if (!study) {
    throw new McpError(
      BaseErrorCode.NOT_FOUND,
      `Study with NCT ID '${params.nctId}' not found.`,
      { nctId: params.nctId },
    );
  }
  logger.info(`Successfully fetched study ${params.nctId}`, { ...context });
  return cleanStudy(study);
}
