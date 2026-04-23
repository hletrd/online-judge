# RPF Cycle 46 — Aggregate Review

**Date:** 2026-04-23
**Base commit:** 54cb92ed
**Review artifacts:** code-reviewer.md, perf-reviewer.md, security-reviewer.md, architect.md, critic.md, verifier.md, debugger.md, test-engineer.md, tracer.md, designer.md, document-specialist.md

## Deduped Findings (sorted by severity then signal)

### AGG-1: `realtime-coordination.ts` uses `Date.now()` for DB-timestamp comparisons in shared SSE coordination — clock-skew in slot management [MEDIUM/MEDIUM]

**Flagged by:** security-reviewer (SEC-1), architect (ARCH-1), critic (CRI-2), debugger (DBG-1), test-engineer (TE-2), tracer (TR-1)
**Signal strength:** 6 of 11 review perspectives

**Files:**
- `src/lib/realtime/realtime-coordination.ts:88` — `acquireSharedSseConnectionSlot` uses `Date.now()` for `nowMs`
- `src/lib/realtime/realtime-coordination.ts:148` — `shouldRecordSharedHeartbeat` uses `Date.now()` for `nowMs`

**Description:** The codebase has systematically migrated from `Date.now()` to `getDbNowUncached()` for all comparisons against DB-stored timestamps inside transactions. The `validateAssignmentSubmission` fix (cycle 45), the assignment PATCH route (cycle 40), the submission rate-limit (cycle 43), and the recruiting invitation routes all use `getDbNowUncached()`. The shared SSE coordination functions are the only remaining code paths that use `Date.now()` to compare against DB-stored `rateLimits` columns inside a `pg_advisory_xact_lock` transaction.

This only affects deployments with `REALTIME_COORDINATION_BACKEND=postgresql` configured (multi-instance production deployments), which is precisely where clock skew between containers is most likely.

**Concrete failure scenario (slot leak):** App server clock is 30 seconds behind DB. A student's SSE connection slot has `blockedUntil` at DB time 10:30:00. At DB time 10:31:00, the stale eviction query checks `blockedUntil (10:30:00) < nowMs (10:30:30*1000)`. Since `nowMs` is 30 seconds behind, the slot appears unexpired and is NOT evicted. Over time, leaked slots inflate the connection count, eventually causing `serverBusy` (503) for legitimate connections.

**Fix:** Use `getDbNowUncached()` at the start of each `withPgAdvisoryLock` transaction:
```typescript
const dbNow = await getDbNowUncached();
const nowMs = dbNow.getTime();
```

---

### AGG-2: Non-null assertions on `Map.get()` in contests page — two instances [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-1), critic (CRI-1), verifier (V-1), test-engineer (TE-1)
**Signal strength:** 4 of 11 review perspectives

**Files:**
1. `src/app/(dashboard)/dashboard/contests/page.tsx:109` — `statusMatchesFilter(statusMap.get(c.id)!, filter)`
2. `src/app/(dashboard)/dashboard/contests/page.tsx:178` — `const status = statusMap.get(contest.id)!;`

**Description:** Cycles 43-45 systematically removed non-null assertions from `Map.get()` patterns across contest-scoring.ts, submissions.ts, contest-analytics.ts, and multiple client components. Two instances remain in the contests page server component. While the map is built from the same data source being iterated (making the `!` technically safe by construction), this pattern is inconsistent with the codebase's convergence on explicit null-guard patterns. Any future refactoring that changes the map construction or filtering order could silently introduce a runtime error.

**Concrete failure scenario:** A developer refactors the contests page to filter contests before building the statusMap. The `!` assertions now throw for contests that are in the filtered array but not in the map, causing the page to crash with an unhandled TypeError.

**Fix:** Replace with null-safe alternatives:
```typescript
statusMatchesFilter(statusMap.get(c.id) ?? "closed", filter)
// and
const status = statusMap.get(contest.id) ?? "closed";
```

