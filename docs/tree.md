# clinicaltrialsgov-mcp-server - Directory Structure

Generated on: 2025-06-21 01:25:34

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
│   ├── PROJECT-SPEC.md
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
│   │   │   ├── auth
│   │   │   │   ├── core
│   │   │   │   │   ├── authContext.ts
│   │   │   │   │   ├── authTypes.ts
│   │   │   │   │   └── authUtils.ts
│   │   │   │   ├── strategies
│   │   │   │   │   ├── jwt
│   │   │   │   │   │   └── jwtMiddleware.ts
│   │   │   │   │   └── oauth
│   │   │   │   │       └── oauthMiddleware.ts
│   │   │   │   └── index.ts
│   │   │   ├── httpErrorHandler.ts
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
├── README.md
├── repomix.config.json
├── smithery.yaml
├── tsconfig.json
├── tsconfig.typedoc.json
├── tsdoc.json
└── typedoc.json
```

_Note: This tree excludes files and directories matched by .gitignore and default patterns._
