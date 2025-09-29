import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  logger,
  requestContextService,
  ErrorHandler,
} from "../../../utils/index.js";
import {
  CreateLinkInput,
  CreateLinkInputSchema,
  CreateLinkOutputSchema,
  createLinkLogic,
} from "./logic.js";
import { McpError } from "../../../types-global/errors.js";

/**
 * Registers the 'clinicaltrials_create_link' tool with the MCP server.
 */
export const registerCreateLinkTool = async (
  server: McpServer
): Promise<void> => {
  const toolName = "clinicaltrials_create_link";
  const toolDescription =
    "Constructs the ClinicalTrials.gov link for a given clinical trial based on its NCT ID.";

  server.registerTool(
    toolName,
    {
      title: "Create Clinical Trial Link",
      description: toolDescription,
      inputSchema: CreateLinkInputSchema.shape,
      outputSchema: CreateLinkOutputSchema.shape,
      annotations: { readOnlyHint: true },
    },
    async (params: CreateLinkInput, callContext) => {
      const handlerContext = requestContextService.createRequestContext({
        toolName,
        parentContext: callContext,
      });

      try {
        const result = await createLinkLogic(params, handlerContext);
        return {
          structuredContent: result,
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
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
    }
  );

  logger.info(`Tool '${toolName}' registered successfully.`);
};