---

### AGG-3: `rateLimitedResponse` uses `Date.now()` for `X-RateLimit-Reset` header — header inaccuracy under clock skew [LOW/LOW]

**Flagged by:** security-reviewer (SEC-2)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/lib/security/api-rate-limit.ts:124`

**Description:** The `rateLimitedResponse` function computes `X-RateLimit-Reset` using `Date.now() + windowMs`. Under clock skew, the reset timestamp in the header will be inaccurate relative to the DB's actual rate-limit window. The enforcement logic in `atomicConsumeRateLimit` uses `Date.now()` consistently, so the enforcement is internally consistent — the header only misleads API clients about when they can retry.

**Fix:** Low priority — compute the reset time from the DB-stored `blockedUntil` value if available.

---

### AGG-4: Candidate dashboard `Map.get()!` and practice page `resolvedSearchParams!.sort` — remaining non-null assertions [LOW/LOW]

**Flagged by:** code-reviewer (CR-2, CR-3)
**Signal strength:** 1 of 11 review perspectives

**Files:**
1. `src/app/(dashboard)/dashboard/_components/candidate-dashboard.tsx:595` — `assignmentProblemProgressMap.get(assignment.assignmentId)!`
2. `src/app/(public)/practice/page.tsx:129` — `resolvedSearchParams!.sort as SortOption`

**Description:** Two additional non-null assertions in client components. Item 1 is guarded by a conditional `.length` check; item 2 is guarded by a `SORT_VALUES.includes()` check. Both are technically safe but inconsistent with the codebase trend.

**Fix:** Replace with null-safe alternatives.

---

### AGG-5: IOI leaderboard sort uses subtraction for floating-point scores — potential sort instability for tied entries [LOW/LOW]

**Flagged by:** code-reviewer (CR-4)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/lib/assignments/contest-scoring.ts:359`

**Description:** `entries.sort((a, b) => b.totalScore - a.totalScore)` uses subtraction for IOI scores. While scores are rounded to 2 decimal places, floating-point subtraction can still produce tiny non-zero differences for mathematically equal values. Tied entries may appear in non-deterministic order between requests.

**Fix:** Add a secondary sort key for deterministic tie-breaking: `entries.sort((a, b) => b.totalScore - a.totalScore || a.userId.localeCompare(b.userId));`

---

### AGG-6: Contests page badge colors use hardcoded Tailwind classes — not theme-aware [LOW/LOW]

