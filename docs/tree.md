# clinicaltrialsgov-mcp-server - Directory Structure

Generated on: 2025-06-17 11:24:46

```
clinicaltrialsgov-mcp-server
├── .github
│   ├── workflows
│   │   └── publish.yml
│   └── FUNDING.yml
├── data
├── docs
│   ├── api-references
│   │   ├── duckDB.md
│   │   ├── jsdoc-standard-tags.md
│   │   └── typedoc-reference.md
│   ├── best-practices.md
│   ├── ctg-oas-v2.yaml
│   └── tree.md
├── examples
│   ├── studies_2025-06-17T11-15-33-773Z.json
│   ├── studies_2025-06-17T11-16-37-179Z.json
│   ├── study_NCT00184067_2025-06-17T11-17-42-480Z.json
│   └── study_NCT03934567_2025-06-17T11-17-59-791Z.json
├── scripts
│   ├── clean.ts
│   ├── fetch-openapi-spec.ts
│   ├── make-executable.ts
│   ├── README.md
│   └── tree.ts
├── src
│   ├── config
│   │   └── index.ts
│   ├── mcp-server
│   │   ├── resources
│   │   ├── tools
│   │   │   ├── getStudy
│   │   │   │   ├── index.ts
│   │   │   │   ├── logic.ts
│   │   │   │   └── registration.ts
│   │   │   └── listStudies
│   │   │       ├── index.ts
│   │   │       ├── logic.ts
│   │   │       └── registration.ts
│   │   ├── transports
│   │   │   ├── authentication
│   │   │   │   ├── authContext.ts
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   ├── authUtils.ts
│   │   │   │   ├── oauthMiddleware.ts
│   │   │   │   └── types.ts
│   │   │   ├── httpTransport.ts
│   │   │   └── stdioTransport.ts
│   │   ├── README.md
│   │   └── server.ts
│   ├── services
│   │   ├── clinical-trials-gov
│   │   │   ├── ClinicalTrialsGovService.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── supabase
│   │       └── supabaseClient.ts
│   ├── types-global
│   │   └── errors.ts
│   ├── utils
│   │   ├── clinicaltrials
│   │   │   └── jsonCleaner.ts
│   │   ├── internal
│   │   │   ├── errorHandler.ts
│   │   │   ├── index.ts
│   │   │   ├── logger.ts
│   │   │   └── requestContext.ts
│   │   ├── metrics
│   │   │   ├── index.ts
│   │   │   └── tokenCounter.ts
│   │   ├── network
│   │   │   ├── fetchWithTimeout.ts
│   │   │   └── index.ts
│   │   ├── parsing
│   │   │   ├── dateParser.ts
│   │   │   ├── index.ts
│   │   │   └── jsonParser.ts
│   │   ├── security
│   │   │   ├── idGenerator.ts
│   │   │   ├── index.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── sanitization.ts
│   │   └── index.ts
│   └── index.ts
├── .clinerules
├── .dockerignore
├── .env.example
├── .gitignore
├── .ncurc.json
├── CHANGELOG.md
├── CLAUDE.md
├── Dockerfile
├── LICENSE
├── mcp.json
├── package-lock.json
├── package.json
├── PROJECT-SPEC.md
├── README.md
├── repomix.config.json
├── smithery.yaml
├── tsconfig.json
├── tsconfig.typedoc.json
├── tsdoc.json
└── typedoc.json
```

_Note: This tree excludes files and directories matched by .gitignore and default patterns._
