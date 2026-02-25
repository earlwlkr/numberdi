// Mulberry32 seeded PRNG - deterministic across all clients
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BOARD_WIDTH = 1200;
export const BOARD_HEIGHT = 800;
const TILE_SIZE = 40;
const PADDING = 4;

export interface TilePosition {
  number: number;
  x: number;
  y: number;
}

export function generatePositions(
  seed: number,
  maxNumber: number
): TilePosition[] {
  const rng = mulberry32(seed);
  const positions: TilePosition[] = [];
  const occupied: { x: number; y: number }[] = [];

  const maxX = BOARD_WIDTH - TILE_SIZE;
  const maxY = BOARD_HEIGHT - TILE_SIZE;

  for (let n = 1; n <= maxNumber; n++) {
    let x: number, y: number;
    let attempts = 0;

    do {
      x = Math.floor(rng() * maxX);
      y = Math.floor(rng() * maxY);
      attempts++;
    } while (
      attempts < 100 &&
      occupied.some(
        (o) =>
          Math.abs(o.x - x) < TILE_SIZE + PADDING &&
          Math.abs(o.y - y) < TILE_SIZE + PADDING
      )
    );

    occupied.push({ x, y });
    positions.push({ number: n, x, y });
  }

  return positions;
}

export const PLAYER_COLORS = [
  "oklch(0.75 0.18 25)",
  "oklch(0.75 0.18 145)",
  "oklch(0.75 0.18 265)",
  "oklch(0.75 0.18 55)",
  "oklch(0.75 0.18 185)",
  "oklch(0.75 0.18 315)",
  "oklch(0.75 0.18 95)",
  "oklch(0.75 0.18 215)",
];

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
