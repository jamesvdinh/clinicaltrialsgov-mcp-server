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
import { McpError } from "../../../types-global/errors.js";
import { cleanStudy } from "../../../utils/clinicaltrials/jsonCleaner.js";
import { logger, type RequestContext } from "../../../utils/index.js";

/**
 * Zod schema for the `clinicaltrials_list_studies` tool input.
 */
export const ListStudiesInputSchema = z.object({
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
        .array(z.nativeEnum(Status))
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
    .default(15)
    .optional()
    .describe(
      "The number of studies to return per page (1-200). Defaults to 15.",
    ),
  pageToken: z
    .string()
    .optional()
    .describe("A token used to retrieve the next page of results."),
  countTotal: z
    .boolean()
    .default(true)
    .optional()
    .describe(
      "If true, includes the total count of matching studies in the response.",
    ),
});

/**
 * TypeScript type inferred from the input schema.
 */
export type ListStudiesInput = z.infer<typeof ListStudiesInputSchema>;

/**
 * Searches for clinical studies using a combination of queries and filters.
 * Supports pagination, sorting, and geographic filtering.
 *
 * @param params - The validated input parameters for the tool.
 * @param context - The request context for logging and tracing.
 * @returns A promise that resolves with a paginated list of studies.
 * @throws {McpError} If the API request fails.
 */
export async function listStudiesLogic(
  params: ListStudiesInput,
  context: RequestContext,
): Promise<PagedStudies> {
  logger.debug("Executing listStudiesLogic", { ...context, toolInput: params });

  // Create a mutable copy of params to transform the geo filter
  const apiParams: any = { ...params };

  if (apiParams.filter?.geo) {
    const { latitude, longitude, radius, unit } = apiParams.filter.geo;
    const geoString = `distance(${latitude},${longitude},${radius}${unit})`;

    // Create a new filter object with the transformed geo string
    apiParams.filter = {
      ...apiParams.filter,
      geo: geoString,
    };
    logger.debug(`Transformed geo filter to: ${geoString}`, { ...context });
  }

  const service = new ClinicalTrialsGovService();
  const pagedStudies = await service.listStudies(apiParams, context);
  logger.info("Successfully listed studies.", { ...context });

  if (pagedStudies.studies) {
    pagedStudies.studies = pagedStudies.studies.map(cleanStudy);
  }

  return pagedStudies;
}
