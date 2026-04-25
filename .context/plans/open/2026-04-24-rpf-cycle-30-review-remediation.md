# RPF Cycle 30 Review Remediation Plan

**Date:** 2026-04-24
**Source:** `.context/reviews/_aggregate-cycle-30.md`
**Status:** ALL LANES COMPLETE — ALL GATES PASSED

---

## Summary

Cycle 30 deep review produced 19 deduplicated findings (4 fixed since cycle 29, 15 carried forward, 3 new). The primary themes are: (1) context value instability causing unnecessary re-renders, (2) API response handling anti-patterns across 30+ files, (3) auth bypass in test-connection route, and (4) raw API error string leakage in i18n contexts.

## Action Items This Cycle

### H1: Fix `LectureModeContext` value instability with `useMemo` [AGG-5/NEW-4]

**File:** `src/components/lecture/lecture-mode-provider.tsx:119-135`
**Severity:** MEDIUM
**Reviewers:** comprehensive-reviewer (confirmed across multiple cycles)

**Problem:** The provider creates an inline object with 13 properties on every render. Every property change causes all consumers to re-render, even if they only use one property.

**Plan:**
1. Import `useMemo` from React (already imported)
2. Wrap the provider value in `useMemo` with all 13 properties as dependencies
3. Verify `next build` succeeds
4. Verify no visual regression

**Progress:** [x] Committed as `30dccbcf`, pushed

---

### H2: Fix `migrate/import` route JSON body path — replace unsafe casts with Zod validation [AGG-4/SYS-20]

**File:** `src/app/api/v1/admin/migrate/import/route.ts:117-158`
**Severity:** HIGH
**Reviewers:** comprehensive-reviewer, security-reviewer

**Problem:** The deprecated JSON body path uses `as unknown as { password?: string; data?: JudgeKitExport }` and `nestedData as JudgeKitExport` without runtime validation. While `validateExport()` runs after the cast, the password property is accessed without validation.

**Plan:**
1. Create a Zod schema for the JSON body: `z.object({ password: z.string(), data: z.unknown() })` 
2. Use `.safeParse()` to validate the parsed JSON before accessing properties
3. Replace the `as unknown as` double cast with the validated result
4. Remove `nestedData as JudgeKitExport` — use the validated `data` field directly
5. Keep `validateExport()` as an additional safety layer
6. Verify existing tests still pass

**Progress:** [x] Committed as `77ae49e5`, pushed

---

### H3: Fix test-connection route auth bypass [AGG-7/SYS-15]

**File:** `src/app/api/v1/plugins/chat-widget/test-connection/route.ts:20-35`
**Severity:** MEDIUM
**Reviewers:** comprehensive-reviewer

**Problem:** The route uses `auth: false` and manually checks via `auth()` which doesn't verify `session.user.isActive` or `session.user.tokenInvalidatedAt`. A deactivated user could still test chat widget connections.

**Plan:**
1. Change `auth: false` to `auth: true` in the `createApiHandler` call
2. Remove the manual `auth()` and capability check — `createApiHandler` with `auth: true` handles both
3. The handler already validates the provider and model via Zod, so the manual CSRF check can be removed
4. Add `caps: "system.plugins"` to the handler config
5. Verify `next build` succeeds

**Progress:** [x] Committed as `9f67fcd6`, pushed (including test fixes as `5e58f094`)

---

### H4: Fix raw API error string leakage in `database-backup-restore.tsx` [AGG-20/NEW-5]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:45`
**Severity:** MEDIUM
**Reviewers:** comprehensive-reviewer

**Problem:** `toast.error(t(data.error ?? "fallbackKey"))` passes `data.error` directly as an i18n key. If the API returns an error code not in the translation dictionary, `t()` returns the key itself — the raw API string is displayed.

**Plan:**
1. Define a set of known i18n error keys for backup/restore operations
2. Validate `data.error` against this set before passing to `t()`
3. Fall back to a safe generic key for unknown errors
4. Same fix for the restore error at line 145

**Progress:** [x] Committed as `9c9c423e`, pushed

---

### M1: Fix raw API error interpolation in `admin-config.tsx` [AGG-21/NEW-6]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:101,242`
**Severity:** MEDIUM
**Reviewers:** comprehensive-reviewer

**Problem:** The error value from the API response is stored in state and then interpolated into the `testFailed` template. If the API returns an English error string like `"connectionFailed_502"`, it appears verbatim alongside Korean template text.

**Plan:**
1. Map known API error codes to i18n keys before storing in `testResult`
2. Change the display to use the mapped i18n string directly instead of interpolating the raw error
3. Verify `next build` succeeds

**Progress:** [x] Committed as `b9f5e3cb`, pushed

---

### M2: Fix `files/[id]` GET route bare `.select()` — exclude `storedName` [AGG-13/SYS-23]

**File:** `src/app/api/v1/files/[id]/route.ts:71-74`
**Severity:** MEDIUM
**Reviewers:** comprehensive-reviewer

