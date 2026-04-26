# Aggregate Review — RPF Cycle 1/100

**Date:** 2026-04-26
**Cycle:** 1/100 of review-plan-fix loop
**Reviewers:** architect, code-reviewer, critic, debugger, designer, document-specialist, perf-reviewer, security-reviewer, test-engineer, tracer, verifier (11 lanes)
**Total findings:** 1 HIGH (blocking — test failure), 5 MEDIUM, 13 LOW, plus verification notes
**Cross-agent agreement:** Test mock failure flagged by code-reviewer, debugger, test-engineer, verifier (4 lanes converged) → highest signal

---

## Cross-Agent Convergence Map

| Topic | Agents flagging | Severity peak |
|-------|-----------------|---------------|
| `tests/unit/proxy.test.ts` mock missing `getAuthSessionCookieNames` | CR-1, DBG-1, TE-1, VER-6 | **HIGH** |
| Mixed time sources (`Date.now()` vs `getDbNowMs()`) in analytics | ARCH-1, CR-2, CRI-1 | MEDIUM |
| Anti-cheat retry semantics inconsistency | CR-3, CR-5, CRI-2, DBG-4 | MEDIUM |
| Anti-cheat unused dependency | CR-4, PERF-8 | LOW |
| Cookie constants in wrong module | ARCH-3, CRI-3 | LOW |
| Nested error handling complexity in analytics IIFE | CRI-4, DBG-2 | LOW |
| Anti-cheat ARIA / loading-state gaps | DES-4, DES-6 | LOW |
| Password validation doc/code mismatch (pre-existing) | DOC-6 | LOW |

---

## Deduplicated Findings (sorted by severity)

### AGG-1: [HIGH] proxy.test.ts mock missing `getAuthSessionCookieNames` export — 15 unit-test failures

**Sources:** CR-1, DBG-1, TE-1, VER-6 | **Confidence:** HIGH

`tests/unit/proxy.test.ts:51-53` — `vi.mock("@/lib/security/env")` only exports `getValidatedAuthSecret`. `proxy.ts` now imports and calls `getAuthSessionCookieNames()` (line 7, called at 92). Result: 15 tests reaching the 401 / redirect paths fail with: "No `getAuthSessionCookieNames` export is defined on the mock."

**Concrete failure scenario:** `npm run test:unit` reports 15 failures. CI pipeline fails. PROMPT 3 requires fixing this before commit/push.

**Fix:** Add `getAuthSessionCookieNames` to the `vi.mock` factory:

```typescript
vi.mock("@/lib/security/env", () => ({
  getValidatedAuthSecret: getValidatedAuthSecretMock,
  getAuthSessionCookieNames: vi.fn().mockReturnValue({
    name: "authjs.session-token",
    secureName: "__Secure-authjs.session-token",
  }),
}));
```

---

### AGG-2: [MEDIUM] Analytics route mixes `Date.now()` (read) with `getDbNowMs()` (write) — clock-skew brittleness

**Sources:** ARCH-1, CR-2, CRI-1 | **Confidence:** MEDIUM

`src/app/api/v1/contests/[assignmentId]/analytics/route.ts:62` reads `Date.now()` for cache-staleness check; lines 79 and 106 write `await getDbNowMs()` to `cached.createdAt`. If the DB and app server clocks diverge, the staleness comparison subtracts two different time domains. Within 30s tolerance this is acceptable, but the inconsistency is a design smell and creates risk of replication.

**Concrete failure scenario:** NTP drift on app server → `Date.now()` lags 40s behind DB → `Date.now() - cached.createdAt` always < `STALE_AFTER_MS` → cache never refreshes; or the inverse → cache refreshes every request.

**Fix options:**
1. Always read `Date.now()` (matching write side too) — minimal DB hits, drops architectural consistency.
2. Always read `await getDbNowMs()` for staleness — restores consistency, costs 1 DB query per cache hit.
3. Add comment explicitly noting tolerance window and cap clock-skew tolerance via a guard.

**Recommendation:** Option 1 — change cache writes to also use `Date.now()` so staleness math is internally consistent. The 30s window is well above any plausible clock drift in a well-NTP'd deployment.

