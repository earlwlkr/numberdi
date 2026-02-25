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
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {sorted.map((p) => (
        <div
          key={p._id}
          className={`glass px-2 py-1 sm:px-4 sm:py-2 flex items-center gap-1.5 ${
            p.playerId === playerId ? "ring-1 ring-white/30" : ""
          }`}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: getPlayerColor(p.colorIndex) }}
          />
          <span className="font-medium text-xs sm:text-sm">{p.name}</span>
          <span className="font-bold text-sm sm:text-lg">{p.score}</span>
        </div>
      ))}
      <div className="glass px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/60">
        Find: <span className="font-bold text-white text-sm sm:text-lg">{myNextTarget > session.maxNumber ? "Done!" : myNextTarget}</span>
      </div>
    </div>
  );
}
