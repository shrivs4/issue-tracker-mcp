import db from "../db.js";
import type { Issue, IssueStatus } from "../services/issue-service.js";

const issues: Issue[] = [
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

const findAllStatement = db.prepare(`
    SELECT id, title, status, priority
    FROM issues
    ORDER BY id
  `);

const findByStatusStatement = db.prepare(`
    SELECT id, title, status, priority
    FROM issues
    WHERE status = ?
    ORDER BY id
  `);

const insertStatement = db.prepare(`
    INSERT INTO issues (title, status, priority)
    VALUES (?, ?, ?)
  `);

export function findIssues(status?: IssueStatus): Issue[] {
  if (status) {
    return findByStatusStatement.all(status) as Issue[];
  }

  return findAllStatement.all() as Issue[];
}

export function saveIssue(issue: Omit<Issue, "id">): Issue {
  const result = insertStatement.run(issue.title, issue.status, issue.priority);

  return {
    id: Number(result.lastInsertRowid),
    ...issue,
  };
}
