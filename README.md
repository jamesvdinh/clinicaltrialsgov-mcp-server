# ClinicalTrials.gov MCP Server 🏥

[![TypeScript](https://img.shields.io/badge/TypeScript-^5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol SDK](https://img.shields.io/badge/MCP%20SDK-^1.12.3-green.svg)](https://github.com/modelcontextprotocol/typescript-sdk)
[![MCP Spec Version](https://img.shields.io/badge/MCP%20Spec-2025--03--26-lightgrey.svg)](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/changelog.mdx)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Stable-green.svg)](https://github.com/cyanheads/clinicaltrialsgov-mcp-server/issues)
[![GitHub](https://img.shields.io/github/stars/cyanheads/clinicaltrialsgov-mcp-server?style=social)](https://github.com/cyanheads/clinicaltrialsgov-mcp-server)

**A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) Server providing a robust, developer-friendly interface to the official [ClinicalTrials.gov REST API](https://clinicaltrials.gov/api/v2/docs).**

This server encapsulates the complexity of the underlying API, exposing its functionality through a set of well-defined, easy-to-use LLM tools.
The primary goal is to enable seamless interaction with clinical trial data for research, analysis, and application development.

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🏁 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [🔩 Server Configuration (Environment Variables)](#-server-configuration-environment-variables)
- [🏗️ Project Structure](#️-project-structure)
- [🧩 Extending the MCP Server](#-extending-the-mcp-server)
- [🌍 More MCP Resources](#-explore-more-mcp-resources)
- [📜 License](#-license)

## ✨ Key Features

This server provides a suite of tools for interacting with the ClinicalTrials.gov API:

| Tool                                | Description                                                                                               | Endpoint(s)                                                            |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `clinicaltrials_list_studies`       | Searches for clinical studies using a combination of query terms and filters. Supports pagination.        | `GET /studies`                                                         |
| `clinicaltrials_get_study`          | Retrieves detailed information for a single clinical study by its NCT number.                             | `GET /studies/{nctId}`                                                 |
| `clinicaltrials_get_study_metadata` | Provides the complete data model for study fields, useful for understanding the available data structure. | `GET /studies/metadata`                                                |
| `clinicaltrials_get_api_stats`      | Fetches various statistics from the API, such as study sizes and field value distributions.               | `GET /stats/size`, `GET /stats/field/values`, `GET /stats/field/sizes` |

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/cyanheads/clinicaltrialsgov-mcp-server.git
    cd clinicaltrialsgov-mcp-server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Build the project:**
    ```bash
    npm run build
    # Or use 'npm run rebuild' for a clean install
    ```

## 🚀 Usage

### Using NPX

To run the MCP server directly using `npx`, you can use the following command:

```bash
# Run with default stdio transport
npx clinicaltrialsgov-mcp-server

# Run with HTTP transport
MCP_TRANSPORT_TYPE=http npx clinicaltrialsgov-mcp-server
```

### From Source (for Development)

You can also use the npm scripts to run the server directly from your cloned repository:

- **Via Stdio (Default):**
  ```bash
  npm start
  # or 'npm run start:stdio'
  ```
- **Via Streamable HTTP:**
  `bash
    npm run start:http
    `
  This starts a **Streamable HTTP** server (default: `http://127.0.0.1:3010`).

## ⚙️ Configuration

### 🔩 Server Configuration (Environment Variables)

Configure the MCP server's behavior using these environment variables:

| Variable              | Description                                                                                         | Default                                |
| :-------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------- |
| `MCP_TRANSPORT_TYPE`  | Server transport: `stdio` or `http`.                                                                | `stdio`                                |
| `MCP_HTTP_PORT`       | Port for the HTTP server (if `MCP_TRANSPORT_TYPE=http`).                                            | `3010`                                 |
| `MCP_HTTP_HOST`       | Host address for the HTTP server (if `MCP_TRANSPORT_TYPE=http`).                                    | `127.0.0.1`                            |
| `MCP_ALLOWED_ORIGINS` | Comma-separated allowed origins for CORS (if `MCP_TRANSPORT_TYPE=http`).                            | (none)                                 |
| `MCP_SERVER_NAME`     | Optional server name (used in MCP initialization).                                                  | (from package.json)                    |
| `MCP_SERVER_VERSION`  | Optional server version (used in MCP initialization).                                               | (from package.json)                    |
| `MCP_LOG_LEVEL`       | Server logging level (`debug`, `info`, `warning`, `error`, etc.).                                   | `debug`                                |
| `LOGS_DIR`            | Directory for log files.                                                                            | `logs/` (in project root)              |
| `NODE_ENV`            | Runtime environment (`development`, `production`).                                                  | `development`                          |
| `MCP_AUTH_SECRET_KEY` | **Required for HTTP transport.** Secret key (min 32 chars) for signing/verifying auth tokens (JWT). | (none - **MUST be set in production**) |
| `MCP_AUTH_MODE`       | Authentication mode: `jwt` (default) or `oauth`.                                                    | `jwt`                                  |
| `OAUTH_ISSUER_URL`    | **Required for `oauth` mode.** The issuer URL of your authorization server.                         | (none)                                 |
| `OAUTH_AUDIENCE`      | **Required for `oauth` mode.** The audience identifier for this MCP server.                         | (none)                                 |
| `OAUTH_JWKS_URI`      | **Optional for `oauth` mode.** The JWKS endpoint URL. If omitted, it's discovered from the issuer.  | (none)                                 |

### 🔌 Client Configuration

#### Example: Adding to an MCP Client

To add this server to an MCP client application (like [Claude Desktop](https://github.com/cyanheads/claude-desktop)), you would update the client's configuration file.

```json
{
  "mcpServers": {
    "clinicaltrialsgov-mcp-server": {
      "command": "npx",
      "args": ["clinicaltrialsgov-mcp-server"],
      "env": {
        "MCP_LOG_LEVEL": "debug",
        "MCP_TRANSPORT_TYPE": "http",
        "MCP_HTTP_PORT": "3010"
      }
    }
  }
}
```

## 🏗️ Project Structure

This project follows a standard TypeScript project layout. For a detailed breakdown, see the [Project Structure Guide](docs/best-practices.md).

You can also generate a current file tree:

```bash
npm run tree
```

## 🧩 Extending the MCP Server

For detailed guidance on how to add your own custom Tools and Resources, please see the [Server Extension Guide](src/mcp-server/README.md).

## 🌍 Explore More MCP Resources

Looking for more examples, guides, and pre-built MCP servers? Check out the companion repository:

➡️ **[cyanheads/model-context-protocol-resources](https://github.com/cyanheads/model-context-protocol-resources)**

## 📜 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with ❤️ and the <a href="https://modelcontextprotocol.io/">Model Context Protocol</a>
</div>
