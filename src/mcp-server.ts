import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createMcpServer } from "./mcp/create-mcp-server.js";

serveStdio(() => createMcpServer());
