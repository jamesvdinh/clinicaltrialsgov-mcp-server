/**
 * @fileoverview Handles the registration of the `clinicaltrials_get_study` tool.
 * @module src/mcp-server/tools/getStudy/registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import {
  ErrorHandler,
  logger,
  RequestContext,
  requestContextService,
} from "../../../utils/index.js";
import { GetStudyInput, GetStudyInputSchema, getStudyLogic } from "./logic.js";

/**
 * Registers the 'clinicaltrials_get_study' tool with the MCP server.
 * @param server - The MCP server instance.
 */
export const registerGetStudyTool = async (
  server: McpServer,
): Promise<void> => {
  const toolName = "clinicaltrials_get_study";
  const toolDescription =
    "Retrieves detailed information for a single clinical study by its NCT number.";

  const registrationContext: RequestContext =
    requestContextService.createRequestContext({
      operation: "RegisterTool",
      toolName: toolName,
    });

  logger.info(`Registering tool: '${toolName}'`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.tool(
        toolName,
        toolDescription,
        GetStudyInputSchema.shape,
        async (
          params: GetStudyInput,
          mcpContext: any,
        ): Promise<CallToolResult> => {
          const handlerContext: RequestContext =
            requestContextService.createRequestContext({
              parentRequestId: registrationContext.requestId,
              operation: "HandleToolRequest",
              toolName: toolName,
              mcpToolContext: mcpContext,
              input: params,
            });

          try {
            const validatedParams = GetStudyInputSchema.safeParse(params);
            if (!validatedParams.success) {
              const error = new McpError(
                BaseErrorCode.VALIDATION_ERROR,
                "Invalid input parameters.",
                { issues: validatedParams.error.issues },
              );
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({
                      error: {
                        code: error.code,
                        message: error.message,
                        details: error.details,
                      },
                    }),
                  },
                ],
                isError: true,
              };
            }

            const result = await getStudyLogic(
              validatedParams.data,
              handlerContext,
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(result, null, 2) },
              ],
              isError: false,
            };
          } catch (error) {
            const handledError = ErrorHandler.handleError(error, {
              operation: "getStudyToolHandler",
              context: handlerContext,
              input: params,
            });

            let mcpError: McpError;

            if (
              handledError instanceof McpError &&
              handledError.message.includes("Study not found")
            ) {
              mcpError = new McpError(
                BaseErrorCode.NOT_FOUND,
                `The requested study with NCT ID '${params.nctId}' could not be found.`,
                handledError.details,
              );
            } else if (handledError instanceof McpError) {
              mcpError = handledError;
            } else {
              mcpError = new McpError(
                BaseErrorCode.INTERNAL_ERROR,
                "An unexpected error occurred.",
                { originalError: handledError.message },
              );
            }

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    error: {
                      code: mcpError.code,
                      message: mcpError.message,
                      details: mcpError.details,
                    },
                  }),
                },
              ],
              isError: true,
            };
          }
        },
      );

      logger.info(
        `Tool '${toolName}' registered successfully.`,
        registrationContext,
      );
    },
    {
      operation: `RegisteringTool_${toolName}`,
      context: registrationContext,
      errorCode: BaseErrorCode.INITIALIZATION_FAILED,
      critical: true,
    },
  );
};
