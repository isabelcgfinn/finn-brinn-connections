"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";

type Row = {
  id: string;
  player_name: string;
  status: "win" | "loss";
  mistakes_used: number;
  duration_ms: number;
};

const formatMs = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    // get current player name from localStorage
    const name = localStorage.getItem("playerName");
    setPlayerName(name);

    (async () => {
      const { data } = await supabase
        .from("leaderboard_entries")
        .select("id, player_name, status, mistakes_used, duration_ms")
        .eq("event_slug", process.env.NEXT_PUBLIC_EVENT_SLUG)
        .limit(200);

      const list = (data ?? []) as Row[];

      list.sort((a, b) => {
        if (a.status !== b.status) return a.status === "win" ? -1 : 1;
        if (a.mistakes_used !== b.mistakes_used)
          return a.mistakes_used - b.mistakes_used;
        return a.duration_ms - b.duration_ms;
      });

      setRows(list);
    })();
  }, []);

  return (
    <div className="w-full max-w-lg">

      {/* Column headers */}
      <div className="flex justify-between px-4 py-2 text-wedding-aubergine font-bold border-b border-wedding-blush/40">
        <div className="w-10">#</div>
        <div className="flex-1">Name</div>
        <div className="w-24 text-right">Mistakes</div>
        <div className="w-20 text-right">Time</div>
      </div>

      {/* Rows */}
      <div>

        {rows.slice(0, 20).map((r, idx) => {

          const isCurrentPlayer = r.player_name === playerName;

          return (
            <div
              key={r.id}
              className={`
                flex justify-between px-4 py-3 border-b border-wedding-blush/20
                ${isCurrentPlayer ? "bg-wedding-plum/30" : ""}
              `}
            >

              {/* Place */}
              <div className={`w-10 ${isCurrentPlayer ? "font-bold text-wedding-gold" : ""}`}>
                {idx + 1}
              </div>

              {/* Name */}
              <div className="flex-1 text-wedding-aubergine">
                {r.player_name}
                {r.status === "loss" && (
                  <span className="text-wedding-rose text-xs ml-2">(DNF)</span>
                )}
              </div>

              {/* Mistakes */}
              <div className="w-24 text-right text-wedding-aubergine justify-between">
                {r.mistakes_used}
              </div>

              {/* Time */}
              <div className="w-20 text-right text-wedding-aubergine justify-between">
                {formatMs(r.duration_ms)}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}