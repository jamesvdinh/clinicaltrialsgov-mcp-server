# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-07-26

### Changed

- **Tool Schemas and Descriptions**:
  - **`getStudy`**: The `nctIds` parameter description is now more concise. The `summaryOnly` description was updated for clarity. All field descriptions were refined to be more direct and LLM-friendly.
  - **`searchStudies`**: The default `pageSize` was changed from `50` to `10` to provide more focused results and match native API behavior.
- **Output Formatting**:
  - **`getStudy`**: The tool's text output now only contains the JSON result, removing redundant summary text for a cleaner response.
  - **`searchStudies`**: The text output is now formatted as a structured Markdown list, providing a clear, readable summary of each study's key details (NCT ID, Title, Status, Summary, Interventions, Sponsor).
- **Examples**: Replaced all `.json` example files with more descriptive `.md` files. The new Markdown examples provide both the tool call and a formatted response, making them easier to understand.

## [1.0.10] - 2025-07-26

### Changed

- **`analyzeTrends` Tool Enhancement**: The `clinicaltrials_analyze_trends` tool can now process an array of analysis types in a single request (e.g., `["countByStatus", "countByCountry"]`), returning a distinct analysis for each type. This improves efficiency by allowing multiple aggregations over a single dataset.
- **Dependencies**: Updated `typescript` to `^5.5.4` and `@types/node` to `^20.16.1`.

## [1.0.9] - 2025-07-26

### Added

- **`searchStudies` Tool**: Introduced the `clinicaltrials_search_studies` tool, replacing the former `listStudies` tool. This new tool provides a more explicit and descriptive interface for searching clinical trials.
- **Zod Output Schemas**: Implemented Zod schemas for the output of all tools (`getStudy`, `searchStudies`, `analyzeTrends`), ensuring that the data returned to the model is strictly validated and typed.
- **Enhanced Type Safety**: Introduced `StudySchema` and `PagedStudiesSchema` in `types.ts` using Zod, establishing a single source of truth for data structures and improving runtime type safety.

### Changed

- **Architectural Overhaul**: Upgraded the entire project to align with the new v2.0 architectural standards defined in `.clinerules`. This includes:
  - **Strict "Logic Throws, Handlers Catch" Pattern**: All tools (`getStudy`, `searchStudies`, `analyzeTrends`) were refactored to isolate business logic in `logic.ts` files, which now throw structured `McpError`s. The `registration.ts` files now exclusively handle `try...catch` blocks and format the final `CallToolResult`.
  - **Standardized Tool Registration**: The tool registration process in `server.ts` and individual registration files has been updated to use the new `server.registerTool` method, which requires explicit `title`, `description`, `inputSchema`, and `outputSchema`.
- **`getStudy` Tool Refactor**: The `clinicaltrials_get_study` tool now returns a structured object `{ studies: [...] }` and supports fetching multiple studies or summaries in a single call, aligning with the new output schema standards.
- **`analyzeTrends` Tool Refactor**: The `clinicaltrials_analyze_trends` tool was updated to use the new `searchStudies` logic as its foundation and now returns a structured `AnalysisResult` object.
- **Dependencies**: Updated all major dependencies to their latest versions, including `@modelcontextprotocol/sdk` to `^1.17.0`, `hono` to `^4.8.9`, and `typescript-eslint` to `^8.38.0`.
- **Developer Guidelines**: The `.clinerules` file was updated to v2.0, formalizing the new architectural patterns and providing clearer guidance for future development.

### Removed

- **`listStudies` Tool**: The `clinicaltrials_list_studies` tool has been completely removed and replaced by the new `clinicaltrials_search_studies` tool to better reflect its functionality.

## [1.0.8] - 2025-07-12

### Changed

- **Singleton Service**: Refactored `ClinicalTrialsGovService` to implement the singleton pattern, ensuring a single, shared instance is used across the application. This improves efficiency and consistency.
- **Type Safety**: Enhanced type safety throughout the codebase by replacing `any` with more specific types like `unknown` or defined interfaces. This includes updates to tool registrations, service layers, and utility fnctions.
- **Error Handling**: Improved error handling in scripts and configuration loaders by using `unknown` and providing more robust error messages.
- **Dependencies**: Updated all major dependencies to their latest versions, including `@modelcontextprotocol/sdk`, `@supabase/supabase-js`, `@types/node`, `eslint`, `node-cron`, and `openai`.
- **Documentation**: Regenerated the `docs/tree.md` file to reflect the latest project structure.

