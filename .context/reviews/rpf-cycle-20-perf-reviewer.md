# RPF Cycle 20 — Performance Reviewer

**Date:** 2026-04-22
**Base commit:** 4182e529

## Findings

### PERF-1: `comment-section.tsx:45` — Missing `.catch()` on `.json()` may cause unhandled rejections [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/_components/comment-section.tsx:45`

**Description:** The `fetchComments` callback calls `response.json()` without `.catch()` on the success path. If the response is non-JSON, the resulting SyntaxError is caught by the outer try-catch, but the error path calls `toast.error(tComments("loadError"))` which is an unnecessary user notification for a parse failure. Adding `.catch()` would allow silent fallback and prevent the toast spam on intermittent proxy issues.

**Fix:** Add `.catch(() => ({ data: [] }))` to avoid unnecessary error toasts on parse failures.

---

### PERF-2: `create-group-dialog.tsx:74` — Unguarded `.json()` triggers unnecessary error toast on non-JSON success response [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:74`

**Description:** If `.json()` throws on a 200 response, the catch block shows an error toast. This is a false positive from the user's perspective — the operation actually succeeded but the response was non-parseable. Adding `.catch()` would eliminate this unnecessary toast.

**Fix:** Add `.catch(() => ({ data: {} }))` or use `apiFetchJson`.

---

### PERF-3: `admin-config.tsx:103` — Test connection `.json()` without `.catch()` causes unnecessary error display [LOW/MEDIUM]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:103`

**Description:** Same pattern as PERF-1/PERF-2. The test-connection feature may show a false-positive error if the success response is non-JSON.

**Fix:** Add `.catch()` or use `apiFetchJson`.

---

## Verified Safe (No Issue Found)

- `submission-overview.tsx` properly uses `.json().catch()` pattern
- `use-submission-polling.ts` has proper exponential backoff with `delayMs = Math.min(delayMs * 2, 30000)`
- `useVisibilityPolling` hook properly pauses polling when tab is hidden
- Contest quick stats use AbortController for request cancellation
- Sidebar timer has visibilitychange listener (fixed in previous cycle)
- `formatDuration` consolidated in `formatting.ts` (fixed in previous cycle)
- `formatBytes` uses `formatNumber` internally for locale-aware formatting
- No large array operations without pagination observed in new code
