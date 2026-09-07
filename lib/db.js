import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

let db = null;

export const connectDB = () => {
  if (db) return db;

  const file = join(process.cwd(), "data", "todos.db");
  mkdirSync(dirname(file), { recursive: true });

  db = new DatabaseSync(file);

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      text        TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed   INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (datetime('now')),
      updated_at  TEXT DEFAULT (datetime('now'))
    )
  `);

  return db;
};
