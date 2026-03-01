# numberdi

Multiplayer "find numbers in order" game.

Players create or join a session with a short code, then race to claim numbers in sequence on a shared board.

## Gameplay flow
1. Create game or join with a code
2. Wait in lobby (host starts the match)
3. Countdown
4. Live board play (claim numbers in ascending order)
5. Victory screen with ranked scores

## Tech stack
- Next.js (App Router)
- React + TypeScript
- Convex (sessions, players, game state)
- Framer Motion + canvas-confetti (UI effects)

## Environment variables
Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=
```

## Run locally
Install dependencies and run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`

## Deploy
This project is deployed on Vercel.

Production URL:
- https://numberdi.vercel.app
