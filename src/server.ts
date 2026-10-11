import express from "express";
import { z } from "zod";
import {
  createIssue,
  listIssues,
  type IssueStatus,
} from "./services/issue-service.js";

const app = express();

app.use(express.json());

const issues = [
  {
    id: 1,
    title: "Login button is not working",
    status: "open",
    priority: "high",
  },
  {
    id: 2,
    title: "Improve dashboard loading time",
    status: "in-progress",
    priority: "medium",
  },
];

app.get("/issues", (req, res) => {
  const status = req.query.status;

  const validStatuses: IssueStatus[] = ["open", "in-progress", "closed"];

  if (
    status !== undefined &&
    (typeof status !== "string" ||
      !validStatuses.includes(status as IssueStatus))
  ) {
    return res.status(400).json({
      error: "Invalid status. Use open, in-progress, or closed.",
    });
  }

  const data = listIssues(status as IssueStatus | undefined);

  res.json(data);
});

app.post("/issues", (req, res) => {
  const issueSchema = z.object({
    title: z.string().min(3),
    priority: z.enum(["low", "medium", "high"]),
  });

  const result = issueSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid issue data",
      details: z.flattenError(result.error),
    });
  }

  const newIssue = createIssue(result.data.title, result.data.priority);

  res.status(201).json(newIssue);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
