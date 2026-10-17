import { createMcpHandler } from "@modelcontextprotocol/server";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpServer } from "./mcp/create-mcp-server.js";

const app = createMcpExpressApp({
  host: "0.0.0.0",
});

const authToken = process.env.MCP_AUTH_TOKEN;

if (!authToken) {
  throw new Error("MCP_AUTH_TOKEN is required");
}

const handler = createMcpHandler(() => createMcpServer());
const nodeHandler = toNodeHandler(handler);

app.all("/mcp", (req, res) => {
  const authorization = req.headers.authorization;

  if (authorization !== `Bearer ${authToken}`) {
    res.status(401).json({
      error: "Unauthorized",
    });

    return;
  }

  void nodeHandler(req, res, req.body);
});

const port = Number(process.env.MCP_HTTP_PORT ?? 3001);

app.listen(port, "127.0.0.1", () => {
  console.log(`HTTP MCP server running on http://127.0.0.1:${port}/mcp`);
});
