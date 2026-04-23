# RPF Cycle 21 — Aggregate Review

**Date:** 2026-04-22
**Base commit:** 4b9d48f0
**Review artifacts:** code-reviewer.md, perf-reviewer.md, security-reviewer.md, architect.md, critic.md, verifier.md, debugger.md, test-engineer.md, tracer.md, designer.md, document-specialist.md

## Previously Fixed Items (Verified in Current Code)

All cycle-18/19/20 aggregate findings have been addressed:
- AGG-1 (formatDetailsJson hardcoded English in participant-anti-cheat-timeline.tsx): Fixed — uses `t()` with i18n keys
- AGG-2 (recruiter-candidates-panel full export fetch): Carried as DEFER-29
- AGG-3 (participant-anti-cheat-timeline polling offset drift): Fixed — resets to first page on poll
- AGG-4 (api-keys-client not using apiFetchJson): Fixed — migrated to apiFetchJson
- AGG-5 (window.location.origin for URL construction): Carried as DEFER-24
- AGG-6 (sidebar timer lacks visibility awareness): Fixed — visibilitychange listener added
- AGG-7 (duplicate formatDuration): Fixed — consolidated into formatting.ts
- AGG-8 (code-timeline-panel aria-label): Fixed — aria-label added to snapshot dots
- AGG-9 (quick-create-contest-form silent success): Fixed — navigates to contests list
- AGG-10 (participant-anti-cheat-timeline aria-controls): Carried (LOW/LOW)

All cycle-20 fixes verified:
- AGG-1 through AGG-8: All implemented (.catch() guards, parseInt fixes, JSDoc, aria-live)

## Deduped Findings (sorted by severity then signal)

### AGG-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` not migrated to i18n — divergent copy [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1), architect (ARCH-1), critic (CRI-1), verifier (V-1), debugger (DBG-1), tracer (TR-1), document-specialist (DOC-1)
**Signal strength:** 7 of 11 review perspectives

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`

**Description:** The `formatDetailsJson` in `anti-cheat-dashboard.tsx` only pretty-prints JSON. The timeline version (fixed in cycle 18 AGG-1) uses i18n keys to render "Target: Code editor" from `{"target": "code-editor"}`. The dashboard was missed during the cycle-18 migration. Both components display the same anti-cheat event details data but render it differently.

**Concrete failure scenario:** An instructor views the anti-cheat dashboard and sees raw JSON `{"target": "code-editor"}` in expanded details. They then view the participant timeline for the same student and see the localized "Target: Code editor" / Korean equivalent. The same data appears differently in two views.

**Fix:** Migrate the dashboard's `formatDetailsJson` to accept `t` as a parameter and use i18n keys, matching the timeline implementation. The i18n keys already exist in `en.json` and `ko.json` (`detailTargetLabel`, `detailTargets.*`).

---

### AGG-2: `window.location.origin` for URL construction — carried from DEFER-24, now 4 instances [MEDIUM/MEDIUM]

**Flagged by:** security-reviewer (SEC-1)
**Signal strength:** 1 of 11 (security-specific, carried)

**Files:**
- `src/components/contest/access-code-manager.tsx:137`
- `src/components/contest/recruiting-invitations-panel.tsx:99`
- `src/app/(dashboard)/dashboard/admin/files/file-management-client.tsx:96` (NEW)
- `src/app/(dashboard)/dashboard/admin/workers/workers-client.tsx:148` (NEW)

**Description:** Four components now use `window.location.origin` for URL construction. Two new instances found this cycle. Carried from DEFER-24.

**Fix:** Use a server-provided public URL or configurable base URL.

---

### AGG-3: `role-editor-dialog.tsx` uses `Number(e.target.value)` for level input — NaN risk [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-2), debugger (DBG-2), tracer (TR-2), verifier (V-2), architect (ARCH-3 partial)
**Signal strength:** 5 of 11 review perspectives

**File:** `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:187`

**Description:** The role level input uses `Number(e.target.value)` which can produce `NaN` from non-numeric input. The established pattern in recent fixes is `parseInt()` with fallback defaults. `Number("abc")` is `NaN` while `parseInt("abc", 10)` is also `NaN` but `parseInt("abc", 10) || 0` gives a safe default.

**Concrete failure scenario:** Admin pastes "abc" into level field, `Number("abc")` = NaN, form submits with NaN, `JSON.stringify({level: NaN})` produces `{"level":null}`, server Zod schema rejects.

**Fix:** Use `parseInt(e.target.value, 10) || 0` matching the established pattern.

---

### AGG-4: `contest-replay.tsx` `setInterval` without visibility awareness — wasted CPU [LOW/MEDIUM]

**Flagged by:** perf-reviewer (PERF-3), debugger (DBG-3)
**Signal strength:** 2 of 11 review perspectives

**File:** `src/components/contest/contest-replay.tsx:77-87`

**Description:** The replay playback uses `setInterval` without visibility awareness. When the tab is hidden, the interval continues firing. This is a cosmetic playback feature, so the impact is low.

**Fix:** Add `visibilitychange` listener to pause/resume playback.

---

### AGG-5: Inconsistent `Number()` vs `parseInt()` across form inputs [LOW/MEDIUM]

**Flagged by:** architect (ARCH-3), code-reviewer (CR-2, CR-3, CR-4)
**Signal strength:** 2 of 11 review perspectives

**Files:**
- `src/components/contest/quick-create-contest-form.tsx:133,172` — `Number()`
- `src/components/contest/contest-replay.tsx:166` — `Number()`

**Description:** Some form inputs use `Number()` while the established pattern is `parseInt()`. The `Number()` calls in `quick-create-contest-form.tsx` have `|| defaultValue` fallbacks that handle NaN, but they differ from the codebase convention.

**Fix:** Standardize to `parseInt(e.target.value, 10) || defaultValue`.

---

### AGG-6: `anti-cheat-dashboard.tsx` expand/collapse buttons lack `aria-controls` [LOW/LOW]

**Flagged by:** designer (DES-1)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/components/contest/anti-cheat-dashboard.tsx:534`

