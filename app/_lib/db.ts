/**
 * Server-only database access for the leaderboard.
 *
 * `server-only` makes the build fail if this file is ever imported from a
 * client component, so DATABASE_URL can never end up in the browser bundle.
 * (The old Supabase setup shipped its key to every visitor by design.)
 *
 * Production talks to Neon over HTTP, which suits serverless functions: they
 * come and go, and a TCP pool would exhaust Neon's connection limit. A
 * localhost URL uses `pg` instead, for testing against a throwaway local
 * database. `pg` is imported lazily, so it stays out of the production bundle.
 * This mirrors lib/sql-client.ts in the wedding-site repo.
 *
 * SECURITY: the tagged template never interpolates values into the SQL string.
 * Every value becomes a $1, $2 placeholder, so player names cannot inject SQL.
 */
import "server-only";
import { neon } from "@neondatabase/serverless";

export interface Sql {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<
    Record<string, unknown>[]
  >;
}

function isLocalUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

function localClient(url: string): Sql {
  return async (strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i++) text += `$${i + 1}${strings[i + 1]}`;

    const { Client } = await import("pg");
    const client = new Client({ connectionString: url });
    await client.connect();
    try {
      return (await client.query(text, values)).rows as Record<string, unknown>[];
    } finally {
      await client.end();
    }
  };
}

let cached: Sql | null = null;

export function getSql(): Sql {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  cached = isLocalUrl(url) ? localClient(url) : (neon(url) as unknown as Sql);
  return cached;
}
