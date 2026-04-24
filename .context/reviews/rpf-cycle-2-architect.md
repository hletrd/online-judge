# RPF Cycle 2 (loop cycle 2/100) — Architect

**Date:** 2026-04-24
**HEAD:** fab30962
**Reviewer:** architect

## Inventory of Reviewed Files

- src/lib/compiler/execute.ts — Docker execution engine, concurrency, sandboxing
- src/lib/docker/client.ts — Docker API wrapper, dual-path (local/remote)
- src/lib/realtime/realtime-coordination.ts — PostgreSQL advisory locks, SSE slot management
- src/app/api/v1/submissions/[id]/events/route.ts — SSE route, connection tracking
- src/lib/data-retention.ts — data retention policy, legal hold
- src/lib/db/import.ts — database import engine, TABLE_MAP
- src/lib/security/api-rate-limit.ts — two-tier rate limiting
- src/proxy.ts — middleware, CSP, auth cache
- src/lib/auth/config.ts — NextAuth, JWT management
- src/lib/auth/permissions.ts — access control layering
- src/lib/submissions/visibility.ts — submission sanitization for viewer
- src/lib/audit/node-shutdown.ts — graceful shutdown, audit flush

## New Findings

**No new findings this cycle.**

## Architectural Observations (Re-verified)

1. Layered access control — capabilities (coarse) -> group membership (medium) -> object ownership (fine). Recruiting candidates are a separate access tier.
2. Dual-path Docker API — local/remote path abstraction is clean. Error sanitization in both paths.
3. Compiler sandbox — Multi-layered: Docker security options + shell command validation + concurrency limiter.
4. Audit system — Buffer-based with unref() timer. Graceful shutdown hooks.
5. Data retention — Legal hold as process-level boolean. Simple and effective.

## Carry-Over Confirmations

- ARCH-2: Stale-while-revalidate cache pattern duplication — LOW/LOW, deferred
- ARCH-3: Manual routes duplicate createApiHandler boilerplate — MEDIUM/MEDIUM, deferred

## Confidence

HIGH — the architecture is sound, well-layered, and has good defense-in-depth.
