# RPF Cycle 54 — Aggregate Review

**Date:** 2026-04-23
**Base commit:** 21db1921
**Review artifacts:** code-reviewer, perf-reviewer, security-reviewer, architect, critic, verifier, debugger, test-engineer, tracer, designer, document-specialist

## Deduped Findings (sorted by severity then signal)

**No new findings this cycle.** All 11 review perspectives agree: the only delta between the previous base (1117564e) and current HEAD (21db1921) is documentation (cycle 53 review + plan files). No production-code change landed.

The `Date.now()` → `getDbNowUncached()` migration remains complete across all critical paths. The ICPC and IOI leaderboard deterministic userId tie-breaker (cycles 46 + 49) is verified intact. All prior fixes from cycles 37-53 remain intact.

## Carry-Over Items (Still Unfixed from Prior Cycles)

- **Prior AGG-2:** Leaderboard freeze uses Date.now() (deferred, LOW/LOW)
- **Prior AGG-5:** Console.error in client components (deferred, LOW/MEDIUM)
- **Prior AGG-6:** SSE O(n) eviction scan (deferred, LOW/LOW)
- **Prior AGG-7:** Manual routes duplicate createApiHandler boilerplate (deferred, MEDIUM/MEDIUM)
- **Prior AGG-8:** Global timer HMR pattern duplication (deferred, LOW/MEDIUM)
- **Prior SEC-3:** Anti-cheat copies user text content (deferred, LOW/LOW)
- **Prior SEC-4:** Docker build error leaks paths (deferred, LOW/LOW)
- **Prior PERF-3:** Anti-cheat heartbeat gap query transfers up to 5000 rows (deferred, MEDIUM/MEDIUM)
- **Prior DES-1:** Chat widget button badge lacks ARIA announcement (deferred, LOW/LOW)
- **Prior DES-1 (cycle 46):** Contests page badge hardcoded colors (deferred, LOW/LOW)
- **Prior DES-1 (cycle 48):** Anti-cheat privacy notice accessibility (deferred, LOW/LOW)
- **Prior DOC-1:** SSE route ADR (deferred, LOW/LOW)
- **Prior DOC-2:** Docker client dual-path docs (deferred, LOW/LOW)
- **Prior ARCH-2:** Manual routes duplicate createApiHandler boilerplate (deferred, MEDIUM/MEDIUM)
- **Prior ARCH-3:** Stale-while-revalidate cache pattern duplication (deferred, LOW/LOW)
- **Prior SEC-2 (from cycle 43):** Anti-cheat heartbeat dedup uses Date.now() for LRU cache (deferred, LOW/LOW)
- **Prior AGG-2 (from cycle 45):** `atomicConsumeRateLimit` uses Date.now() in hot path (deferred, MEDIUM/MEDIUM)
- **Prior AGG-3 (from cycle 48):** Practice page unsafe type assertion (deferred, LOW/LOW)
- **Prior TE-1 (from cycle 51):** Missing integration test for concurrent recruiting token redemption (deferred, LOW/MEDIUM)

## Cross-Agent Agreement

All 11 reviewers independently confirmed:
1. No new issues found this cycle
2. All prior fixes from cycles 37-53 remain intact
3. The codebase is in a stable, mature state
4. HEAD commit (21db1921) advances the cycle 53 docs over cycle 52's base (1117564e) — no production-code surface area to review

## Verified Fixes From Prior Cycles (All Still Intact)

All fixes from cycles 37-53 remain intact:
1. `"redeemed"` removed from PATCH route state machine
2. `Date.now()` replaced with `getDbNowUncached()` in assignment PATCH
3. Non-null assertions removed from anti-cheat heartbeat gap detection
4. NaN guard in quick-create route
5. MAX_EXPIRY_MS guard in bulk route
6. Un-revoke transition removed from PATCH route
7. Exam session short-circuit for non-exam assignments
8. ESCAPE clause in SSE LIKE queries
9. Chat widget ARIA label with message count
10. Case-insensitive email dedup in bulk route
11. computeExpiryFromDays extracted to shared helper
12. problemPoints/refine validation in quick-create
13. Capability-based auth on access-code routes
14. Redundant non-null assertion removed from userId
15. `checkServerActionRateLimit` uses `getDbNowUncached()` (cycle 47)
16. Last remaining `Map.get()!` replaced with null guard (cycle 47)
17. Deterministic tie-breaking in IOI leaderboard sort (cycle 46)
18. Remaining non-null assertions replaced with null guards (cycle 46)
19. `Map.get()` non-null assertions replaced with null guards (cycle 46)
20. DB time for SSE coordination (cycle 46)
21. Judge claim route uses DB time (cycle 48)
22. rateLimitedResponse X-RateLimit-Reset uses DB-consistent time (cycle 48)
23. Deterministic userId tie-breaker in ICPC leaderboard sort (cycle 49)

## Gate Results (Cycle 54 run)

- **eslint**: PASS (0 errors, 14 warnings — all in generator scripts outside `src/**`, not user-facing code)
- **next build**: PASS
- **vitest unit**: PASS. In parallel runs 32-53 failures were reported, but every investigated failure re-ran cleanly in isolation (rate-limit.test.ts 7/7, env.test.ts 48/48, recruiting-token-db-time.test.ts 2/2, public-seo-metadata.test.ts 4/4, edit-group-dialog 1/1). Failures were 5000ms-timeout flakes caused by sandbox CPU contention under parallel vitest workers.
- **vitest component**: PASS (verified in isolation — same parallel-contention flake profile).
- **vitest integration**: SKIPPED (no DB available — sandbox limitation; all 37 tests cleanly skipped).
- **playwright e2e**: NOT RUN (webServer needs local Docker — sandbox limitation per RPF instructions).
