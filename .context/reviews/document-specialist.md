# Document Specialist Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** document-specialist
**Base commit:** 4b9d48f0

## DOC-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` not documented as needing i18n migration [LOW/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

The `formatDetailsJson` function in the dashboard component has no JSDoc or comment indicating it should display localized strings for the `target` field. The timeline version was migrated in cycle 18 but this copy was missed. Without documentation, future developers may not realize this function needs i18n support.

**Fix:** When migrating to i18n-aware version, add JSDoc documenting the `t` parameter and the i18n key pattern (`detailTargets.*`).

---

## DOC-2: `apiFetchJson` JSDoc is comprehensive and accurate [NO ISSUE]

**File:** `src/lib/api/client.ts:87-123`
**Confidence:** HIGH

The JSDoc for `apiFetchJson` was updated in cycle 20 to explicitly mention both-path `.catch()` protection. The documentation is thorough and up-to-date.

---

## DOC-3: `formatting.ts` JSDoc is comprehensive — `formatDuration` properly documented [NO ISSUE]

**File:** `src/lib/formatting.ts:113-126`
**Confidence:** HIGH

The `formatDuration` function has proper JSDoc documenting its behavior: "Returns '00:00:00' for non-finite, zero, or negative values." The consolidation from two component-local functions was done correctly in cycle 18.

---

## Verified Safe

- `apiFetch` JSDoc is accurate and up-to-date
- `copyToClipboard` utility has proper JSDoc
- Error handling convention table in `client.ts` is accurate
- `useVisibilityPolling` JSDoc accurately describes its behavior