**Description:** The expand/collapse buttons use `aria-expanded` but don't have `aria-controls`. Same issue as cycle 18 DES-2 (for participant-anti-cheat-timeline).

**Fix:** Add `id` to the expanded `<pre>` element and reference via `aria-controls`.

---

### AGG-7: `contest-replay.tsx` range slider lacks `aria-valuetext` [LOW/LOW]

**Flagged by:** designer (DES-2)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/components/contest/contest-replay.tsx:159-168`

**Description:** The range slider has numeric values but no `aria-valuetext`, so screen readers announce just numbers without the snapshot label context.

**Fix:** Add `aria-valuetext={selectedSnapshot.label}` to the range input.

---

### AGG-8: `active-timed-assignment-sidebar-panel.tsx` progress bar `aria-valuenow` rounded [LOW/LOW]

**Flagged by:** designer (DES-3)
**Signal strength:** 1 of 11 (carried from cycle 18)

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:172`

**Description:** `aria-valuenow={Math.round(progressPercent)}` while visual shows one decimal place. Carried from cycle 18.

**Fix:** Use `aria-valuenow={progressPercent}`.

---

## Performance Findings (carried)

### PERF-1: `recruiter-candidates-panel.tsx` full export fetch — carried as DEFER-29
### PERF-2: Practice page Path B progress filter — carried from cycles 18-20

## Security Findings (carried)

### SEC-1: `window.location.origin` for URL construction — covered by AGG-2 above
### SEC-2: Gemini model name URL interpolation — LOW/MEDIUM, carried from cycle 18
### SEC-3: Encryption plaintext fallback — MEDIUM/MEDIUM, carried from cycle 11

## Test Coverage Gaps (from test-engineer)

### TE-1: No unit tests for `formatDetailsJson` in `anti-cheat-dashboard.tsx` — new [LOW/MEDIUM]
### TE-2: No component tests for `anti-cheat-dashboard.tsx` — new [LOW/MEDIUM]
### TE-3: No component tests for `role-editor-dialog.tsx` — new [LOW/MEDIUM]
### TE-4: No component tests for `contest-replay.tsx` — new [LOW/LOW]
### TE-5 through TE-11: Carried from previous cycles (see test-engineer.md)

## Previously Deferred Items (Carried Forward)

- DEFER-1: Migrate raw route handlers to `createApiHandler` (22 routes)
- DEFER-2: SSE connection tracking eviction optimization
- DEFER-3: SSE connection cleanup test coverage
- D1: JWT authenticatedAt clock skew with DB tokenInvalidatedAt (MEDIUM)
- D2: JWT callback DB query on every request — add TTL cache (MEDIUM)
- A19: `new Date()` clock skew risk in remaining routes (LOW)
- DEFER-20 through DEFER-30: See previous aggregates
- DEFER-50 through DEFER-57: Test gaps (see test-engineer.md)
- DEFER-24: Invitation URL uses window.location.origin (same as AGG-2)
- DEFER-29: Add dedicated candidates summary endpoint (same as PERF-1)

## Agent Failures

None. All 11 review perspectives completed successfully.
