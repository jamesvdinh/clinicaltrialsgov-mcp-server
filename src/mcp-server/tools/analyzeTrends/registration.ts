/**
 * @fileoverview Handles the registration of the `clinicaltrials_analyze_trends` tool.
 * @module src/mcp-server/tools/analyzeTrends/registration
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
import {
  AnalyzeTrendsInput,
  AnalyzeTrendsInputSchema,
  analyzeTrendsLogic,
} from "./logic.js";

/**
 * Registers the 'clinicaltrials_analyze_trends' tool with the MCP server.
 * @param server - The MCP server instance.
 */
export const registerAnalyzeTrendsTool = async (
  server: McpServer,
): Promise<void> => {
  const toolName = "clinicaltrials_analyze_trends";
  const toolDescription =
    "Performs a statistical analysis on a set of clinical trials, aggregating data by status, country, sponsor, or phase. Use specific query parameters to refine the analysis and filter the studies included in the analysis. The tool can handle up to 5000 studies per analysis.";

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
        AnalyzeTrendsInputSchema.shape,
        async (
          params: AnalyzeTrendsInput,
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
            const validatedParams = AnalyzeTrendsInputSchema.safeParse(params);
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

            const result = await analyzeTrendsLogic(
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
              operation: "analyzeTrendsToolHandler",
              context: handlerContext,
              input: params,
            });

            const mcpError =
              handledError instanceof McpError
                ? handledError
                : new McpError(
                    BaseErrorCode.INTERNAL_ERROR,
                    "An unexpected error occurred.",
                    { originalError: handledError.message },
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
