# Changelog

All notable changes to this project will be documented in this file.

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
