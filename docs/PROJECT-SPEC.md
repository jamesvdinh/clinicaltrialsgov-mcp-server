# Project Specification: ClinicalTrials.gov MCP Server

**Author:** Cline
**Date:** 2025-06-17

## 1. Overview

This document outlines the plan for creating a new Model Context Protocol (MCP) Server that provides a robust, developer-friendly interface to the official [ClinicalTrials.gov REST API](https://clinicaltrials.gov/api/v2/docs). The server will encapsulate the complexity of the underlying API, exposing its functionality through a set of well-defined, easy-to-use tools.

The primary goal is to enable seamless interaction with clinical trial data for research, analysis, and application development, adhering strictly to the architectural principles and coding standards defined in the project's `.clinerules`.

## 2. Core Architecture

The server will be built upon the existing `mcp-ts-template`, ensuring consistency with the established patterns.

### 2.1. Adherence to `.clinerules`

All development will strictly follow the mandatory guidelines:

- **Separation of Concerns**: `logic.ts` files will contain pure business logic and throw `McpError` on failure. `registration.ts` files will act as handlers, containing `try...catch` blocks and formatting all final `CallToolResult` objects.
- **Structured Logging & Tracing**: All operations will use the `requestContextService` to create and propagate a `RequestContext`. All logging will be performed via the central `logger` with the context attached.
- **File Structure**: Each tool will be self-contained within its own directory under `src/mcp-server/tools/`.

### 2.2. API Service Layer

A dedicated service singleton, `ClinicalTrialsGovService`, will be created to manage all interactions with the external ClinicalTrials.gov API.

- **Location**: `src/services/clinical-trials-gov/`
- **Responsibilities**:
  - Encapsulate the base URL (`https://clinicaltrials.gov/api/v2`).
  - Contain methods corresponding to each API endpoint (e.g., `listStudies`, `fetchStudy`).
  - Handle the construction of query strings from tool parameters.
  - Manage network requests using the project's `fetchWithTimeout` utility.
  - Perform initial response validation and throw structured errors for non-successful HTTP statuses.

### 2.3. Type Definitions

A `types.ts` file will be created within the service directory (`src/services/clinical-trials-gov/types.ts`) to hold TypeScript interfaces for the various data structures returned by the API (e.g., `Study`, `PagedStudies`, `FieldNode`). This ensures type safety throughout the server.

### 2.4. Data Caching and Persistence

To enhance data availability and reduce redundant API calls, all data retrieved from the ClinicalTrials.gov API will be automatically saved to the local filesystem.

- **Configurability**: The data storage path will be configurable via a `CLINICALTRIALS_DATA_PATH` environment variable. The `config/index.ts` file will be updated to manage this variable.
- **Default Location**: If the environment variable is not set, the system will default to saving files in the `./data` directory at the project root. This directory will be created if it does not exist.
- **Responsibility**: The `ClinicalTrialsGovService` will be responsible for handling the file-saving logic immediately after a successful API response is received, using the configured path.
- **File Naming**: To ensure data integrity and prevent collisions, files will be named based on the query that generated them. For single-study lookups, the NCT ID will be used (e.g., `NCT12345678.json`). For list results, a hash of the query parameters may be used.
- **Format**: All data will be saved in JSON format.

## 3. Proposed File Structure

```
src/
├── mcp-server/
│   ├── tools/
│   │   ├── listStudies/
│   │   │   ├── index.ts
│   │   │   ├── logic.ts
│   │   │   └── registration.ts
│   │   ├── getStudy/
│   │   │   ├── index.ts
│   │   │   ├── logic.ts
│   │   │   └── registration.ts
│   │   ├── getStudyMetadata/
│   │   │   ├── index.ts
│   │   │   ├── logic.ts
│   │   │   └── registration.ts
│   │   ├── getApiStats/
│   │   │   ├── index.ts
│   │   │   ├── logic.ts
│   │   │   └── registration.ts
│   │   └── getApiVersion/
│   │       ├── index.ts
│   │       ├── logic.ts
│   │       └── registration.ts
│   └── ...
├── services/
│   ├── clinical-trials-gov/
│   │   ├── ClinicalTrialsGovService.ts
│   │   ├── index.ts
│   │   └── types.ts
│   └── ...
└── ...
```

## 4. Tool Specifications

The following tools will be created to expose the API's functionality.

---

### 4.1. Tool: `clinicaltrials_list_studies`

- **Description**: Searches for clinical studies using a combination of query terms and filters. Supports pagination. This tool wraps the powerful but complex `/studies` endpoint.
- **Endpoint**: `GET /studies`
- **Input Schema (`logic.ts`)**:
  ```typescript
  export const ListStudiesInputSchema = z.object({
    query: z
      .object({
        cond: z
          .string()
          .optional()
          .describe("Query for conditions or diseases."),
        term: z
          .string()
          .optional()
          .describe("Query for other terms (e.g., dates, areas)."),
        locn: z.string().optional().describe("Query for location terms."),
        titles: z
          .string()
          .optional()
          .describe("Query for study titles or acronyms."),
        intr: z
          .string()
          .optional()
          .describe("Query for interventions or treatments."),
        outc: z.string().optional().describe("Query for outcome measures."),
        spons: z
          .string()
          .optional()
          .describe("Query for sponsors or collaborators."),
        id: z.string().optional().describe("Query for study IDs (NCT, etc.)."),
      })
      .optional()
      .describe("Essie expression queries that affect ranking."),
    filter: z
      .object({
        ids: z
          .array(z.string())
          .optional()
          .describe("Filter by a list of NCT IDs."),
        overallStatus: z
          .array(z.nativeEnum(Status))
          .optional()
          .describe("Filter by study status."),
        geo: z
          .string()
          .optional()
          .describe("Filter by geographic distance: distance(lat,lon,dist)."),
        advanced: z
          .string()
          .optional()
          .describe("Advanced filter using Essie expression syntax."),
      })
      .optional()
      .describe("Filters that do not affect ranking."),
    fields: z
      .array(z.string())
      .optional()
      .describe("Comma-separated list of fields to return."),
    sort: z
      .array(z.string())
      .optional()
      .describe("Sort order for the results."),
    pageSize: z.number().int().min(1).max(1000).default(50).optional(),
    pageToken: z
      .string()
      .optional()
      .describe("Token for retrieving the next page of results."),
    countTotal: z
      .boolean()
      .default(false)
      .optional()
      .describe("Set to true to get the total count of matching studies."),
  });
  ```
- **Output**: A `CallToolResult` containing a JSON object with the list of `studies` and a `nextPageToken` if more results are available.

---

### 4.2. Tool: `clinicaltrials_get_study`

- **Description**: Retrieves detailed information for a single clinical study by its NCT number.
- **Endpoint**: `GET /studies/{nctId}`
- **Input Schema (`logic.ts`)**:
  ```typescript
  export const GetStudyInputSchema = z.object({
    nctId: z
      .string()
      .regex(/^[Nn][Cc][Tt]\d+$/)
      .describe("The NCT Number of the study to fetch."),
    format: z
      .enum(["json", "csv", "json.zip", "fhir.json", "ris"])
      .default("json")
      .optional(),
    markupFormat: z.enum(["markdown", "legacy"]).default("markdown").optional(),
    fields: z
      .array(z.string())
      .optional()
      .describe("List of specific fields to return."),
  });
  ```
- **Output**: A `CallToolResult` containing the full study data in the requested format.

---

### 4.3. Tool: `clinicaltrials_get_study_metadata`

- **Description**: Provides the complete data model for study fields, which is useful for understanding the available data structure and for constructing precise `fields` parameters in other tools.
- **Endpoint**: `GET /studies/metadata`
- **Input Schema (`logic.ts`)**:
  ```typescript
  export const GetStudyMetadataInputSchema = z.object({
    includeIndexedOnly: z.boolean().default(false).optional(),
    includeHistoricOnly: z.boolean().default(false).optional(),
  });
  ```
- **Output**: A `CallToolResult` containing the list of `FieldNode` objects that define the study data structure.

---

### 4.4. Tool: `clinicaltrials_get_api_stats`

- **Description**: Fetches various statistics from the ClinicalTrials.gov API, such as study sizes, field value distributions, and list field sizes.
- **Endpoints**: `GET /stats/size`, `GET /stats/field/values`, `GET /stats/field/sizes`
- **Input Schema (`logic.ts`)**:
  ```typescript
  export const GetApiStatsInputSchema = z.object({
    statType: z
      .enum(["studySize", "fieldValues", "listFieldSizes"])
      .describe("The type of statistics to retrieve."),
    fields: z
      .array(z.string())
      .optional()
      .describe(
        "For 'fieldValues' and 'listFieldSizes', specifies which fields to get stats for.",
      ),
    types: z
      .array(z.string())
      .optional()
      .describe(
        "For 'fieldValues', filter by field data types (e.g., ENUM, INTEGER).",
      ),
  });
  ```
- **Output**: A `CallToolResult` containing the requested statistical data.

---

## 5. Implementation Plan

The implementation will proceed in the following phases:

1.  **Setup Service Layer & Data Persistence**:

    - **Update Configuration**: Modify `src/config/index.ts` to include a new `CLINICALTRIALS_DATA_PATH` environment variable, with `./data` as the default value.
    - Create the `src/services/clinical-trials-gov/` directory.
    - Implement `ClinicalTrialsGovService.ts` with the base URL and fetch logic.
    - **Implement auto-saving**: Within the service, add logic to save all successful API responses as JSON files to the path specified in the configuration.
    - Define initial type interfaces in `types.ts`.

2.  **Implement `clinicaltrials_get_study` Tool**:

    - Create the tool structure.
    - Implement the logic to handle the `nctId` path parameter and other query options.
    - Expand `types.ts` with the `Study` interface.

3.  **Implement `clinicaltrials_list_studies` Tool**:

    - This is the most complex tool.
    - Carefully map the Zod schema to the numerous query parameters.
    - Implement logic to handle pagination via `pageToken`.

4.  **Implement Remaining Tools**:

    - Implement `clinicaltrials_get_api_stats` and `clinicaltrials_get_study_metadata` tools.

5.  **Refinement and Documentation**:
    - Add comprehensive JSDoc comments to all files, functions, and types.
    - Ensure all code is formatted with Prettier.
    - Write unit tests for the service layer and tool logic.
    - Update the main `README.md` to document the new server's capabilities.
