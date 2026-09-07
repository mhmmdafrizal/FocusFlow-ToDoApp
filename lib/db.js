import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_POOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

let initialized = false;

export const connectDB = async () => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to your env (Vercel Neon integration or .env.local).");
  }

  const sql = neon(DATABASE_URL);

  if (!initialized) {
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id          SERIAL PRIMARY KEY,
        text        TEXT NOT NULL,
        description TEXT DEFAULT '',
        completed   BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    initialized = true;
  }

  return sql;
};