---

### AGG-3: [MEDIUM] Anti-cheat `scheduleRetryRef` has subtly inconsistent semantics between callers

**Sources:** CR-3, CR-5, CRI-2, DBG-4 | **Confidence:** MEDIUM

`src/components/exam/anti-cheat-monitor.tsx`:
- Line 125: `flushPendingEvents` calls `scheduleRetryRef.current(remaining)` where `remaining` = the events that *just failed*.
- Line 169: `reportEvent` calls `scheduleRetryRef.current(pending)` where `pending` = ALL pending events (including the one just added).

The backoff uses `maxRetry` derived from the input list, so the two callers can produce different backoff values for the same underlying failure stream. Additionally, `reportEvent` lists `flushPendingEvents` in its `useCallback` dependency array (line 172) but no longer calls it post-refactor — causing unnecessary re-creation of `reportEvent` and `reportEventRef`.

**Concrete failure scenario:** Two failures in quick succession. First triggers `scheduleRetryRef([failedA])` → backoff 2s. Second event added before timer fires; `reportEvent` calls `scheduleRetryRef([pendingA, pendingB])` → guard `!retryTimerRef.current` is false → no new timer. The original timer fires at 2s and uses `performFlush()` which loads all pending. So behavior is correct, but the semantic mismatch is confusing.

**Fix:**
1. Remove `flushPendingEvents` from `reportEvent`'s dependency array (it's no longer used in the body).
2. Add a comment near `scheduleRetryRef` describing the contract: "the input list is informational for backoff calculation only; the timer always reloads pending events from localStorage via `performFlush`."

---

### AGG-4: [MEDIUM] Anti-cheat retry timer holds stale `performFlush` closure across `assignmentId` change

**Sources:** DBG-4 | **Confidence:** MEDIUM

`src/components/exam/anti-cheat-monitor.tsx:138-141` — when a retry timer is already pending and `performFlush` changes (e.g., `assignmentId` prop or `sendEvent` identity changes), the running timer keeps the old closure. The next-generation timer self-corrects but one fired retry can use stale state.

**Concrete failure scenario:** In practice the `assignmentId` prop doesn't change in the lifetime of one mount (the component is keyed on it), so this is mostly theoretical. But if a future caller passes `assignmentId` as a changing prop, the bug becomes real.

**Fix:** Document the assumption in a JSDoc comment, OR clear the retry timer in the `useEffect` that depends on `[performFlush]` so a fresh closure is always used. The latter is safer but slightly perturbs the retry schedule.

---

### AGG-5: [MEDIUM] No tests cover the new analytics `Date.now()` staleness optimization or the `Date.now()` cooldown fallback

**Sources:** TE-3, TE-5 | **Confidence:** HIGH

`src/app/api/v1/contests/[assignmentId]/analytics/route.ts` — the new cache-staleness check (line 62) and the catch-block fallback (line 90) have no automated test coverage. The behavior is correct per code review, but regressions would slip through.

**Concrete failure scenario:** A future refactor reverts `Date.now()` to `await getDbNowMs()` for staleness, reintroducing the per-request DB hit. No test would catch the regression.

**Fix:** Add API-level vitest tests under `tests/unit/api/contests/analytics.test.ts` covering:
1. Cache hit + within TTL → no DB call for staleness.
2. Cache hit + stale → background refresh triggered exactly once.
3. Background refresh failure → cooldown timestamp stored (DB or `Date.now()` fallback).

---

### AGG-6: [LOW] `reportEvent` declares unused `flushPendingEvents` dependency (also covered by AGG-3)

**Sources:** CR-4, PERF-8 | **Confidence:** HIGH

See AGG-3. The dependency causes minor benign re-renders and signals intent that no longer matches the body.

**Fix:** Drop `flushPendingEvents` from `reportEvent`'s dep array.

---

### AGG-7: [LOW] `getAuthSessionCookieNames()` is a function-wrapped constant — abstraction without payoff

**Sources:** ARCH-3, CRI-3 | **Confidence:** MEDIUM

