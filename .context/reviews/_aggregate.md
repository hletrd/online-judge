# RPF Cycle 26 — Aggregate Review

**Date:** 2026-04-22
**Base commit:** f55836d0
**Review artifacts:** code-reviewer.md, perf-reviewer.md, security-reviewer.md, architect.md, critic.md, verifier.md, debugger.md, test-engineer.md, tracer.md, designer.md, document-specialist.md

## Previously Fixed Items (Verified in Current Code)

All cycle-25 aggregate findings have been addressed:
- AGG-1 (default error handlers leaking raw error.message): Fixed across 8+ components
- AGG-2 (compiler-client raw API error messages in toasts): Fixed — uses i18n keys and String() wrapping
- AGG-3 (contest-quick-stats double-wrapping Number()): Fixed — uses typeof checks
- AGG-4 (contest-replay Number() to parseInt()): Fixed — uses parseInt(v, 10)
- AGG-5 (recruiting-invitations-panel stats+invitations combined fetch): Fixed — separated

## Deduped Findings (sorted by severity then signal)

### AGG-1: Double `.json()` anti-pattern in 3 files — incomplete migration from cycles 23-24 [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1, CR-2, CR-3), security-reviewer (SEC-1), critic (CRI-1), verifier (V-1), debugger (DBG-1), architect (ARCH-1), tracer (TR-1), perf-reviewer (PERF-1), test-engineer (TE-1)
**Signal strength:** 10 of 11 review perspectives

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273+277`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67+71`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335+339`

**Description:** Three files still use the error-first double `.json()` anti-pattern where `response.json()` is called once in the `if (!response.ok)` branch and once in the success branch. While the `throw` after the error branch prevents the second `.json()` from running, this pattern is explicitly documented as "DO NOT USE" in `src/lib/api/client.ts:44-52`. Previous cycles 23-24 fixed this same pattern in `compiler-client.tsx`, `discussion-post-form.tsx`, `group-members-manager.tsx`, and `problem-submission-form.tsx`, but these three files were missed.

**Concrete failure scenario:** A developer refactors the error handling and removes or replaces the `throw` with a non-throwing statement (e.g., `setFormError(...)`). The code falls through to the second `.json()` call, which throws `TypeError: Body already consumed`. This bypasses the `getErrorMessage` mapping and shows a raw error to the user.

**Fix:** Migrate all three files to the "parse once, then branch" pattern (parse body before checking `response.ok`, then branch on the result).

---

### AGG-2: `compiler-client.tsx` catch block leaks raw `error.message` in inline error display [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-5), security-reviewer (SEC-2), critic (CRI-2), verifier (V-3), tracer (TR-2)
**Signal strength:** 5 of 11 review perspectives

**File:** `src/components/code/compiler-client.tsx:292-296`

**Description:** The `handleRun` catch block constructs `errorMessage = err instanceof Error ? err.message : "Network error"` and passes it to `updateTestCase` for inline display. While the toast at line 298 correctly uses `t("networkError")`, the inline error display shows the raw `error.message`. This is inconsistent with the spirit of the cycle-25 AGG-1 fix that eliminated raw error messages from all `getErrorMessage` default cases.

**Concrete failure scenario:** A network failure produces `TypeError: Failed to fetch`. The toast shows the localized "Network error", but the inline error panel below the code editor shows "Failed to fetch".

**Fix:** Use `t("networkError")` for the inline error display as well, and log the raw error to console for debugging.

---

### AGG-3: `handleResetAccountPassword` missing `fetchAll()` — inconsistent with other mutation handlers [LOW/LOW]

**Flagged by:** code-reviewer (CR-4), architect (ARCH-2), debugger (DBG-2)
**Signal strength:** 3 of 11 review perspectives

**File:** `src/components/contest/recruiting-invitations-panel.tsx:282-301`

**Description:** `handleRevoke` (line 271) and `handleDelete` (line 311) both call `fetchAll()` after success to refresh the invitations list and stats. `handleResetAccountPassword` does NOT call `fetchAll()` after success. While a password reset doesn't change visible invitation fields today, the inconsistency suggests an omission. If the backend adds side effects (e.g., status change, audit entry), the UI would show stale data.

**Fix:** Add `await fetchAll()` after the success toast in `handleResetAccountPassword`, or add a comment documenting the intentional omission.

---

### AGG-4: `contest-quick-stats.tsx` still has redundant `!` non-null assertions [LOW/LOW]

**Flagged by:** critic (CRI-3), perf-reviewer (PERF-2)
**Signal strength:** 2 of 11 review perspectives

**File:** `src/components/contest/contest-quick-stats.tsx:65-68`

**Description:** The cycle-25 fix (AGG-3) replaced `Number.isFinite(Number(x))` with `typeof x === "number" && Number.isFinite(x)`, but left `data.data!.participantCount` with the `!` non-null assertion. The `typeof` guard already ensures the value is a number, making the `!` redundant.

**Fix:** Remove the `!` non-null assertions where the `typeof` guard already ensures safety.

---

### AGG-5: `contest-replay.tsx` auto-play uses `setInterval` instead of recursive `setTimeout` [LOW/LOW]

**Flagged by:** code-reviewer (CR-6), architect (ARCH-3)
**Signal strength:** 2 of 11 review perspectives

**File:** `src/components/contest/contest-replay.tsx:77-87`

**Description:** The auto-play feature uses `setInterval` which can accumulate drift. The recursive `setTimeout` pattern used in `countdown-timer.tsx` and `anti-cheat-monitor.tsx` is more precise and consistent.

**Fix:** Replace `setInterval` with recursive `setTimeout`.

---

### AGG-6: `active-timed-assignment-sidebar-panel.tsx` interval stops but effect doesn't re-enter [LOW/LOW]

**Flagged by:** perf-reviewer (PERF-3)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:63-75`

