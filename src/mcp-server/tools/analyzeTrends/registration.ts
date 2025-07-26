/**
 * @fileoverview Handles registration and error handling for the `clinicaltrials_analyze_trends` tool.
 * @module src/mcp-server/tools/analyzeTrends/registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpError } from "../../../types-global/errors.js";
import {
  ErrorHandler,
  logger,
  requestContextService,
} from "../../../utils/index.js";
import {
  AnalyzeTrendsInput,
  AnalyzeTrendsInputSchema,
  analyzeTrendsLogic,
  AnalyzeTrendsOutputSchema,
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

  server.registerTool(
    toolName,
    {
      title: "Analyze Clinical Trial Trends",
      description: toolDescription,
      inputSchema: AnalyzeTrendsInputSchema.shape,
      outputSchema: AnalyzeTrendsOutputSchema.shape,
      annotations: { readOnlyHint: true },
    },
    async (params: AnalyzeTrendsInput, callContext) => {
      const handlerContext = requestContextService.createRequestContext({
        toolName,
        parentContext: callContext,
      });

      try {
        const result = await analyzeTrendsLogic(params, handlerContext);
        const resultsSummary = Object.entries(result.results)
          .map(([key, value]) => `  - ${key}: ${value}`)
          .join("\n");

        const summaryText =
          `Successfully analyzed ${result.totalStudies} studies for trend '${result.analysisType}'.\n\n` +
          `Analysis Results:\n${resultsSummary}`;

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
