"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShareLink } from "./share-link";
import { getPlayerColor } from "@/lib/game-utils";

interface LobbyProps {
  session: Doc<"sessions">;
  players: Doc<"players">[];
  playerId: string;
}

export function Lobby({ session, players, playerId }: LobbyProps) {
  const startCountdown = useMutation(api.sessions.startCountdown);
  const isHost = session.hostPlayerId === playerId;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">Waiting Room</h2>
          <p className="text-white/50 text-sm">Share the code to invite players</p>
        </div>

        <ShareLink code={session.code} />

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wide">
            Players ({players.length})
          </h3>
          {players.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPlayerColor(p.colorIndex) }}
              />
              <span className="font-medium">{p.name}</span>
              {p.playerId === session.hostPlayerId && (
                <span className="text-xs text-white/40 ml-auto">Host</span>
              )}
            </div>
          ))}
        </div>

        {isHost ? (
          <button
            onClick={() => startCountdown({ sessionId: session._id, playerId })}
            disabled={players.length < 1}
            className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-colors disabled:opacity-40"
          >
            Start Game
          </button>
        ) : (
          <p className="text-center text-white/40 text-sm">
            Waiting for host to start...
          </p>
        )}
      </div>
    </div>
  );
}
