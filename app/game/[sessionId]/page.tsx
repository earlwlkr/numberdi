"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePlayerIdentity } from "@/hooks/use-player-identity";
import { generateRandomName } from "@/lib/random-names";
import { Lobby } from "@/components/lobby";
import { Countdown } from "@/components/countdown";
import { GameBoard } from "@/components/game-board";
import { VictoryScreen } from "@/components/victory-screen";

export default function GamePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId: code } = use(params);
  const playerId = usePlayerIdentity();
  const session = useQuery(api.sessions.getByCode, { code });
  const players = useQuery(
    api.players.list,
    session ? { sessionId: session._id } : "skip"
  );
  const joinGame = useMutation(api.players.join);

  const [joined, setJoined] = useState(false);
  const [namePrompt, setNamePrompt] = useState(false);
  const [name, setName] = useState(() => generateRandomName());

  // Auto-join when session and playerId are ready
  useEffect(() => {
    if (!session || !playerId || joined) return;
    const storedName = sessionStorage.getItem("numberdi-name");
    if (storedName) {
      joinGame({ sessionId: session._id, playerId, name: storedName }).then(
        () => setJoined(true)
      );
    } else {
      setNamePrompt(true);
    }
  }, [session, playerId, joined, joinGame]);

  function handleNameSubmit() {
    if (!session || !playerId || !name.trim()) return;
    sessionStorage.setItem("numberdi-name", name.trim());
    joinGame({ sessionId: session._id, playerId, name: name.trim() }).then(
      () => {
        setJoined(true);
        setNamePrompt(false);
      }
    );
  }

  // Loading state
  if (!session || !playerId || !players) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 text-center">
          <p className="text-white/60">
            {session === null ? "Game not found" : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Name prompt for direct link joins
  if (namePrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-center">Enter your name</h2>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-colors disabled:opacity-40"
          >
            Join Game
          </button>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8">
          <p className="text-white/60">Joining...</p>
        </div>
      </div>
    );
  }

  // Render based on game status
  switch (session.status) {
    case "lobby":
      return (
        <Lobby session={session} players={players} playerId={playerId} />
      );
    case "countdown":
      return (
        <>
          <Lobby session={session} players={players} playerId={playerId} />
          {session.startedAt && <Countdown startedAt={session.startedAt} />}
        </>
      );
    case "playing":
      return (
        <GameBoard
          session={session}
          players={players}
          playerId={playerId}
        />
      );
    case "finished":
      return (
        <VictoryScreen players={players} playerId={playerId} />
      );
    default:
      return null;
  }
}
