# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-06-17

### Added

- **Initial Project Setup**: Migrated from `mcp-ts-template` to establish the `clinicaltrialsgov-mcp-server` project.
- **Project Specification**: Added `PROJECT-SPEC.md` outlining the architecture, tools, and implementation plan for the server.
- **API Specification**: Included the ClinicalTrials.gov OpenAPI specification in `docs/ctg-oas-v2.yaml`.

### Changed

- **Project Identity**: Updated `package.json`, `README.md`, `.clinerules`, and other configuration files to reflect the new project name, description, and version.
- **Codebase**: Removed all `mcp-client` and example-specific code (`duckdbExample`) from the template to create a clean foundation for the new server.
