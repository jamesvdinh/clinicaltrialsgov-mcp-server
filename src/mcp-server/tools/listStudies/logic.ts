/**
 * @fileoverview Defines the core logic, schemas, and types for the `clinicaltrials_list_studies` tool.
 * @module src/mcp-server/tools/listStudies/logic
 */
import { z } from "zod";
import {
  ClinicalTrialsGovService,
  PagedStudies,
  Status,
} from "../../../services/clinical-trials-gov/index.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { cleanStudy } from "../../../utils/clinicaltrials/jsonCleaner.js";
import { logger, type RequestContext } from "../../../utils/index.js";

/**
 * Zod schema for the `clinicaltrials_list_studies` tool input.
 */
export const ListStudiesInputSchema = z.object({
  query: z
    .object({
      cond: z.string().optional().describe("Query for conditions or diseases."),
      term: z
        .string()
        .optional()
        .describe("Query for other terms (e.g., dates, areas)."),
      locn: z.string().optional().describe("Query for location terms."),
      titles: z
        .string()
        .optional()
        .describe("Query for study titles or acronyms."),
      intr: z
        .string()
        .optional()
        .describe("Query for interventions or treatments."),
      outc: z.string().optional().describe("Query for outcome measures."),
      spons: z
        .string()
        .optional()
        .describe("Query for sponsors or collaborators."),
      id: z.string().optional().describe("Query for study IDs (NCT, etc.)."),
    })
    .optional()
    .describe("Essie expression queries that affect ranking."),
  filter: z
    .object({
      ids: z
        .array(z.string())
        .optional()
        .describe("Filter by a list of NCT IDs."),
      overallStatus: z
        .array(z.nativeEnum(Status))
        .optional()
        .describe("Filter by study status."),
      geo: z
        .string()
        .optional()
        .describe("Filter by geographic distance: distance(lat,lon,dist)."),
      advanced: z
        .string()
        .optional()
        .describe("Advanced filter using Essie expression syntax."),
    })
    .optional()
    .describe("Filters that do not affect ranking."),
  fields: z
    .array(z.string())
    .optional()
    .describe("Comma-separated list of fields to return."),
  sort: z.array(z.string()).optional().describe("Sort order for the results."),
  pageSize: z
    .number()
    .int()
    .min(1)
    .max(200)
    .default(15)
    .optional()
    .describe(
      "The number of studies to return per page. Default is 15, maximum is 200.",
    ),
  pageToken: z
    .string()
    .optional()
    .describe("Token for retrieving the next page of results."),
  countTotal: z
    .boolean()
    .default(true)
    .optional()
    .describe(
      "Set to true to get the total count of matching studies. Default is true.",
    ),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type ListStudiesInput = z.infer<typeof ListStudiesInputSchema>;

/**
 * Implements the core logic for the `clinicaltrials_list_studies` tool.
 * @param params - The validated input parameters for the tool.
 * @param context - The request context for logging and tracing.
 * @returns A promise that resolves with the paged list of studies.
 * @throws {McpError} If the API request fails.
 */
export async function listStudiesLogic(
  params: ListStudiesInput,
  context: RequestContext,
): Promise<PagedStudies> {
  logger.debug("Executing listStudiesLogic", { ...context, toolInput: params });
  const service = new ClinicalTrialsGovService();
  const pagedStudies = await service.listStudies(params, context);
  logger.info("Successfully listed studies.", { ...context });

  if (pagedStudies.studies) {
    pagedStudies.studies = pagedStudies.studies.map(cleanStudy);
  }

  return pagedStudies;
}
