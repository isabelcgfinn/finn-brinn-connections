import { NextResponse } from "next/server";
import { getSql } from "@/app/_lib/db";

// Scores change constantly; never serve a cached board.
export const dynamic = "force-dynamic";

// Decided on the server so a client cannot post into some other event.
const EVENT_SLUG =
  process.env.EVENT_SLUG ?? process.env.NEXT_PUBLIC_EVENT_SLUG ?? "finn-brinn";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOTAL_MISTAKES = 4;
const MAX_DURATION_MS = 24 * 60 * 60 * 1000;
const MAX_NAME_LENGTH = 60;
const BOARD_SIZE = 20;

const noStore = { "Cache-Control": "no-store" };

export type LeaderboardEntry = {
  id: string;
  player_name: string;
  status: "win" | "loss";
  mistakes_used: number;
  duration_ms: number;
  is_you: boolean;
};

/**
 * GET /api/leaderboard?playerId=<uuid>
 * The top of the board. Other players' ids are never sent: the caller's own
 * row comes back flagged `is_you` instead.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("playerId");
  const playerId = raw && UUID.test(raw) ? raw : null;

  try {
    const rows = await getSql()`
      select id::text as id, player_name, status, mistakes_used, duration_ms,
             coalesce(player_id = ${playerId}::uuid, false) as is_you
      from leaderboard_entries
      where event_slug = ${EVENT_SLUG}
      order by (status = 'win') desc, mistakes_used asc, duration_ms asc, created_at asc
      limit ${BOARD_SIZE}
    `;
    return NextResponse.json({ entries: rows }, { headers: noStore });
  } catch (err) {
    console.error("Leaderboard read failed:", err);
    return NextResponse.json(
      { error: "Could not load the leaderboard." },
      { status: 500, headers: noStore }
    );
  }
}

type Submission = {
  player_id: string;
  player_name: string;
  status: "win" | "loss";
  mistakes_used: number;
  duration_ms: number;
};

function parseSubmission(body: unknown): Submission | string {
  if (typeof body !== "object" || body === null) return "Body must be a JSON object.";
  const b = body as Record<string, unknown>;

  if (typeof b.player_id !== "string" || !UUID.test(b.player_id))
    return "player_id must be a UUID.";

  if (typeof b.player_name !== "string") return "player_name is required.";
  const name = b.player_name.trim().replace(/\s+/g, " ");
  if (name.length < 1 || name.length > MAX_NAME_LENGTH)
    return `player_name must be 1–${MAX_NAME_LENGTH} characters.`;

  if (b.status !== "win" && b.status !== "loss")
    return "status must be 'win' or 'loss'.";

  const mistakes = b.mistakes_used;
  if (!Number.isInteger(mistakes) || (mistakes as number) < 0 || (mistakes as number) > TOTAL_MISTAKES)
    return `mistakes_used must be a whole number from 0 to ${TOTAL_MISTAKES}.`;
  if (b.status === "loss" && mistakes !== TOTAL_MISTAKES)
    return "A loss always uses every mistake.";
  if (b.status === "win" && mistakes === TOTAL_MISTAKES)
    return "A win cannot use every mistake.";

  const duration = b.duration_ms;
  if (!Number.isInteger(duration) || (duration as number) < 1000 || (duration as number) > MAX_DURATION_MS)
    return "duration_ms is out of range.";

  return {
    player_id: b.player_id,
    player_name: name,
    status: b.status,
    mistakes_used: mistakes as number,
    duration_ms: duration as number,
  };
}

/**
 * POST /api/leaderboard
 * Records a finished game. Only a player's first finish counts, because
 * there is one puzzle and a replay would already know the answers.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400, headers: noStore });
  }

  const parsed = parseSubmission(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400, headers: noStore });
  }

  try {
    const inserted = await getSql()`
      insert into leaderboard_entries
        (event_slug, player_id, player_name, status, mistakes_used, duration_ms)
      values
        (${EVENT_SLUG}, ${parsed.player_id}::uuid, ${parsed.player_name},
         ${parsed.status}, ${parsed.mistakes_used}, ${parsed.duration_ms})
      on conflict (event_slug, player_id) do nothing
      returning id
    `;
    return inserted.length > 0
      ? NextResponse.json({ saved: true }, { status: 201, headers: noStore })
      : NextResponse.json({ saved: false, reason: "already-recorded" }, { headers: noStore });
  } catch (err) {
    console.error("Leaderboard save failed:", err);
    return NextResponse.json(
      { error: "Could not save your score." },
      { status: 500, headers: noStore }
    );
  }
}
