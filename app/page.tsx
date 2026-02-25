"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePlayerIdentity } from "@/hooks/use-player-identity";
import { useRouter } from "next/navigation";
import { generateRandomName } from "@/lib/random-names";

export default function Home() {
  const router = useRouter();
  const playerId = usePlayerIdentity();
  const createSession = useMutation(api.sessions.create);

  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(generateRandomName());
  }, []);

  async function handleCreate() {
    if (!playerId || !name.trim()) return;
    setLoading(true);
    const { code } = await createSession({ hostPlayerId: playerId });
    // Store name for use on game page
    sessionStorage.setItem("numberdi-name", name.trim());
    router.push(`/game/${code}`);
  }

  async function handleJoin() {
    if (!joinCode.trim() || !name.trim()) return;
    sessionStorage.setItem("numberdi-name", name.trim());
    router.push(`/game/${joinCode.toUpperCase()}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Number Find</h1>
          <p className="text-white/60">Race to find numbers in order!</p>
        </div>

        {mode === "menu" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={() => name.trim() ? handleCreate() : undefined}
              disabled={!name.trim() || !playerId || loading}
              className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Game"}
            </button>
            <button
              onClick={() => name.trim() ? setMode("join") : undefined}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Join Game
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Game code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-center text-2xl tracking-widest font-mono"
            />
            <button
              onClick={handleJoin}
              disabled={joinCode.length < 6 || loading}
              className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Join
            </button>
            <button
              onClick={() => setMode("menu")}
              className="w-full py-2 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