**Flagged by:** designer (DES-1)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/app/(dashboard)/dashboard/contests/page.tsx:224-228`

**Description:** Hardcoded color classes like `bg-blue-500 text-white` for badges may have contrast issues in dark mode.

**Fix:** Low priority — use semantic color variants from the design system.

---

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
- **Prior DOC-1:** SSE route ADR (deferred, LOW/LOW)
- **Prior DOC-2:** Docker client dual-path docs (deferred, LOW/LOW)
- **Prior ARCH-2:** Stale-while-revalidate cache pattern duplication (deferred, LOW/LOW)
- **Prior SEC-2 (from cycle 43):** Anti-cheat heartbeat dedup uses Date.now() for LRU cache (deferred, LOW/LOW)

## Verified Fixes This Cycle (From Prior Cycles)

All fixes from cycles 37-45 remain intact:
1. `"redeemed"` removed from PATCH route state machine
2. `Date.now()` replaced with `getDbNowUnc()` in assignment PATCH
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
15. Submission rate-limit uses `getDbNowUncached()` for clock-skew consistency
16. Contest join route has explicit `auth: true`
17. `validateAssignmentSubmission` uses `getDbNowUncached()` for deadline enforcement
18. Map.get() non-null assertions replaced in contest-scoring, submissions, contest-analytics
19. Non-null assertions replaced with null guards in client components (submission-detail, problem-set-form, role-editor)

## Deferred Items

| Finding | File+Line | Severity/Confidence | Reason for Deferral | Exit Criterion |
|---------|-----------|-------------------|--------------------|---------------|
| AGG-3: Rate-limit header Date.now() for reset | api-rate-limit.ts:124 | LOW/LOW | Header-only inaccuracy; enforcement is internally consistent | API clients report retry-after issues |
| AGG-4: Candidate dashboard and practice page non-null assertions | candidate-dashboard.tsx:595, practice/page.tsx:129 | LOW/LOW | Technically safe by guard; cosmetic inconsistency | Module refactoring cycle |
| AGG-5: IOI leaderboard sort instability | contest-scoring.ts:359 | LOW/LOW | Cosmetic — tied entries get same rank; sort order may vary | User reports inconsistent leaderboard ordering |
| AGG-6: Contests page badge hardcoded colors | contests/page.tsx:224 | LOW/LOW | Visual-only; current colors have adequate contrast | Dark mode audit |
| Prior AGG-2: Rate-limiting Date.now() for DB timestamps | api-rate-limit.ts:54 | MEDIUM/MEDIUM | Adding DB query to hot path increases latency; rate-limit windows are minutes-level | Clock skew observed in production affecting rate limiting |
| Prior AGG-3: Analytics progression unbounded query | contest-analytics.ts:242 | MEDIUM/LOW | Bounded by 5-min cache; typical contest sizes are manageable | Contest with >500 students causes slow analytics response |
| Prior AGG-2: Leaderboard freeze uses Date.now() | leaderboard.ts:52 | LOW/LOW | Display-only inaccuracy; seconds-level | Leaderboard freeze timing becomes a user-facing issue |
| Prior AGG-5: Console.error in client components | discussions/*.tsx, groups/*.tsx | LOW/MEDIUM | Requires architectural decision; no data loss | Client error reporting feature request |
| Prior AGG-6: SSE O(n) eviction scan | events/route.ts:44-55 | LOW/LOW | Bounded by 1000-entry cap | Performance profiling shows bottleneck |
| Prior AGG-7: Manual routes duplicate createApiHandler | migrate/import, restore routes | MEDIUM/MEDIUM | Requires extending createApiHandler to support multipart | Next API framework iteration |
| Prior AGG-8: Global timer HMR pattern duplication | 4 modules | LOW/MEDIUM | DRY concern; each module works correctly | Module refactoring cycle |
| Prior SEC-3: Anti-cheat copies text content | anti-cheat-monitor.tsx:206 | LOW/LOW | 80-char limit; privacy notice accepted | Privacy audit or user complaint |
| Prior SEC-4: Docker build error leaks paths | docker/client.ts:169 | LOW/LOW | Admin-only; Docker output expected | Admin permission review |
| Prior PERF-3: Anti-cheat heartbeat gap query transfers up to 5000 rows | anti-cheat/route.ts:195-204 | MEDIUM/MEDIUM | Could use SQL window function; currently bounded by limit | Long contest with many heartbeats causes slow API response |
| Prior DES-1: Chat widget button badge lacks ARIA announcement | chat-widget.tsx:284-288 | LOW/LOW | Screen reader edge case; badge is visual-only | Accessibility audit or user complaint |
| Prior DOC-1: SSE route ADR | events/route.ts | LOW/LOW | Documentation-only | Next documentation cycle |
| Prior DOC-2: Docker client dual-path docs | docker/client.ts | LOW/LOW | Documentation-only | Next documentation cycle |
| Prior ARCH-2: Stale-while-revalidate cache pattern duplication | contest-scoring.ts, analytics/route.ts | LOW/LOW | DRY concern; both modules work correctly | Module refactoring cycle |
| Prior SEC-2: Anti-cheat heartbeat dedup Date.now() | anti-cheat/route.ts:92 | LOW/LOW | Approximate by design; LRU cache is inherently imprecise | Performance profiling shows missed dedup |
