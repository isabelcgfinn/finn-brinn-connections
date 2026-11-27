// Applies db/schema.sql to the database in DATABASE_URL. Safe to re-run.
//
//   npm run db:migrate            reads DATABASE_URL from .env.local
//
// Uses `pg` over TCP rather than Neon's HTTP driver because the schema file
// holds several statements, which the HTTP driver will not run in one call.
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url });

await client.connect();
try {
  await client.query(schema);
  const host = new URL(url).hostname;
  console.log(`Schema applied to ${host} ✓`);
} finally {
  await client.end();
}
