# Changelog

All notable changes to this project will be documented in this file.

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