`src/lib/security/env.ts:178-180` exports a function that returns hardcoded object constants. Single callsite, no dynamic behavior. Could be `export const AUTH_SESSION_COOKIE_NAMES = { ... } as const`. Mild impedance mismatch with the dynamic `getAuthSessionCookieName()` (singular, HTTPS-aware).

**Fix:** Either keep as-is (no harm done) or convert to a `const` object and update callers. Defer unless multiple callsites emerge.

---

### AGG-8: [LOW] Analytics IIFE has 3-level nested error handling — readability cost

**Sources:** CRI-4, DBG-2 | **Confidence:** LOW

`src/app/api/v1/contests/[assignmentId]/analytics/route.ts:76-99` — async IIFE with try/catch (with nested try/catch inside catch) and an outer `.catch(() => {})`. Defensive but hard to read. Extracting to a named `async function refreshAnalyticsCache(...)` would clarify control flow.

**Fix:** Extract the refresh body into a named function.

---

### AGG-9: [LOW] `ShieldAlert` icon in privacy notice lacks `aria-hidden="true"`

**Sources:** DES-6 | **Confidence:** MEDIUM

`src/components/exam/anti-cheat-monitor.tsx` — decorative icon on the privacy-consent dialog should be hidden from assistive tech.

**Fix:** Add `aria-hidden="true"` to the `<ShieldAlert />` element.

---

### AGG-10: [LOW] Anti-cheat monitor has no user-visible "events failing to send" indicator

**Sources:** DES-4 | **Confidence:** LOW

If the network is persistently down throughout an exam, the user has no feedback. Tradeoff: avoiding distraction. Could add a subtle "offline" indicator after N consecutive failures.

**Fix:** Defer — design judgment call. Track as deferred enhancement.

---

### AGG-11: [LOW] AGENTS.md says "only check minimum length" but `password.ts` has dictionary + similarity checks (pre-existing)

**Sources:** DOC-6 | **Confidence:** MEDIUM

`AGENTS.md:517-521` says password validation must "only check minimum length — exactly 8 characters minimum, no other rules." Code at `src/lib/security/password.ts` also performs:
- Common-password dictionary check (line 45)
- Username similarity check (line 50-55)
- Email local-part similarity check (line 59-66)

Pre-existing. The CLAUDE.md rule explicitly says "Do NOT add complexity requirements (uppercase, numbers, symbols), similarity checks, or dictionary checks."

**Fix:** Either (a) remove the extra checks in code to match the documented rule, or (b) update AGENTS.md/CLAUDE.md to reflect the actual checks. This is a policy decision needing user input — DEFER.

---

### AGG-12: [LOW] No unit test for `getAuthSessionCookieNames()`

**Sources:** TE-2 | **Confidence:** HIGH

New exported function has no dedicated unit test. Trivial to add.

**Fix:** Add a test in `tests/unit/security/env.test.ts` (or create the file).

---

## Verification Notes (no action — informational)

- ARCH-2: Anti-cheat component is 321 lines; SRP suggestion to decompose into hooks. Tracked but not actioned this cycle.
- ARCH-4: Proxy import coupling unchanged; no regression.
- ARCH-5: Module-level cache acceptable for Docker single-process deployment.
- DBG-3: `scheduleRetryRef.current = () => {}` initial no-op never fires with real data. SAFE.
- DBG-5: localStorage keyed by `assignmentId` — no cross-contest leakage. SAFE.
- DES-1, DES-2, DES-3, DES-5: All UX/typography rules verified compliant.
- PERF-1: `Date.now()` staleness check eliminates one DB query per cache hit — confirmed perf improvement.
- PERF-2..7: All other perf observations verify good design.
- SEC-1..7 + OBS-1..3: No security regressions, only improvements (cookie name single-source-of-truth).
- DOC-1..5: Documentation matches code. Only DOC-6 (pre-existing) flagged.

---

## Carried Deferred Items (cycle 48 → cycle 1, unchanged)

DEFER-22 through DEFER-57 carried forward from prior cycles. See `.context/reviews/_aggregate-cycle-48.md` for full list. None re-opened by this cycle's reviews.

---

## No Agent Failures

All 11 lanes completed successfully. Aggregate written without retries.