**Problem:** The GET route uses `db.select().from(files)` without specifying columns. `storedName` is a server-side filesystem path that shouldn't be in the query result even if not currently serialized.

**Plan:**
1. Replace `db.select().from(files)` with explicit column selection excluding `storedName`
2. Keep `storedName` in the DELETE route where it's needed for `deleteUploadedFile`
3. Verify `next build` succeeds

**Progress:** [x] Committed as `5407464f`, pushed

---

### L1: Fix `contest-join-client.tsx` unnecessary Error throw [AGG-22/NEW-7]

**File:** `src/app/(dashboard)/dashboard/contests/join/contest-join-client.tsx:48-51`
**Severity:** LOW
**Reviewers:** comprehensive-reviewer

**Problem:** Creates `throw new Error(errorMessage)` where `errorMessage` comes from an unsafe cast. The error is caught by the generic catch that shows `t("joinFailed")`, so the message is never displayed. The pattern is unnecessary and risky if the catch block is later changed.

**Plan:**
1. Replace the throw with inline error handling: `toast.error(t("joinFailed")); return;`
2. Remove the unsafe `(payload as { error?: string }).error` cast
3. Verify `next build` succeeds

**Progress:** [x] Committed as `b5d6be56`, pushed

---

## Deferred Findings (Not Implemented This Cycle)

| ID | Finding | File+Line | Severity / Confidence | Reason for Deferral |
|----|---------|-----------|----------------------|-------------------|
| AGG-2 | `.json()` before `response.ok` check — 30+ instances | Multiple files | HIGH / HIGH | Requires systematic migration of 30+ components to `apiFetchJson`. High surface area, risk of regressions. Should be done as a dedicated refactor pass. Exit criterion: dedicated migration cycle or incremental per-component migration. |
| AGG-3 | Raw API error strings shown to users — 7+ instances | Multiple files | HIGH / HIGH | Requires auditing all error display paths and establishing a project-wide `parseApiError` helper. Overlaps with AGG-2 migration. Exit criterion: `apiFetchJson` + `parseApiError` helper adopted. |
| AGG-8 | Missing AbortController on polling fetches | Multiple files | MEDIUM / HIGH | Partially addressed (CountdownTimer fixed). Remaining instances are in admin pages with low traffic. Exit criterion: audit of all `useEffect` fetch patterns. |
| AGG-9 | `as { error?: string }` pattern — 22 instances | Multiple files | MEDIUM / HIGH | Requires shared `parseApiError` helper. Overlaps with AGG-2/AGG-3 migration. Exit criterion: `parseApiError` helper created and adopted. |
| AGG-10 | Admin routes bypass `createApiHandler` — 8 routes | Multiple files | MEDIUM / MEDIUM | Requires migrating 8 routes to `createApiHandler`. High surface area, each route needs individual testing. Exit criterion: dedicated migration cycle. |
| AGG-12 | Recruiting validate endpoint allows token brute-force | `src/app/api/v1/recruiting/validate/route.ts` | MEDIUM / MEDIUM | Current rate limiting + SHA-256 hashing + uniform response mitigates the risk. Exit criterion: security audit explicitly flags it. |
| AGG-14 | Admin settings page exposes DB host/port | `src/app/(dashboard)/dashboard/admin/settings/` | MEDIUM / MEDIUM | Requires API change to redact connection string. Low operational impact. Exit criterion: next admin settings refactor. |
| AGG-15 | Missing error boundaries for contest/exam and chat widget | Multiple files | MEDIUM / MEDIUM | Requires adding ErrorBoundary components. Architectural decision on whether to use React error boundaries or Next.js error.tsx files. Exit criterion: dedicated UX resilience pass. |
| AGG-17 | Hardcoded English fallback strings in `throw new Error()` | `src/lib/plugins/chat-widget/providers.ts` | LOW / MEDIUM | Provider error messages are server-side only (logged, not displayed to users). Low priority. Exit criterion: i18n audit of server-side error messages. |
| AGG-18 | Hardcoded English strings in code editor title attributes | `src/components/code/` | LOW / HIGH | Requires finding and replacing all title attributes with i18n keys. Low priority. Exit criterion: i18n audit of code editor components. |
| AGG-19 | `formData.get()` cast assertions without null/type validation | Multiple files | LOW / MEDIUM | Client-side forms validate before submission; server-side routes have additional validation. Low risk. Exit criterion: API input validation audit. |

## Carried Deferred Items (from Prior Cycles)

All deferred items from prior cycle remediation plans remain unchanged. The active deferred items are tracked in:
- `.context/reviews/_aggregate-cycle-30.md` "Deferred Findings" table
- `.context/plans/open/2026-04-24-rpf-cycle-19-review-remediation.md` deferred section (CR19-D1, CR19-D2, CR19-D3)
- `.context/plans/open/2026-04-24-rpf-cycle-19-review-remediation.md` carried-forward items (AGG-1 through AGG-8 from cycle 18)
