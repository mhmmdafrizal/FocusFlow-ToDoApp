// One-off: remove rows left by test runs (E2E-* and hostile payloads).
import { connectDB } from "../lib/db.js";

const sql = await connectDB();
const res = await sql`
  DELETE FROM todos
  WHERE text LIKE 'E2E-%'
     OR text LIKE '<script>%'
     OR text LIKE '%; DROP TABLE%'
  RETURNING id
`;
console.log(`deleted ${res.length} rows`);
process.exit(0);