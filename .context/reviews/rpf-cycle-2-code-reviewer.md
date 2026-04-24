# RPF Cycle 2 (loop cycle 2/100) — Code Reviewer

**Date:** 2026-04-24
**Base commit:** fab30962 (cycle 1 multi-agent review — no new findings)
**HEAD commit:** fab30962
**Reviewer:** code-reviewer

## Scope

Reviewed the full `src/**` tree with focus on:
- `src/lib/compiler/execute.ts` — Docker container execution, shell command validation, sandboxing
- `src/lib/docker/client.ts` — Docker API wrapper, image validation, error sanitization
- `src/lib/plugins/chat-widget/chat-widget.tsx` — chat widget state management, streaming
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE route, connection tracking, stale eviction
- `src/lib/realtime/realtime-coordination.ts` — PostgreSQL advisory locks, SSE connection slot management
- `src/lib/data-retention.ts` — data retention policy, legal hold
- `src/lib/auth/permissions.ts` — access control, IDOR prevention
- `src/lib/security/api-rate-limit.ts` — rate limiting, `Date.now()` vs DB time
- `src/proxy.ts` — CSP, auth caching, locale resolution
- `src/lib/security/encryption.ts` — AES-256-GCM, key management
- `src/lib/db/import.ts` — database import engine, TABLE_MAP typing
- `src/lib/assignments/leaderboard.ts` — leaderboard freeze, rank computation
- `src/lib/auth/config.ts` — NextAuth configuration, JWT token management
- All `Date.now()` usage patterns across `src/` (60+ call sites)
- All `console.error/warn` in client components (25+ instances)
- All `process.env` reads (80+ call sites)
- All `tracking-*`/`letter-spacing` usage — Korean letter-spacing compliance
- All `dangerouslySetInnerHTML` usage (2 instances, both sanitized)

## New Findings

**No new production-code findings this cycle.** The diff from cycle 1 HEAD to current HEAD contains only review/documentation files. No production source code has changed.

## Code Quality Observations (Re-verified)

1. **Shell command validation** (`execute.ts:159-233`) — Two-layer defense: `validateShellCommand` (denylist) + `validateShellCommandStrict` (allowlist of known compiler prefixes). Well-designed. The `sh -c` trust boundary is clearly documented. Lock-step with Rust validator.
2. **Docker client error sanitization** — All three remote catch blocks now use generic messages with `logger.error` for the real details. Local paths were already sanitized in prior cycles. Correct.
3. **SSE stale threshold NaN guard** — Now uses `Number.isFinite(sseTimeout)` with a `30_030_000` fallback. Correct.
4. **SSE stale threshold cache** — 5-minute TTL on the cached threshold value. Reduces `getConfiguredSettings()` DB queries. Correct.
5. **Chat widget streaming stabilization** — `isStreamingRef` prevents stale-closure race. `sendMessageRef` provides stable access. The `motion-safe:animate-bounce` for typing dots respects `prefers-reduced-motion`. Correct.
6. **Korean letter-spacing compliance** — All `tracking-*` utilities are guarded with `locale !== "ko"` conditional checks, with explicit comments referencing CLAUDE.md. `globals.css` uses CSS custom properties with separate `:lang(ko)` rules. Correct.

## Verification of Prior Fixes (All Still Intact)

- Deterministic userId tie-breaker in leaderboard — intact
- DB-time for judge claim — intact
- `computeExpiryFromDays` — intact
- SKIP_INSTRUMENTATION_SYNC — safe (strict-literal `"1"`)
- Docker client remote error sanitization — intact
- Compiler spawn error message sanitization — intact
- SSE stale threshold NaN guard — intact
- SSE stale threshold cache — intact
- Chat widget `isStreamingRef` stabilization — intact

## Carry-Over Deferred Items (Unchanged)

All previously identified carry-over items remain unfixed and are still valid.

## Confidence

HIGH — the codebase is in a mature, stable state. Six consecutive review cycles confirm no new production-code findings.
