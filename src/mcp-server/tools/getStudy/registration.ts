/**
 * @fileoverview Handles registration and error handling for the `clinicaltrials_get_study` tool.
 * @module src/mcp-server/tools/getStudy/registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpError } from "../../../types-global/errors.js";
import {
  ErrorHandler,
  logger,
  requestContextService,
} from "../../../utils/index.js";
import {
  GetStudyInput,
  GetStudyInputSchema,
  getStudyLogic,
  GetStudyOutputSchema,
} from "./logic.js";

/**
 * Registers the 'clinicaltrials_get_study' tool with the MCP server.
 * @param server - The MCP server instance.
 */
export const registerGetStudyTool = async (
  server: McpServer,
): Promise<void> => {
  const toolName = "clinicaltrials_get_study";
  const toolDescription =
    "Fetches one or more clinical studies from ClinicalTrials.gov by their NCT IDs. Returns either complete study data or concise summaries for each.";

  server.registerTool(
    toolName,
    {
      title: "Fetch Clinical Study",
      description: toolDescription,
      inputSchema: GetStudyInputSchema.shape,
      outputSchema: GetStudyOutputSchema.shape,
      annotations: { readOnlyHint: true },
    },
    async (params: GetStudyInput, callContext) => {
      const handlerContext = requestContextService.createRequestContext({
        toolName,
        parentContext: callContext,
      });

      try {
        const result = await getStudyLogic(params, handlerContext);
        const summaryText = `Successfully fetched ${
          result.studies.length
        } clinical studies: ${result.studies
          .map((s) => {
            if ("protocolSection" in s) {
              return s.protocolSection?.identificationModule?.nctId;
            } else if ("study" in s) {
              return (
                s.study as {
                  protocolSection?: { identificationModule?: { nctId?: string } };
                }
              )?.protocolSection?.identificationModule?.nctId;
            }
            return undefined;
          })
          .filter(Boolean)
          .join(", ")}.`;
        return {
          structuredContent: result,
          content: [
            { type: "text", text: summaryText },
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
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
