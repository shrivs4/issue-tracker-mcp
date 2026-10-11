import Database from "better-sqlite3";

const db: Database.Database = new Database("data/issues.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'closed')),
        priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high'))
    )
`);

const seedIssues = [
  {
    title: "Login button is not working",
    status: "open",
    priority: "high",
  },
  {
    title: "Improve dashboard loading time",
    status: "in-progress",
    priority: "medium",
  },
];

const issueExistsStatement = db.prepare(`
    SELECT id
    FROM issues
    WHERE title = ?
  `);

const insertSeedStatement = db.prepare(`
    INSERT INTO issues (title, status, priority)
    VALUES (?, ?, ?)
  `);

const seedDatabase = db.transaction(() => {
  for (const issue of seedIssues) {
    const existingIssue = issueExistsStatement.get(issue.title);

    if (!existingIssue) {
      insertSeedStatement.run(issue.title, issue.status, issue.priority);
    }
  }
});

seedDatabase();

export default db;
