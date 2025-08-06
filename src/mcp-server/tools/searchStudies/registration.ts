/**
 * @fileoverview Handles registration and error handling for the `clinicaltrials_search_studies` tool.
 * @module src/mcp-server/tools/searchStudies/registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpError } from "../../../types-global/errors.js";
import {
  ErrorHandler,
  logger,
  requestContextService,
} from "../../../utils/index.js";
import {
  SearchStudiesInput,
  SearchStudiesInputSchema,
  searchStudiesLogic,
  SearchStudiesOutputSchema,
} from "./logic.js";

/**
 * Registers the 'clinicaltrials_search_studies' tool with the MCP server.
 * @param server - The MCP server instance.
 */
export const registerSearchStudiesTool = async (
  server: McpServer,
): Promise<void> => {
  const toolName = "clinicaltrials_search_studies";
  const toolDescription =
    "Searches for clinical studies using a combination of query terms and filters. Supports pagination, sorting, and geographic filtering.";

  server.registerTool(
    toolName,
    {
      title: "Search Clinical Studies",
      description: toolDescription,
      inputSchema: SearchStudiesInputSchema.shape,
      outputSchema: SearchStudiesOutputSchema.shape,
      annotations: { readOnlyHint: true },
    },
    async (params: SearchStudiesInput, callContext) => {
      const handlerContext = requestContextService.createRequestContext({
        toolName,
        parentContext: callContext,
      });

      try {
        const result = await searchStudiesLogic(params, handlerContext);
        const studies = result.studies;
        const studySummaries =
          studies?.map((study) => {
            const idModule = study.protocolSection?.identificationModule;
            const statusModule = study.protocolSection?.statusModule;
            const descriptionModule = study.protocolSection?.descriptionModule;
            const interventionsModule =
              study.protocolSection?.armsInterventionsModule;
            const sponsorModule =
              study.protocolSection?.sponsorCollaboratorsModule;
            const designModule = study.protocolSection?.designModule;
            const eligibilityModule = study.protocolSection?.eligibilityModule;
            const contactsLocationsModule =
              study.protocolSection?.contactsLocationsModule;

            const interventions =
              interventionsModule?.interventions
                ?.map((i) => i.name)
                .join(", ") ?? "N/A";

            const locations =
              [
                ...new Set(
                  contactsLocationsModule?.locations
                    ?.map((l) => l.country)
                    .filter((c) => c) ?? [],
                ),
              ].join(", ") || "N/A";

            return `
- **NCT ID:** ${idModule?.nctId ?? "N/A"}
- **Title:** ${idModule?.briefTitle ?? "N/A"}
- **Status:** ${statusModule?.overallStatus ?? "N/A"}
- **Study Type:** ${designModule?.studyType ?? "N/A"}
- **Phases:** ${designModule?.phases?.join(", ") ?? "N/A"}
- **Eligibility:** ${eligibilityModule?.sex ?? "N/A"}, ${
              eligibilityModule?.minimumAge ?? "N/A"
            }
- **Locations:** ${locations}
- **Summary:** ${descriptionModule?.briefSummary ?? "N/A"}
- **Interventions:** ${interventions}
- **Sponsor:** ${sponsorModule?.leadSponsor?.name ?? "N/A"}
`;
          }) ?? [];
        let summaryText =
          `Successfully retrieved ${studies?.length ?? 0} studies.\n` +
          studySummaries.join("\n---\n");

        if (result.nextPageToken) {
          summaryText += `\nNext Page Token: ${result.nextPageToken}`;
        }
        if (result.totalCount) {
          summaryText += `\nTotal Count: ${result.totalCount}`;
        }

        return {
          structuredContent: result,
          content: [{ type: "text", text: summaryText }],
        };
      } catch (error) {
        logger.error(`Error in ${toolName} handler`, {
          error,
          ...handlerContext,
        });
        const mcpError = ErrorHandler.handleError(error, {
          operation: toolName,
          context: handlerContext,
          input: params,
        }) as McpError;

        return {
          isError: true,
          content: [{ type: "text", text: mcpError.message }],
          structuredContent: {
            code: mcpError.code,
            message: mcpError.message,
            details: mcpError.details,
          },
        };
      }
    },
  );
  logger.info(`Tool '${toolName}' registered successfully.`);
};
