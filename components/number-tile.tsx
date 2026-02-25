"use client";

import { motion } from "framer-motion";
import { getPlayerColor } from "@/lib/game-utils";

interface NumberTileProps {
  number: number;
  x: number;
  y: number;
  claimedByColorIndex: number | null;
  isMyTarget: boolean;
  isMyClaimedTile: boolean;
  onClick: () => void;
}

export function NumberTile({
  number,
  x,
  y,
  claimedByColorIndex,
  isMyClaimedTile,
  onClick,
}: NumberTileProps) {
  const isClaimed = claimedByColorIndex !== null;
  const color = isClaimed ? getPlayerColor(claimedByColorIndex) : undefined;

  return (
    <motion.button
      onClick={onClick}
      disabled={isClaimed}
      className={`absolute w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold select-none
        ${isClaimed ? "cursor-default" : "cursor-pointer hover:scale-110 hover:bg-white/25 transition-colors"}
      `}
      style={{
        left: x,
        top: y,
        backgroundColor: isClaimed ? color : "rgba(255,255,255,0.15)",
        color: isClaimed ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
        border: isClaimed
          ? `2px solid ${color}`
          : "1px solid rgba(255,255,255,0.2)",
      }}
      initial={false}
      animate={
        isMyClaimedTile
          ? { scale: [1, 1.4, 1], transition: { duration: 0.3 } }
          : {}
      }
      whileTap={!isClaimed ? { scale: 0.9 } : undefined}
    >
      {number}
    </motion.button>
  );
}