### Fixed

- **`listStudies` Logic**: Corrected the logic for handling the `geo` filter to ensure it is properly transformed into the required API format.
- **`analyzeTrends` Logic**: Fixed an issue in the `countByPhase` analysis to correctly handle studies with multiple phases.

## [1.0.7] - 2025-07-09

### Changed

- **Documentation**: Updated `README.md` to accurately reflect the current toolset, including the `analyzeTrends` tool and the multi-ID capabilities of `getStudy`. Also regenerated the `docs/tree.md` file to match the current project structure.
- **Package Metadata**: Improved the project's `package.json` by refining the description for clarity and adding more relevant keywords to enhance discoverability.

## [1.0.6] - 2025-07-09

### Added

- **Scheduling Service**: Introduced a new `SchedulerService` (`src/utils/scheduling`) to manage cron jobs. This service provides a unified interface for scheduling, starting, stopping, and listing recurring tasks.

### Changed

- **Template Alignment**: Updated the project to align with the latest `cyanheads/mcp-ts-template@v1.6.2`, incorporating improvements in error handling, configuration management, and code structure.
- **HTTP Transport**: Refactored the HTTP transport layer to improve port handling and retry logic, making the server startup more robust.
- **`listStudies` Tool**: Adjusted the default `pageSize` to `5` and the maximum to `50` to better align with current model token limits.
- **`analyzeTrends` Tool**: Increased the `pageSize` to `1000` to optimize data fetching for large-scale analyses.
- **Error Handling**: Improved error message generation in the `ErrorHandler` for non-standard error objects.
- **Dependencies**: Added `node-cron` for the new scheduling service.

### Fixed

- **Sanitization Logic**: Corrected the `structuredClone` usage to be compatible with different JavaScript environments.

## [1.0.5] - 2025-07-09

### Added

- **`analyzeTrends` Tool**: Introduced a new tool, `clinicaltrials_analyze_trends`, to perform statistical analysis on study sets. This tool can aggregate data by status, country, sponsor type, or phase, providing valuable insights into clinical trial trends.
- **ESLint Configuration**: Added a new ESLint setup (`eslint.config.js`) to enforce code quality and consistency across the project.

### Changed

- **`getStudy` Tool Enhancement**: The `clinicaltrials_get_study` tool can now fetch multiple studies by accepting an array of NCT IDs. It also includes a `summaryOnly` option to return condensed study summaries instead of full data.
- **`listStudies` Tool Enhancement**: The `clinicaltrials_list_studies` tool now supports geographic filtering with a structured `geo` object (latitude, longitude, radius), making location-based searches more intuitive.
- **Type Definitions**: Significantly expanded the `Study` type in `types.ts` to more accurately reflect the structure of the ClinicalTrials.gov API, improving type safety and developer experience.

### Dependencies

