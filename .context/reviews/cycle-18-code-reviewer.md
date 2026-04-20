# Cycle 18 Code Reviewer Findings

**Date:** 2026-04-19
**Reviewer:** Code quality, logic, SOLID, maintainability
**Base commit:** 7c1b65cc

---

## Findings

### F1: `getRecruitingAccessContext` is called repeatedly without caching — N+1 DB queries per page load

- **File**: `src/lib/recruiting/access.ts:14-66`, called from 15+ pages/routes
- **Severity**: MEDIUM
- **Confidence**: HIGH
- **Description**: `getRecruitingAccessContext()` queries `recruitingInvitations` and `assignmentProblems` on every call. It is invoked in at least 15 different page components and API routes, often alongside other data fetches. In the dashboard layout (`src/app/(dashboard)/layout.tsx:35`), it runs on every dashboard page load. Some pages (e.g., `contests/[assignmentId]/page.tsx`, `problems/[id]/page.tsx`) also call it independently in addition to the layout call, meaning the same user's recruiting context is fetched 2-3 times per page render.
- **Concrete failure scenario**: A student with recruiting access visits a contest page. The layout fetches their recruiting context. The contest page component fetches it again. The leaderboard route fetches it a third time. Three identical DB queries for the same data within one request.
- **Suggested fix**: Add a request-scoped cache (e.g., `cache()` from React or a per-request Map via `AsyncLocalStorage`) so `getRecruitingAccessContext` returns the same result within a single server render. Alternatively, pass the context down from the layout instead of re-fetching in each page.

### F2: `import-transfer.ts` `readStreamTextWithLimit` accumulates full body in memory before size check

- **File**: `src/lib/db/import-transfer.ts:8-25`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: The `readStreamTextWithLimit` function reads the entire stream into a `text` string variable, accumulating up to `MAX_IMPORT_BYTES` (100 MB) in memory as a JavaScript string. While the byte-length limit is checked per-chunk via `value.byteLength`, the accumulated `text` string uses 2 bytes per character for non-ASCII content, potentially consuming up to 200 MB of heap for a 100 MB upload with multi-byte characters. Additionally, the string concatenation `text += decoder.decode(...)` in a loop creates intermediate strings, adding GC pressure.
- **Concrete failure scenario**: An admin uploads a 90 MB JSON export file with heavy multi-byte content (e.g., Korean text in problem descriptions). The `text` variable grows to ~150 MB due to UTF-16 encoding. Combined with the subsequent `JSON.parse(text)` which creates another copy of the data, total heap usage spikes to ~300 MB, potentially causing OOM on a memory-constrained container.
- **Suggested fix**: For the `readUploadedJsonFileWithLimit` path, use `file.arrayBuffer()` first (which already checks `file.size`), then decode and parse. For the streaming path, consider using a streaming JSON parser or at minimum use array-buffer-based accumulation instead of string concatenation.

### F3: Admin migrate import route has duplicated password-verification and import logic between form-data and JSON paths

- **File**: `src/app/api/v1/admin/migrate/import/route.ts:38-111` (form-data) and `113-188` (JSON)
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: The import route has two nearly identical code paths: one for `multipart/form-data` uploads and one for JSON body uploads. Both paths perform the same password verification, export validation, audit event recording, and import execution. The only difference is how the request body is parsed. This violates DRY and increases the risk of the two paths diverging (e.g., one path gets a security fix but the other doesn't).
- **Concrete failure scenario**: A security fix is applied to the form-data path (e.g., adding a rate limit after password verification) but the JSON path is missed. The JSON path becomes a bypass for the rate limit.
- **Suggested fix**: Extract the common logic (password verification, export validation, import execution) into a shared helper function. Both paths call the helper after parsing the request body.

### F4: `contest-analytics.ts` student progression uses raw scores without late penalties — inconsistent with leaderboard

- **File**: `src/lib/assignments/contest-analytics.ts:234-276`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: The student progression chart computes scores using `rawScaledScore = score / 100 * points` without applying late penalties. The comment at line 234 acknowledges this: "A future enhancement could apply late penalties here for full consistency with the leaderboard." For IOI contests with late penalties, a student's progression total can exceed their leaderboard total, which is confusing.
- **Concrete failure scenario**: In an IOI contest with a 20% late penalty, a student's progression chart shows them reaching 500 points (raw score), but their leaderboard total shows 400 points (after penalty). The student is confused about why the two totals don't match.
- **Suggested fix**: Apply the same late penalty logic used in `contest-scoring.ts` (via `buildIoiLatePenaltyCaseExpr`) to the progression calculation. This can be done by computing adjusted scores in SQL rather than in JS.

---

## Verified Safe (No Issue)

### VS1: `recruiting-token.ts` correctly uses `AUTH_USER_COLUMNS` to restrict column selection
- **File**: `src/lib/auth/recruiting-token.ts:26-29`
- Previous cycle finding (AGG-4 from cycle 17) has been correctly fixed.

### VS2: `sign-out.ts` correctly clears all app localStorage prefixes
- **File**: `src/lib/auth/sign-out.ts:18-24`
- Previous cycle finding (AGG-1 from cycle 17) has been correctly fixed.

### VS3: `recruiting/validate/route.ts` correctly uses SQL NOW() for expiry/deadline checks
- **File**: `src/app/api/v1/recruiting/validate/route.ts:36-37,58-59`
- Previous cycle finding (AGG-3 from cycle 17) has been correctly fixed.

### VS4: `redeemRecruitingToken` correctly defaults to "alreadyRedeemed" on atomic claim failure
- **File**: `src/lib/assignments/recruiting-invitations.ts:506-518`
- Previous cycle finding (AGG-2 from cycle 17) has been correctly fixed.

### VS5: `validateShellCommand` correctly omits `\bexec\b` from denylist
- **File**: `src/lib/compiler/execute.ts:162`
- Previous cycle finding (AGG-5 from cycle 17) has been correctly fixed.

### VS6: SSE re-auth IIFE has proper `.catch()` for unhandled rejections
- **File**: `src/app/api/v1/submissions/[id]/events/route.ts:406-415`
- Previous cycle finding (AGG-6 from cycle 17) has been correctly fixed.

### VS7: SSE connection tracking uses O(1) `userConnectionCounts` map
- **File**: `src/app/api/v1/submissions/[id]/events/route.ts:29,58-73`
- Previous cycle finding (F5 from cycle-18 review) has been correctly implemented.

### VS8: `db/cleanup.ts` now uses canonical `DATA_RETENTION_DAYS` and respects `DATA_RETENTION_LEGAL_HOLD`
- **File**: `src/lib/db/cleanup.ts:4,28-31,33-34`
- Previous cycle findings (F1, F3 from cycle-18 review) have been correctly fixed.

### VS9: `change-password.ts` correctly explains why `needsRehash` is not handled
- **File**: `src/lib/actions/change-password.ts:50-53`
- The comment correctly explains that the user is about to set a new password anyway, so rehashing the current password provides no benefit. This is not a bug.
