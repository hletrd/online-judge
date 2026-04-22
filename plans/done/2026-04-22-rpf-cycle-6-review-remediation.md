# RPF Cycle 6 — Review Remediation Plan

**Date:** 2026-04-22
**Source:** `.context/reviews/rpf-cycle-6-aggregate.md`
**Status:** COMPLETED

## Scope

This cycle addresses findings from the RPF cycle 6 multi-agent review:
- AGG-1: `handleCreate` missing catch block in recruiting-invitations-panel.tsx
- AGG-2: Anti-cheat dashboard polling replaces loaded events, breaking loadMore
- AGG-3: Email field incorrectly required in Create invitation dialog
- AGG-4: `createdLink` state not cleared on error in handleCreate
- AGG-5: Create button has no loading text
- AGG-6: countdown-timer.tsx .json() without .catch() guard
- AGG-7: score-timeline-chart.tsx SVG data points lack keyboard accessibility

No cycle-6 review finding is silently dropped. No new refactor-only work is added under deferred.

---

## Implementation lanes

### H1: Add catch block to `handleCreate` in recruiting-invitations-panel.tsx (AGG-1)

- **Source:** AGG-1
- **Severity / confidence:** MEDIUM / HIGH
- **Citations:** `src/components/contest/recruiting-invitations-panel.tsx:150-213`
- **Cross-agent signal:** 6 agents (code-reviewer, security-reviewer, architect, critic, debugger, verifier)
- **Problem:** `handleCreate` has `try/finally` but no `catch`. Network errors produce no user feedback. All other async handlers in the same component have try/catch.
- **Plan:**
  1. Add `catch { toast.error(t("createError")); }` between try and finally blocks.
  2. Verify all gates pass.
- **Status:** DONE — Commit `53c5f3f2`

### H2: Fix anti-cheat dashboard polling to preserve loaded events (AGG-2)

- **Source:** AGG-2
- **Severity / confidence:** MEDIUM / HIGH
- **Citations:** `src/components/contest/anti-cheat-dashboard.tsx:118-136, 138-155`
- **Cross-agent signal:** 5 agents (perf-reviewer, critic, debugger, verifier, designer)
- **Problem:** `fetchEvents` always requests offset=0 and replaces the entire events list. This resets any loaded-beyond-first-page data and breaks the `offset` state used by `loadMore`.
- **Plan:**
  1. When user has loaded more than PAGE_SIZE events, only replace the first page slice and keep the rest.
  2. Preserve the offset value when the user has loaded beyond PAGE_SIZE.
  3. Verify all gates pass.
- **Status:** DONE — Commit `65d2acb0`

### M1: Remove incorrect email requirement from Create invitation button (AGG-3)

- **Source:** AGG-3
- **Severity / confidence:** LOW / HIGH
- **Citations:** `src/components/contest/recruiting-invitations-panel.tsx:484`
- **Cross-agent signal:** 3 agents (critic, designer, tracer)
- **Problem:** The Create button has `disabled={creating || !createName.trim() || !createEmail.trim()}`. The API treats email as optional. Users cannot create invitations without entering an email.
- **Plan:**
  1. Remove `!createEmail.trim()` from the disabled condition on line 484.
  2. Verify the button is enabled with just a name entered.
  3. Verify all gates pass.
- **Status:** DONE — Commit `53c5f3f2`

### M2: Clear `createdLink` on error in `handleCreate` (AGG-4)

- **Source:** AGG-4
- **Severity / confidence:** LOW / HIGH
- **Citations:** `src/components/contest/recruiting-invitations-panel.tsx:197-209`
- **Problem:** When POST returns non-OK, `createdLink` state is not cleared. A stale link dialog could be visible.
- **Plan:**
  1. Add `setCreatedLink(null)` at the beginning of `handleCreate` (before the try block).
  2. Verify all gates pass.
- **Status:** DONE — Commit `53c5f3f2`

### M3: Add loading text to Create invitation button (AGG-5)

- **Source:** AGG-5
- **Severity / confidence:** LOW / MEDIUM
- **Citations:** `src/components/contest/recruiting-invitations-panel.tsx:484-487`
- **Problem:** Button text doesn't change when `creating` is true.
- **Plan:**
  1. Change button text to `{creating ? tCommon("loading") : t("create")}`.
  2. Verify all gates pass.
