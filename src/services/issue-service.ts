import { findIssues, saveIssue } from "../repositories/issue-repository.js";

export type IssueStatus = "open" | "in-progress" | "closed";

export type IssuePriority = "low" | "medium" | "high";

export type Issue = {
  id: number;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
};

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

export function listIssues(status?: IssueStatus): Issue[] {
  return findIssues(status);
}

export function createIssue(title: string, priority: IssuePriority): Issue {
  return saveIssue({ title, status: "open", priority });
}
