# RPF Cycle 7 — Aggregate Review

**Date:** 2026-04-22
**Base commit:** b3147a98
**Review artifacts:** code-reviewer.md, perf-reviewer.md, security-reviewer.md, architect.md, critic.md, verifier.md, debugger.md, test-engineer.md, tracer.md, designer.md, document-specialist.md

## Previously Fixed Items (Verified in Current Code)

All cycle 1-5 aggregate findings have been addressed. Verified by verifier (V-1):
- AGG-1 from cycle 3 (systematic response.json() before response.ok): Fixed in 12+ files
- AGG-2 from cycle 3 (discussion-vote-buttons silent failure): Fixed — now shows toast.error
- AGG-3 from cycle 3 (anti-cheat timeline polling): Fixed — uses useVisibilityPolling
- AGG-4 from cycle 3 (contest-replay native select): Fixed — uses project Select component
- AGG-5 from cycle 3 (apiFetch JSDoc): Fixed — anti-pattern example added

## Deduped Findings (sorted by severity then signal)

### AGG-1: `response.json()` before `response.ok` persists in 4 remaining files — still no centralized helper [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1 through CR-4), security-reviewer (SEC-1), architect (ARCH-1), critic (CRI-1), debugger (DBG-1, DBG-2, DBG-3), tracer (TR-1, TR-2, TR-3), verifier (V-2, V-3, V-4), designer (DES-1)
**Signal strength:** 9 of 11 review perspectives

**Files:**
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:64-68`
- `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212-215`
- `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:144-146` (restore handler only; backup handler is correct)
- `src/lib/plugins/chat-widget/admin-config.tsx:99-100`

**Description:** This is the fourth cycle where this pattern is flagged. Cycles 1-3 fixed 12+ instances. The JSDoc anti-pattern example was added but 4 additional files still use the anti-pattern. The most impactful instance is `bulk-create-dialog.tsx` where a partial-success bulk operation loses error details. The `database-backup-restore.tsx` case is notable because the backup handler in the same file was already fixed but the restore handler was not.

**Concrete failure scenario:** Admin bulk-creates 50 users. API creates 30 then returns 502 HTML from proxy. `response.json()` throws SyntaxError. Admin sees generic "Error" toast with no indication of partial success. They may retry, creating duplicates.

**Fix:** Check `response.ok` before `response.json()` in all 4 files. Use `.json().catch(() => ({}))` for error bodies. For `database-backup-restore.tsx`, unify both paths.

---

### AGG-2: `database-backup-restore.tsx` has inconsistent error handling between backup and restore paths [LOW/MEDIUM]

**Flagged by:** architect (ARCH-2), critic (CRI-2), debugger (DBG-3), tracer (TR-3), document-specialist (DOC-2)
**Signal strength:** 5 of 11 review perspectives

**Files:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:44 vs 144`

**Description:** The backup handler uses `.json().catch(() => ({}))` before checking `response.ok`, but the restore handler calls `response.json()` unconditionally. This inconsistency within the same component is confusing and suggests the restore handler was not updated when the backup handler was fixed.

**Fix:** Apply the same `.json().catch(() => ({}))` pattern to the restore handler.

---

### AGG-3: `admin-config.tsx` shows hardcoded "Network error" string instead of i18n key [LOW/LOW]

**Flagged by:** designer (DES-3)
**Signal strength:** 1 of 11 review perspectives

**Files:** `src/lib/plugins/chat-widget/admin-config.tsx:102`

**Description:** The catch block shows the hardcoded English string "Network error" instead of using an i18n translation key. This breaks i18n for non-English users.

**Fix:** Use `t("errorNetwork")` or similar i18n key.

---

### AGG-4: `useVisibilityPolling` JSDoc missing note about callback error handling responsibility [LOW/LOW]

**Flagged by:** document-specialist (DOC-1)
**Signal strength:** 1 of 11 review perspectives (also flagged as DOC-2 in cycle 3 but not addressed)

**Files:** `src/hooks/use-visibility-polling.ts:6-13`

**Description:** The JSDoc does not document that the callback must handle its own errors. Without this, developers may assume the hook catches errors from the callback.

**Fix:** Add a note: "The callback must handle its own errors. The hook does not catch errors thrown by the callback."

---

### AGG-5: `submission-detail-client.tsx` handleRetryRefresh calls `res.json()` without checking `res.ok` [LOW/LOW]

**Flagged by:** code-reviewer (CR-5)
**Signal strength:** 1 of 11 review perspectives

**Files:** `src/app/(dashboard)/dashboard/submissions/[id]/submission-detail-client.tsx:100`

**Description:** The retry handler uses a `.then((res) => res.json())` chain without checking `res.ok` first. This is a lower-risk path since it's a manual retry action, but still violates the documented convention.

**Fix:** Check `res.ok` before `.json()` or restructure with async/await.

---

## Previously Deferred Items (Carried Forward)

From prior cycles:
- DEFER-1: Migrate raw route handlers to `createApiHandler` (22 routes)
- DEFER-2: SSE connection tracking eviction optimization
- DEFER-3: SSE connection cleanup test coverage
- D1: JWT authenticatedAt clock skew with DB tokenInvalidatedAt (MEDIUM)
- D2: JWT callback DB query on every request — add TTL cache (MEDIUM)
- A19: `new Date()` clock skew risk in remaining routes (LOW)
- DEFER-20: Contest clarifications show raw userId instead of username
- DEFER-21: Duplicated visibility-aware polling pattern (partially addressed)
- DEFER-22: copyToClipboard dynamic import inconsistency
- DEFER-23: Practice page Path B progress filter
- DEFER-24: Invitation URL uses window.location.origin (SEC-2 also flagged access-code-manager and workers-client)
- DEFER-25: Duplicate formatTimestamp utility
- DEFER-1 (cycle 1): Add unit tests for useVisibilityPolling, SubmissionListAutoRefresh, and stats endpoint
- DEFER-2 (cycle 1): Standardize error handling pattern in useVisibilityPolling

## Agent Failures

None. All 11 review perspectives completed successfully.
