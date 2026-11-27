"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/app/api/leaderboard/route";

const formatMs = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

type LoadState = "loading" | "error" | "ready";

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const playerId = localStorage.getItem("playerId") ?? "";

    (async () => {
      try {
        // Sorting and the "is this me?" check both happen on the server.
        const res = await fetch(
          `/api/leaderboard?playerId=${encodeURIComponent(playerId)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { entries } = (await res.json()) as { entries: LeaderboardEntry[] };
        setRows(entries);
        setLoadState("ready");
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setLoadState("error");
      }
    })();
  }, []);

  return (
    <div className="w-full max-w-lg text-wedding-aubergine">
      {/* Column headers */}
      <div className="flex justify-between px-4 py-2 font-bold border-b border-wedding-aubergine/40">
        <div className="w-10">#</div>
        <div className="flex-1">Name</div>
        <div className="w-24 text-right">Mistakes</div>
        <div className="w-20 text-right">Time</div>
      </div>

      {/* Rows */}
      <div>
        {rows.map((r, idx) => (
          <div
            key={r.id}
            className={`
              flex justify-between px-4 py-3 border-b border-wedding-aubergine/15
              ${r.is_you ? "bg-wedding-lilac font-bold" : ""}
            `}
          >
            <div className="w-10">{idx + 1}</div>
            <div className="flex-1">
              {r.player_name}
              {r.is_you && <span className="text-xs ml-2">(you)</span>}
              {r.status === "loss" && (
                <span className="text-wedding-purple text-xs ml-2">(DNF)</span>
              )}
            </div>
            <div className="w-24 text-right">{r.mistakes_used}</div>
            <div className="w-20 text-right">{formatMs(r.duration_ms)}</div>
          </div>
        ))}

        {loadState === "loading" && (
          <div className="px-4 py-6 text-center">Loading scores…</div>
        )}

        {loadState === "error" && (
          <div className="px-4 py-6 text-center">
            Couldn’t load the leaderboard. Please check your connection and try
            again.
          </div>
        )}

        {loadState === "ready" && rows.length === 0 && (
          <div className="px-4 py-6 text-center">
            No scores yet — be the first!
          </div>
        )}
      </div>
    </div>
  );
}
