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
  isMyTarget,
  isMyClaimedTile,
  onClick,
}: NumberTileProps) {
  const isClaimed = claimedByColorIndex !== null;
  const color = isClaimed ? getPlayerColor(claimedByColorIndex) : undefined;
  const shouldHighlightTarget = isMyTarget && !isClaimed;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isClaimed}
      aria-label={`Number ${number}`}
      className={`absolute w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold select-none
        ${isClaimed ? "cursor-default" : "cursor-pointer hover:scale-110 hover:bg-white/25 transition-colors"}
        ${shouldHighlightTarget ? "ring-2 ring-yellow-300/90 ring-offset-2 ring-offset-transparent shadow-[0_0_14px_rgba(253,224,71,0.55)]" : ""}
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
          : shouldHighlightTarget
            ? {
                scale: [1, 1.06, 1],
                transition: { duration: 1.2, repeat: Infinity },
              }
            : {}
      }
      whileTap={!isClaimed ? { scale: 0.9 } : undefined}
    >
      {number}
    </motion.button>
  );
}
