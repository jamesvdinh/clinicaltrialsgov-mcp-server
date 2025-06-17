/**
 * @fileoverview Handles the registration of the `clinicaltrials_list_studies` tool.
 * @module src/mcp-server/tools/listStudies/registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  ErrorHandler,
  logger,
  RequestContext,
  requestContextService,
} from "../../../utils/index.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import {
  ListStudiesInput,
  ListStudiesInputSchema,
  listStudiesLogic,
} from "./logic.js";

/**
 * Registers the 'clinicaltrials_list_studies' tool with the MCP server.
 * @param server - The MCP server instance.
 */
export const registerListStudiesTool = async (
  server: McpServer,
): Promise<void> => {
  const toolName = "clinicaltrials_list_studies";
  const toolDescription =
    "Searches for clinical studies using a combination of query terms and filters. Supports pagination.";

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
        ListStudiesInputSchema.shape,
        async (
          params: ListStudiesInput,
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
            const validatedParams = ListStudiesInputSchema.safeParse(params);
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

            const result = await listStudiesLogic(
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
              operation: "listStudiesToolHandler",
              context: handlerContext,
              input: params,
            });

            const mcpError =
              handledError instanceof McpError
                ? handledError
                : new McpError(
                    BaseErrorCode.INTERNAL_ERROR,
                    "An unexpected error occurred while listing studies.",
                    { originalErrorName: handledError.name },
                  );

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
