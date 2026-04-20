# Cycle 3 Code-Quality Review

**Date:** 2026-04-19
**Base commit:** f637c590
**Reviewer:** code-reviewer

## Findings

### F1 — Admin chat-logs route uses bare `parseInt` instead of shared `parsePositiveInt` utility
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/chat-logs/route.ts:19`
- **Evidence:** `const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));`
- **Why it matters:** This bypasses the shared `parsePositiveInt` utility introduced in cycle 2 (NAFIX-01) to prevent NaN propagation. While `Math.max(1, NaN)` returns `NaN` (not 1), the `parseInt` fallback to `"1"` means NaN only occurs with truly malformed inputs like `"abc"`. However, the inconsistency means the shared utility pattern is not being used project-wide, and `parseInt("abc", 10)` returns `NaN`, making `Math.max(1, NaN) === NaN` — a bug.
- **Failure scenario:** Request to `/api/v1/admin/chat-logs?page=abc` produces `page=NaN`, causing `offset=NaN*50=NaN`, likely resulting in a SQL error or unexpected behavior.
- **Suggested fix:** Replace with `parsePositiveInt(url.searchParams.get("page"), 1)`.

### F2 — Admin submissions CSV export has no row limit (DoS risk)
- **Severity:** HIGH
- **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/submissions/export/route.ts:95-111`
- **Evidence:** The query at line 95-111 has no `.limit()` or `.offset()`, fetching all matching rows. Unlike the admin audit-logs and login-logs CSV exports fixed in cycle 2 (CSV-01), this route was missed.
- **Why it matters:** An admin user can request an unbounded CSV export that loads all submissions into memory, potentially millions of rows, causing OOM.
- **Failure scenario:** Admin user hits `/api/v1/admin/submissions/export` on a deployment with 500K+ submissions; server runs out of memory and crashes.
- **Suggested fix:** Apply `.limit()` with a maximum export row count (e.g., 10000). Add pagination or streaming if larger exports are needed.

### F3 — Admin submissions CSV export has duplicate `escapeCsvField` function
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/submissions/export/route.ts:37-46`
- **Evidence:** This file defines its own `escapeCsvField` locally, while `src/lib/csv/escape-field.ts` was extracted as a shared utility in cycle 2 (CSV-01).
- **Why it matters:** CSV injection fixes must be applied in both places, and the two implementations could diverge.
- **Suggested fix:** Import `escapeCsvField` from `@/lib/csv/escape-field`.

### F4 — Anti-cheat route uses bare `parseInt` instead of shared utility
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:148-149`
- **Evidence:** `parseInt(searchParams.get("limit") ?? "100", 10) || 100` — while the `|| 100` fallback handles NaN, it does not use the shared `parsePositiveInt` utility.
- **Why it matters:** Inconsistent with the project-wide NaN fix pattern. The `|| 100` pattern does handle NaN correctly here, but maintaining two patterns increases maintenance burden.
- **Suggested fix:** Replace with `parsePositiveInt(searchParams.get("limit"), 100, { strict: true })`.

### F5 — Chat widget `get_submission_history` tool uses `Number(args.limit)` which can produce NaN
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/lib/plugins/chat-widget/tools.ts:124`
- **Evidence:** `const limit = Math.min(Math.max(Number(args.limit) || 5, 1), 10);` — `Number(undefined)` returns `NaN`, and `NaN || 5` returns `5`, so this is safe. However, `Number("abc")` also returns `NaN` which falls through correctly. The pattern is safe but inconsistent with the rest of the codebase.
- **Suggested fix:** Use `parsePositiveInt(String(args.limit), 5)` for consistency.

### F6 — `workspaceShell` i18n keys will become orphaned when workspace layout is removed
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/(workspace)/layout.tsx:21`, `messages/en.json`, `messages/ko.json`
- **Evidence:** The workspace layout uses `workspaceShell` translation keys. When the workspace-to-public migration (Phase 1) removes this layout, those keys become dead weight in the message files.
- **Why it matters:** Orphaned i18n keys increase translation burden and confuse translators.
- **Suggested fix:** Audit and remove `workspaceShell.*` keys as part of the migration, merging any unique ones into `publicShell` or `community`.

## Summary

Found 6 issues: 1 HIGH (unbounded CSV export), 2 MEDIUM (parseInt inconsistency, i18n orphan keys), 3 LOW (duplicate escapeCsvField, parseInt pattern inconsistency, Number() pattern in chat tools). The unbounded CSV export is the most critical.
