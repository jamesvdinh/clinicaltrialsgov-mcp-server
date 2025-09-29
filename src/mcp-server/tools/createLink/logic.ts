/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_get_study` tool.
 * @module src/mcp-server/tools/getStudy/logic
 */
import { z } from "zod";
import { logger, type RequestContext } from "../../../utils/index.js";

/**
 * Zod schema for the input of the `clinicaltrials_create_link` tool.
 */
export const CreateLinkInputSchema = z.object({
  nctId: z
    .string()
    .regex(/^[Nn][Cc][Tt]\d{8}$/)
    .describe("The NCT ID of the clinical trial (e.g., 'NCT12345678')."),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type CreateLinkInput = z.infer<typeof CreateLinkInputSchema>;

/**
 * Zod schema for the output of the `clinicaltrials_create_link` tool.
 */
export const CreateLinkOutputSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The full ClinicalTrials.gov link for the given NCT ID."),
});

/**
 * TypeScript type inferred from the output schema.
 */
export type CreateLinkOutput = z.infer<typeof CreateLinkOutputSchema>;

/**
 * Core logic: constructs the ClinicalTrials.gov link for a given NCT ID.
 */
export async function createLinkLogic(
  params: CreateLinkInput,
  context: RequestContext
): Promise<CreateLinkOutput> {
  const nctId = params.nctId.toUpperCase();
  logger.debug(`Constructing ClinicalTrials.gov link for ${nctId}`, {
    ...context,
  });

  const url = `https://clinicaltrials.gov/ct2/show/${nctId}`;

  return { url };
}
