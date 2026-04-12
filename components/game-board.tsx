"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  generatePositions,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "@/lib/game-utils";
import { NumberTile } from "./number-tile";
import { Scoreboard } from "./scoreboard";

interface GameBoardProps {
  session: Doc<"sessions">;
  players: Doc<"players">[];
  playerId: string;
}

export function GameBoard({ session, players, playerId }: GameBoardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const claims = useQuery(api.game.getClaims, { sessionId: session._id }) ?? [];
  const me = players.find((p) => p.playerId === playerId);
  const claimNumber = useMutation(api.game.claimNumber);
  const endGame = useMutation(api.sessions.endGame);
  const [lastClaimed, setLastClaimed] = useState<number | null>(null);
  const isHost = session.hostPlayerId === playerId;

  const positions = generatePositions(session.seed, session.maxNumber);

  // Build claim map: number -> colorIndex
  const claimMap = new Map<number, number>();
  for (const c of claims) {
    claimMap.set(c.number, c.colorIndex);
  }

  // Calculate my effective next target (auto-skip claimed)
  const myNextTarget = (() => {
    if (!me) return -1;
    let target = me.nextTarget;
    while (claimMap.has(target) && target <= session.maxNumber) {
      target++;
    }
    return target;
  })();

  // Measure the wrapper div that fills remaining space, scale board to fit
  useEffect(() => {
    function resize() {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const s = Math.min(rect.width / BOARD_WIDTH, rect.height / BOARD_HEIGHT);
      setScale(s);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleClick = useCallback(
    async (num: number) => {
      if (!me || claimMap.has(num)) return;
      const result = await claimNumber({
        sessionId: session._id,
        playerId,
        number: num,
      });
      if (result.success) {
        setLastClaimed(num);
      }
    },
    [me, claimMap, claimNumber, session._id, playerId]
  );

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <div className="shrink-0 p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <Scoreboard
          players={players}
          playerId={playerId}
          showDoneBadge={me != null && myNextTarget > session.maxNumber}
        />
        {isHost && (
          <button
            type="button"
            onClick={() => void endGame({ sessionId: session._id, playerId })}
            className="shrink-0 self-center sm:self-auto px-4 py-2 rounded-xl bg-red-500/25 hover:bg-red-500/35 text-sm font-semibold text-red-100 border border-red-400/30 transition-colors"
          >
            End game
          </button>
        )}
      </div>

      <div ref={wrapperRef} className="flex-1 flex items-center justify-center min-h-0 p-1">
        {scale > 0 && (
          <div
            className="relative glass overflow-hidden"
            style={{
              width: BOARD_WIDTH * scale,
              height: BOARD_HEIGHT * scale,
            }}
          >
            <div
              className="absolute origin-top-left"
              style={{
                width: BOARD_WIDTH,
                height: BOARD_HEIGHT,
                transform: `scale(${scale})`,
              }}
            >
              {positions.map((pos) => (
                <NumberTile
                  key={pos.number}
                  number={pos.number}
                  x={pos.x}
                  y={pos.y}
                  claimedByColorIndex={claimMap.get(pos.number) ?? null}
                  isMyClaimedTile={pos.number === lastClaimed}
                  onClick={() => handleClick(pos.number)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