- **Status:** DONE — Commit `53c5f3f2`

### L1: Add .catch() guard to countdown-timer.tsx /api/v1/time fetch (AGG-6)

- **Source:** AGG-6
- **Severity / confidence:** LOW / MEDIUM
- **Citations:** `src/components/exam/countdown-timer.tsx:80`
- **Problem:** `res.json()` called without `.catch()` after checking `res.ok`. Inconsistent with documented apiFetch pattern.
- **Plan:**
  1. Change line 80 to: `return res.json().catch(() => null) as Promise<{ timestamp: number } | null>;`
  2. Update line 82 to handle null: `if (!data) return;` (already handles null)
  3. Verify all gates pass.
- **Status:** DONE — Commit `8bfc8d32`

### L2: Add keyboard accessibility to score-timeline-chart.tsx SVG data points (AGG-7)

- **Source:** AGG-7
- **Severity / confidence:** LOW / MEDIUM
- **Citations:** `src/components/contest/score-timeline-chart.tsx:84-93`
- **Problem:** SVG data point circles have `<title>` tooltips but are not keyboard-focusable.
- **Plan:**
  1. Add `tabIndex={0}`, `role="img"`, and `aria-label` to the `<g>` wrapper element for each data point.
  2. Include the score value in the `aria-label`.
  3. Verify all gates pass.
- **Status:** DONE — Commit `b3147a98`

---

## Prior-cycle plan updates

### Cycle 28 plan — All items now DONE

The cycle 28 plan (H1, H2, M1) listed as TODO are confirmed fixed:
- H1: localStorage try/catch in compiler-client.tsx — CONFIRMED FIXED (line 188)
- H2: localStorage try/catch in submission-detail-client.tsx — CONFIRMED FIXED (line 94)
- M1: Redundant defaultValue removed from compiler-client.tsx — CONFIRMED FIXED (no matches found)

---

## Deferred items

### DEFER-1 through DEFER-21: Carried from cycle 5 plan

See `plans/open/2026-04-22-rpf-cycle-5-review-remediation.md` for the full deferred list. All carry forward unchanged.

### DEFER-22: architect ARCH-1 — recruiting-invitations-panel.tsx is too large (613 lines)

- **Source:** ARCH-1
- **Severity / confidence:** LOW / LOW
- **Original severity preserved:** LOW / LOW
- **Reason for deferral:** This is a maintainability concern, not a bug. The component works correctly. Extracting sub-components is a refactor that could introduce regressions if not done carefully.
- **Exit criterion:** When a dedicated refactor pass is scheduled, or when a new feature needs to be added to the invitations panel.

### DEFER-23: document-specialist DOC-2 — problem-set-form.tsx error code list needs sync comment

- **Source:** DOC-2
- **Severity / confidence:** LOW / LOW
- **Original severity preserved:** LOW / LOW
- **Reason for deferral:** Documentation-only change. No functional impact.
- **Exit criterion:** When the error code list is next modified.

---

## Gate verification

- eslint: CLEAN (all changed files pass)
- tsc --noEmit: CLEAN (0 errors)
- next build: SUCCESS
- vitest unit: 294 files, 2104 tests PASSING
- vitest component: 12 pre-existing failures in unrelated files (access-code-manager, api-keys-client, app-sidebar, compiler-client, contest-quick-stats, database-backup-restore, student-dashboard) — these failures involve getDbNow/database mocking issues not related to this cycle's changes
- vitest integration: 3 files, 37 tests SKIPPED (no database available in CI)

## Progress log

- 2026-04-22: Plan created from RPF cycle 6 aggregate review. 7 new tasks (H1, H2, M1-M3, L1, L2). 2 new deferred items. All findings from the aggregate review are either scheduled for implementation or explicitly deferred.
- 2026-04-22: Verified cycle 28 plan items are all DONE (localStorage fixes, defaultValue removal).
- 2026-04-22: Implemented all 7 tasks. H1+M1+M2+M3 in commit 53c5f3f2, H2 in commit 65d2acb0, L1 in commit 8bfc8d32, L2 in commit b3147a98. All gates passing.