- Updated numerous dependencies to their latest versions, including `@supabase/supabase-js`, `@types/node`, `openai`, and `zod`.
- Added new development dependencies for ESLint, including `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, and `eslint-plugin-prettier`.

## [1.0.4] - 2025-07-05

### Changed

- **Configuration Resilience**: Improved the startup process by making the `logs` and `data` directory configurations more resilient. The server now falls back to default paths and logs a warning instead of exiting if a custom path is invalid or inaccessible.
- **Conditional Backup**: The `ClinicalTrialsGovService` now only attempts to write backup files if a valid data path is configured, preventing errors when the data directory is unavailable.

### Dependencies

- Updated various dependencies to their latest versions, including `@hono/node-server`, `@modelcontextprotocol/sdk`, `@supabase/supabase-js`, `hono`, `openai`, and `zod`.

## [1.0.3] - 2025-06-24

### Dependencies

- Updated various dependencies to their latest versions, including `@modelcontextprotocol/sdk` to `^1.13.1`, `@supabase/supabase-js` to `^2.50.1`, and `hono` to `^4.8.3`.
- Removed `jsonwebtoken` as it is no longer a direct dependency.

### Changed

- **Documentation**: Cleaned up minor formatting inconsistencies in JSDoc reference documentation and project-related markdown files.

## [1.0.2] - 2025-06-20

**Alignment with cyanheads/mcp-ts-template@v1.5.6**

### Changed

- **Authentication Refactor**: Restructured the authentication middleware to be more modular and extensible. The core logic is now separated into `core` and `strategies` directories, with dedicated modules for JWT and OAuth. This improves separation of concerns and makes it easier to add new authentication methods in the future.
- **Centralized HTTP Error Handling**: Implemented a new `httpErrorHandler.ts` to centralize all HTTP error responses. This ensures consistent error formatting and status codes across the application, improving predictability and making the API easier to consume.
- **Session Management**: Removed the manual session garbage collection logic from `httpTransport.ts`. Session cleanup is now handled by the `StreamableHTTPServerTransport`'s `onclose` event, making the implementation cleaner and more reliable.

### Dependencies

- Updated `hono` to `^4.8.2` and `openai` to `^5.6.0`.

## [1.0.1] - 2025-06-18

### Changed

- **Error Handling**: Refactored `getStudy` and `listStudies` tool logic to align with the "Logic Throws, Handlers Catch" principle, ensuring that core logic files only throw structured `McpError` instances, while registration files handle the `try...catch` blocks and response formatting.
- **Dockerfile**: Optimized the `Dockerfile` by restructuring it into a multi-stage build. This change improves caching, reduces the final image size, and separates build-time dependencies from runtime dependencies.
- **Documentation**: Updated `README.md` with clearer installation instructions, updated dependency badges, and moved the project specification to the `docs/` directory.

### Dependencies

- Bumped `@modelcontextprotocol/sdk` from `^1.12.3` to `^1.13.0`.
- Updated `hono`, `openai`, and other dependencies to their latest patch versions.

## [1.0.0] - 2025-06-17

### Added

- **Initial Project Setup**: Migrated from `mcp-ts-template` to establish the `clinicaltrialsgov-mcp-server` project.
- **Project Specification**: Added `PROJECT-SPEC.md` outlining the architecture, tools, and implementation plan for the server.
- **API Specification**: Included the ClinicalTrials.gov OpenAPI specification in `docs/ctg-oas-v2.yaml`.
- **ClinicalTrials.gov Service**: Implemented `ClinicalTrialsGovService` to interact with the official ClinicalTrials.gov API, including response caching to the `data/` directory.
- **`getStudy` Tool**: Created the `clinicaltrials_get_study` tool to fetch detailed information for a single clinical study by its NCT number.
- **`listStudies` Tool**: Created the `clinicaltrials_list_studies` tool to search for studies with advanced filtering and pagination.
- **Data Cleaning Utilities**: Added `jsonCleaner.ts` to process and simplify API responses.
- **Configuration**: Added `CLINICALTRIALS_DATA_PATH` to environment configuration for managing backed up data (all data retrieved from the ClinicalTrials.gov API is automatically backed up, but the tools always use live data).

### Changed

- **Project Identity**: Updated `package.json`, `README.md`, `.clinerules`, and other configuration files to reflect the new project name, description, and version.
- **Project Focus**: Refactored the server to remove generic example tools (`echo`, `catFactFetcher`, `imageTest`) and resources, replacing them with a dedicated ClinicalTrials.gov integration.
- **Error Handling**: Added `INVALID_INPUT` to `BaseErrorCode` for more specific error handling.
- **Dependencies**: Removed `duck-db` and `openai` dependencies that were part of the old example code.

### Removed

- **Example Tools and Resources**: Deleted all files related to `echoTool`, `catFactFetcher`, `imageTest`, and `echoResource`.
- **DuckDB Service**: Removed the `duck-db` service module as it is no longer required.
- **OpenRouter Service**: Removed the `openRouterProvider` as it is no longer required.
