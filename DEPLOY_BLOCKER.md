# Deploy Blocker

Date: 2026-03-08 (UTC)

## What was attempted
1. `pnpm install`
2. `CI=true pnpm install --frozen-lockfile --offline`
3. `CI=true pnpm install --frozen-lockfile`
4. `CI=true pnpm lint`
5. `CI=true pnpm build`
6. `vercel --version`

## Exact blockers
- Outbound package registry access is unavailable in this environment:
  - `getaddrinfo EAI_AGAIN registry.npmjs.org`
- Because dependencies cannot be installed, `next` is not available on PATH and both validation steps fail:
  - `pnpm lint` -> `sh: 1: next: not found`
  - `pnpm build` -> `sh: 1: next: not found`
- Vercel CLI is not installed:
  - `/bin/bash: vercel: command not found`
- Installing Vercel CLI is also blocked by the same npm registry/DNS issue.

## Impact
Production deploy could not be triggered from this environment (`vercel --prod --yes`) and full install/lint/build validation could not be completed.
