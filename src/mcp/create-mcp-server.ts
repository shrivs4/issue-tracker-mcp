import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

const API_URL = process.env.ISSUE_API_URL ?? "http://localhost:3000";

export function createMcpServer() {
  const server = new McpServer({
    name: "issue-tracker",
    version: "1.0.0",
  });

  server.registerTool(
    "list_issues",
    {
      description:
        "List issues from the issue tracker, optionally filtered by status.",
      inputSchema: z.object({
        status: z
          .enum(["open", "in-progress", "closed"])
          .optional()
          .describe("Filter issues by status"),
      }),
    },
    async ({ status }) => {
      const url = status
        ? `${API_URL}/issues?status=${status}`
        : `${API_URL}/issues`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create_issue",
    {
      description: "Create a new issue with a title and priority.",
      inputSchema: z.object({
        title: z.string().min(3),
        priority: z.enum(["low", "medium", "high"]),
      }),
    },
    async ({ title, priority }) => {
      const response = await fetch(`${API_URL}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, priority }),
      });

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );

  return server;
}
