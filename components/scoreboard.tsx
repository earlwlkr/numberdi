"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { getPlayerColor } from "@/lib/game-utils";

interface ScoreboardProps {
  players: Doc<"players">[];
  session: Doc<"sessions">;
  myNextTarget: number;
  playerId: string;
}

export function Scoreboard({ players, session, myNextTarget, playerId }: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      {sorted.map((p) => (
        <div
          key={p._id}
          className={`glass px-4 py-2 flex items-center gap-2 ${
            p.playerId === playerId ? "ring-1 ring-white/30" : ""
          }`}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getPlayerColor(p.colorIndex) }}
          />
          <span className="font-medium text-sm">{p.name}</span>
          <span className="font-bold text-lg">{p.score}</span>
        </div>
      ))}
      <div className="glass px-4 py-2 text-sm text-white/60">
        Find: <span className="font-bold text-white text-lg">{myNextTarget > session.maxNumber ? "Done!" : myNextTarget}</span>
      </div>
    </div>
  );
}
