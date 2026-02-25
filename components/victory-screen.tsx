"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Doc } from "@/convex/_generated/dataModel";
import { getPlayerColor } from "@/lib/game-utils";
import confetti from "canvas-confetti";

interface VictoryScreenProps {
  players: Doc<"players">[];
  playerId: string;
}

export function VictoryScreen({ players, playerId }: VictoryScreenProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const isWinner = winner?.playerId === playerId;

  useEffect(() => {
    if (isWinner) {
      const duration = 3000;
      const end = Date.now() + duration;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6, x: Math.random() },
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isWinner]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass p-8 w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-black mb-1">Game Over!</h2>
          <p className="text-white/60">
            {isWinner ? "You won!" : `${winner?.name} wins!`}
          </p>
        </div>

        <div className="space-y-2">
          {sorted.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                i === 0 ? "bg-white/15 ring-1 ring-white/30" : "bg-white/5"
              }`}
            >
              <span className="text-2xl font-black text-white/40 w-8">
                {i + 1}
              </span>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getPlayerColor(p.colorIndex) }}
              />
              <span className="font-semibold flex-1">{p.name}</span>
              <span className="text-2xl font-black">{p.score}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-colors"
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
}