**Description:** The `setInterval` callback clears itself when all assignments expire. However, the effect depends on `[assignments]`, not on a derived "has active" boolean. If a new assignment is added while the interval is stopped (but the component is still mounted), the effect won't re-run because `assignments` reference equality hasn't changed.

**Fix:** Add a derived `hasActiveAssignment` boolean to the effect dependencies.

---

## Security Findings (carried)

### SEC-3: `window.location.origin` for URL construction — covered by DEFER-24 (2 instances still present)
### SEC-4: Encryption plaintext fallback — MEDIUM/MEDIUM, carried from DEFER-39
### SEC-5: `AUTH_CACHE_TTL_MS` has no upper bound — LOW/MEDIUM, carried from DEFER-40
### SEC-6: Anti-cheat localStorage persistence — LOW/LOW, carried from DEFER-48
### SEC-7: `sanitizeHtml` root-relative img src — LOW/LOW, carried from DEFER-49

## Performance Findings

### PERF-1: Double `.json()` anti-pattern — merged into AGG-1
### PERF-2: Quick-stats redundant `!` assertions — merged into AGG-4
### PERF-3: Sidebar interval re-entry — AGG-6

## Test Coverage Gaps (from test-engineer)

### TE-1: No tests for double `.json()` anti-pattern regression — new [MEDIUM/MEDIUM]
### TE-2: No tests for `handleResetAccountPassword` behavior — new [LOW/MEDIUM]
### TE-3: Carried test coverage gaps from previous cycles

## Documentation Findings (from document-specialist)

### DOC-1: `apiFetchJson` JSDoc migration note — LOW/LOW
### DOC-2: `handleResetAccountPassword` missing `fetchAll()` comment — LOW/LOW

## UI/UX Findings (from designer)

### DES-1: Quick-stats cards lack loading skeleton — LOW/MEDIUM
### DES-2: Create invitation dialog fields not disabled during creation — LOW/LOW
### DES-3: Contest replay slider lacks step markers — LOW/LOW

## Previously Deferred Items (Carried Forward)

All previously deferred items from prior cycle plans remain in effect:
- DEFER-1 through DEFER-5 (from cycle 1 plan)
- DEFER-20 through DEFER-25 (from cycle 2 plan)
- D1, D2, A19 (from earlier cycles)
- DEFER-26 through DEFER-55 (from RPF cycle 28 and cycle 24/25 plans)

## Agent Failures

None. All 11 review perspectives completed successfully.
