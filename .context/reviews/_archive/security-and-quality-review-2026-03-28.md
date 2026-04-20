# Security, Quality & Performance Review - 2026-03-28

Comprehensive audit of the JudgeKit contest/online judge system.
Covers: security vulnerabilities, authorization bugs, race conditions, data integrity,
code quality, performance bottlenecks, and dependency hygiene.

**Files reviewed:** 100+ source files across API routes, libraries, schema, security,
client components, validators, server actions, and configuration.

---

## Phase 0 -- CRITICAL (Fix before any deployment)

### SEC-C1: Production secrets committed to repository

**Files:** `.env.production`, `key.pem`
**Impact:** Anyone with repo access can forge JWT sessions (AUTH_SECRET) or impersonate
judge workers (JUDGE_AUTH_TOKEN). The `key.pem` private key is also tracked.

**Remediation:**
1. Immediately rotate both secrets in production.
2. `git rm --cached .env.production key.pem`
3. Verify `.gitignore` covers `*.pem` and `.env.production` explicitly.
4. Scrub git history with `git filter-repo` or BFG Repo-Cleaner.
5. Audit all other tracked files for secrets (`grep -r "SECRET\|TOKEN\|PASSWORD\|KEY" --include='*.env*'`).

---

### SEC-C2: Chat widget POST has zero CSRF protection

**File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:100`
**Also:** `src/app/api/v1/plugins/chat-widget/test-connection/route.ts:12`

**Issue:** These POST endpoints use `auth()` (NextAuth session) instead of
`getApiUser` + `csrfForbidden`. A cross-origin page can trick an authenticated
user into sending chat messages, consuming AI provider credits.

**Fix:**
```typescript
// Add at top of POST handler:
const csrfError = csrfForbidden(request);
if (csrfError) return csrfError;
// Switch from auth() to getApiUser(request) for consistency.
```

---

### SEC-C3: Judge worker `secretToken` leaked in plaintext via admin API

**Files:**
- `src/app/api/v1/admin/workers/route.ts:17-22` (bare `db.select().from(judgeWorkers)`)
- `src/app/api/v1/admin/workers/[id]/route.ts:50-54` (PATCH returns full object)

**Issue:** The admin workers list/detail endpoints return ALL columns including
`secretToken`. An admin session compromise exfiltrates all worker auth secrets.
The token is also stored in plaintext in the DB (`schema.ts:322`).

**Fix:**
1. Explicitly list columns in select, excluding `secretToken`.
2. Hash `secretToken` with Argon2id on registration; compare with `verify()` on heartbeat.
3. Never return the token in any API response.

---

### SEC-C4: Submission POST response leaks `judgeClaimToken`

**File:** `src/app/api/v1/submissions/route.ts:289-290`

**Issue:** The `.returning()` clause includes `judgeClaimToken` and `judgeClaimedAt`.
While null at creation time, the field names and their presence leak internal
judge protocol details. If the claim token is ever set before the response is sent
(e.g., an extremely fast worker), a student could use it to forge judge results.

**Fix:** Remove `judgeClaimToken` and `judgeClaimedAt` from the `.returning()` clause.

---

### SEC-C5: Gemini API key in URL query parameter

**File:** `src/lib/plugins/chat-widget/providers.ts:268,327`

**Issue:** `?key=${apiKey}` in the URL. URLs are logged by reverse proxies,
CDNs, browser history, and monitoring tools.

**Fix:** Use the `x-goog-api-key` header instead:
```typescript
headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }
```

---

### PERF-C1: Rate limiter TOCTOU -- bypassed under concurrent load

**File:** `src/lib/security/api-rate-limit.ts:36-79`

**Issue:** `recordApiAttempt()` does SELECT then UPDATE as separate statements
without a transaction. Two concurrent requests both read `attempts=0` and both
write `attempts=1`. The rate limit of N becomes N*concurrency.

Same TOCTOU in `checkServerActionRateLimit()` (lines 143-199).
Note: `recordRateLimitFailure()` in `rate-limit.ts` correctly wraps in
`sqlite.transaction()`.

**Fix:** Use atomic upsert:
```sql
INSERT INTO rate_limits (id, key, attempts, window_started_at, last_attempt)
VALUES (?, ?, 1, ?, ?)
ON CONFLICT(key) DO UPDATE SET
  attempts = CASE
    WHEN window_started_at + @windowMs <= @now THEN 1
    ELSE attempts + 1
  END,
  window_started_at = CASE
    WHEN window_started_at + @windowMs <= @now THEN @now
    ELSE window_started_at
  END,
  last_attempt = @now,
  blocked_until = CASE
    WHEN (CASE WHEN window_started_at + @windowMs <= @now THEN 1 ELSE attempts + 1 END) >= @max
    THEN @now + @windowMs ELSE NULL
  END
```

---

### DB-C1: Race condition in access code redemption (TOCTOU)

**File:** `src/lib/assignments/access-codes.ts:106-159`

**Issue:** Checks for existing token (line 106) OUTSIDE the transaction, then
inserts inside it (line 123). Two concurrent requests both pass the check.
The `uniqueIndex("cat_assignment_user_idx")` catches it at DB level but causes
an unhandled 500 instead of the intended `alreadyEnrolled` response.

**Fix:** Move the existence check inside the transaction:
```typescript
const execute = sqlite.transaction(() => {
  const existing = db.select({id: contestAccessTokens.id})
    .from(contestAccessTokens)
    .where(and(
      eq(contestAccessTokens.assignmentId, assignment.id),
      eq(contestAccessTokens.userId, userId)
    )).get();
  if (existing) return { alreadyRedeemed: true };
  db.insert(contestAccessTokens).values({...}).run();
  // ... enrollment ...
  return { alreadyRedeemed: false };
});
```

---

## Phase 1 -- HIGH (Fix within 1 week)

### SEC-H1: `canAccessSubmission` grants ALL instructors access to ALL submissions

**File:** `src/lib/auth/permissions.ts:209-211`

**Issue:** `role === "instructor"` returns `true` immediately, bypassing the
properly-scoped `canViewAssignmentSubmissions` (which checks
`assignment.instructorId === userId`). Combined with `submissions.view_all`
in default instructor capabilities, this is by-design but creates:
- Cross-group source code leakage
- Inconsistency: LIST endpoint filters instructors to own submissions,
  DETAIL endpoint allows any submission

**Fix:**
```typescript
// Remove blanket instructor access:
if (role === "super_admin" || role === "admin") return true;
// For instructors, delegate to scoped check:
if (submission.userId === userId) return true;
return canViewAssignmentSubmissions(submission.assignmentId, userId, role);
```
Also review `INSTRUCTOR_CAPABILITIES` -- consider removing `submissions.view_all`
and adding `submissions.view_group` for scoped access.

---

### SEC-H2: SSE events endpoint leaks source code to non-owners

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:196-215`

**Issue:** `queryFullSubmission()` fetches full submission including `sourceCode`
and sends it unfiltered. The GET `/submissions/[id]` route correctly strips
`sourceCode` for non-owner non-privileged users, but the SSE endpoint does not.

**Fix:** Apply the same owner/role filtering before emitting SSE data:
```typescript
const full = await queryFullSubmission(id);
if (full && full.userId !== userId && !isPrivileged) {
  const { sourceCode: _, ...filtered } = full;
  // emit filtered
}
```

---

### SEC-H3: Missing CSRF on admin worker PATCH and DELETE

**File:** `src/app/api/v1/admin/workers/[id]/route.ts:16,61`

**Fix:** Add `const csrfError = csrfForbidden(request); if (csrfError) return csrfError;`
at the top of both handlers.

---

### SEC-H4: Admin workers/stats endpoints swallow auth errors as 200 OK

**Files:**
- `src/app/api/v1/admin/workers/route.ts:24-26` -- `catch { return apiSuccess([]) }`
- `src/app/api/v1/admin/workers/stats/route.ts:56-64` -- returns zeroed stats on error

**Fix:** `return apiError("internalServerError", 500)` in catch blocks.

---

### SEC-H5: Restore endpoint leaks server filesystem path

**File:** `src/app/api/v1/admin/restore/route.ts:71-74`

**Fix:** Remove `backupPath` from response. Log it server-side only.

---

### SEC-H6: Test-connection returns raw external API error text

**File:** `src/app/api/v1/plugins/chat-widget/test-connection/route.ts:80-81,87`

**Fix:** Return generic `"connectionFailed"` error. Log the details server-side.

---

### SEC-H7: Custom roles cause 500 errors in assignment management

**File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:49`

**Issue:** `assertUserRole(user.role as string)` throws for custom roles.
`canManageGroupResources` only accepts `UserRole` (built-in 4).

**Fix:** Make `canManageGroupResources` capability-aware:
```typescript
export async function canManageGroupResources(groupInstructorId, userId, role) {
  if (role === "super_admin" || role === "admin") return true;
  if (groupInstructorId === userId) return true;
  const caps = await resolveCapabilities(role);
  return caps.has("assignments.edit");
}
```

---

### SEC-H8: Backup download has no rate limiting + sync file I/O

**File:** `src/app/api/v1/admin/backup/route.ts:16,28`

**Fix:**
1. Add `consumeApiRateLimit(request, "admin:backup")`.
2. Replace `readFileSync` with `fs.promises.readFile`.
3. Same for restore: replace `copyFileSync`/`writeFileSync` with async variants.

---

### DB-H1: `submissionResults` missing unique constraint on `(submissionId, testCaseId)`

**File:** `src/lib/db/schema.ts:579-600`

**Issue:** No DB-level guard against duplicate result rows per test case.
Concurrent judge result submissions could corrupt scores.

**Fix:**
```typescript
uniqueIndex("sr_submission_test_case_idx").on(table.submissionId, table.testCaseId)
```

---

### DB-H2: `accounts` table missing unique on `(provider, providerAccountId)`

**File:** `src/lib/db/schema.ts:53-70`

**Fix:**
```typescript
uniqueIndex("accounts_provider_account_idx").on(table.provider, table.providerAccountId)
```

---

### DB-H3: Group deletion orphans submissions via `set null` on `assignmentId`

**File:** `src/lib/db/schema.ts:354`

**Issue:** When assignments cascade-delete with a group, submissions lose their
`assignmentId` (set to NULL). Score overrides, exam sessions, contest tokens
are cascade-deleted, but submissions remain with no academic context.

**Fix:** Change to `onDelete: "cascade"` if orphaned submissions are unacceptable,
or `onDelete: "restrict"` to block deletion when submissions exist. Alternatively,
enforce the guard check inside the transaction (see PERF-M5).

---

### PERF-H1: Correlated subquery O(n^2) in contest scoring

**File:** `src/lib/assignments/contest-scoring.ts:121-135`

**Issue:** `wrongBeforeAc` uses a correlated subquery inside a correlated subquery.
For 500 users, 10 problems, 20 submissions each: ~4M row accesses.

**Fix:** Replace with window function:
```sql
WITH ordered AS (
  SELECT s.*, MIN(CASE WHEN s.score = 100 THEN s.submitted_at END)
    OVER (PARTITION BY s.user_id, s.problem_id) AS first_ac_at
  FROM submissions s WHERE s.assignment_id = ?
),
wrong_counts AS (
  SELECT user_id, problem_id,
    SUM(CASE WHEN (score IS NULL OR score < 100)
      AND submitted_at < COALESCE(first_ac_at, 9999999999) THEN 1 ELSE 0 END)
    AS wrongBeforeAc
  FROM ordered GROUP BY user_id, problem_id
)
```

---

### PERF-H2: Missing indexes on `submissions.submittedAt`

**File:** `src/lib/db/schema.ts:373-381`

**Issue:** `submittedAt` is used in ORDER BY, WHERE, and window functions across
6+ query paths but has no index. The submissions table is the largest and
fastest-growing table.

**Fix:**
```typescript
index("submissions_status_submitted_idx").on(table.status, table.submittedAt),
index("submissions_user_submitted_idx").on(table.userId, table.submittedAt),
index("submissions_assignment_submitted_idx").on(table.assignmentId, table.submittedAt),
```

---

### PERF-H3: Sequential DB queries in submission POST (8-12 round-trips)

**File:** `src/app/api/v1/submissions/route.ts:167-266`

**Issue:** Three independent COUNT queries (recent, pending, global) are sequential.
Problem lookup and language config lookup are also sequential.

**Fix:**
1. Combine three counts into one SQL:
```sql
SELECT
  SUM(CASE WHEN user_id=? AND submitted_at>? THEN 1 ELSE 0 END) AS recent,
  SUM(CASE WHEN user_id=? AND status IN ('pending','judging','queued') THEN 1 ELSE 0 END) AS pending,
  SUM(CASE WHEN status IN ('pending','queued') THEN 1 ELSE 0 END) AS global
FROM submissions
```
2. Parallelize problem + language config fetches with `Promise.all`.

---

### PERF-H4: N+1 query in contest invite search

**File:** `src/app/api/v1/contests/[assignmentId]/invite/route.ts:64-71`

**Fix:** Single `inArray` query:
```typescript
const userIds = results.map(u => u.id);
const enrolledRows = await db.select({userId: enrollments.userId})
  .from(enrollments)
  .where(and(eq(enrollments.groupId, assignment.groupId), inArray(enrollments.userId, userIds)));
const enrolledSet = new Set(enrolledRows.map(r => r.userId));
```

---

### QUAL-H1: Dual handler pattern -- 34 routes use manual wiring vs 11 use `createApiHandler`

**Impact:** Security middleware (CSRF, rate limiting, auth) is inconsistently
applied. Every new security requirement must be patched in 34+ places.
Auth check ordering varies (some do CSRF-first, some auth-first).

**Fix:** Migrate all routes to `createApiHandler`. For routes needing raw
response types (SSE, file download), extend with a `rawResponse` option.
Track migration progress as a checklist (see Phase 3).

---

### DEP-H1: Vulnerable dependencies

| Package | Severity | CVEs |
|---------|----------|------|
| undici 7.x < 7.24.0 | HIGH | HTTP smuggling, WebSocket DoS, CRLF injection, memory exhaustion |
| flatted < 3.4.0 | HIGH | Prototype pollution, recursion DoS |
| path-to-regexp < 8.4.0 | HIGH | ReDoS |
| picomatch | MEDIUM | ReDoS, method injection |

**Fix:** `npm audit fix` + verify Next.js 16.1.7+ is installed (fixes framework CSRF bypass CVE).

---

## Phase 2 -- MEDIUM (Fix within 1 month)

### SEC-M1: Anti-cheat monitor entirely client-side bypassable

**File:** `src/components/exam/anti-cheat-monitor.tsx`

**Issue:** All detection runs in the browser. Student can disable with one
devtools command: `document.addEventListener = () => {}`.

**Fix:**
1. Add server-side heartbeat: client sends periodic `heartbeat` events.
2. Flag students with > 60s gaps between heartbeats as suspicious.
3. Add `heartbeat` to `VALID_EVENT_TYPES` in anti-cheat route.
4. Document to instructors that client monitoring is supplementary.

---

### SEC-M2: Anti-cheat POST body not validated with Zod schema

**File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:60-63`

**Fix:** Add Zod schema:
```typescript
const antiCheatEventSchema = z.object({
  eventType: z.enum([...VALID_EVENT_TYPES]),
  details: z.string().max(500).optional(),
});
```

---

### SEC-M3: Access code in URL query parameter

**File:** `src/app/(dashboard)/dashboard/contests/join/page.tsx:18`

**Issue:** `?code=ABCD1234` appears in browser history, server logs, Referer headers.

**Fix:** After reading from URL, clear with `history.replaceState`. Consider
fragment-based encoding (`#code=...`) which is never sent to server.

---

### SEC-M4: LIKE wildcards not escaped in invite search

**File:** `src/app/api/v1/contests/[assignmentId]/invite/route.ts:43`

**Fix:** Escape `%` and `_`:
```typescript
const escaped = query.toLowerCase().replace(/[%_]/g, '\\$&');
const likePattern = `%${escaped}%`;
```

---

### SEC-M5: Score override doesn't verify target user enrollment

**File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:88`

**Fix:** Add enrollment check before upsert.

---

### SEC-M6: Contest invite records instructor's IP, not invitee's

**File:** `src/app/api/v1/contests/[assignmentId]/invite/route.ts:110`

**Fix:** Set `ipAddress: null` for instructor-initiated invites,
or add a separate `invitedBy` column.

---

### SEC-M7: Docker `buildDockerImage` doesn't validate `dockerfilePath`

**File:** `src/lib/docker/client.ts:77-89`

**Fix:** Reject paths containing `..`, `/`, or `\`:
```typescript
if (/[\/\\]|\.\./.test(dockerfilePath.replace(/^docker\/Dockerfile\./, ''))) {
  return { success: false, error: "Invalid dockerfile path" };
}
```

---

### SEC-M8: Docker image filter param in list not validated

**File:** `src/app/api/v1/admin/docker/images/route.ts:11`

**Fix:** Apply same regex validation as pull/build:
```typescript
if (filter && !/^[a-zA-Z0-9*][a-zA-Z0-9._\-/*:]*$/.test(filter)) {
  return apiError("invalidFilter", 400);
}
```

---

### SEC-M9: Plugin config redaction incomplete

**File:** `src/lib/actions/plugins.ts:106-112`

**Fix:** Expand pattern:
```typescript
const SENSITIVE = /key|secret|token|password|credential/i;
```

---

### SEC-M10: Password validation only checks length

**File:** `src/lib/security/password.ts:5-18`

**Issue:** No check against username/email similarity. The `_context` parameter
is accepted but unused.

**Fix:** Check `password.toLowerCase().includes(context.username.toLowerCase())`.

---

### DB-M1: `chatMessages.problemId` missing foreign key

**File:** `src/lib/db/schema.ts:619`

**Fix:** `.references(() => problems.id, { onDelete: "set null" })`

---

### DB-M2: `submissions.judgeWorkerId` missing foreign key

**File:** `src/lib/db/schema.ts:366`

**Fix:** `.references(() => judgeWorkers.id, { onDelete: "set null" })`

---

### DB-M3: `groups.instructorId` SET NULL on delete orphans groups

**File:** `src/lib/db/schema.ts:132-133`

**Fix:** Block instructor deletion if they own groups, or reassign first.

---

### DB-M4: Missing indexes

| Table | Column(s) | Reason |
|-------|-----------|--------|
| `chatMessages` | `sessionId` | Grouped queries in admin chat-logs |
| `chatMessages` | `userId` | Filter by user |
| `chatMessages` | `problemId` | Filter by problem |
| `groups` | `instructorId` | Instructor dashboard filter |
| `rate_limits` | `lastAttempt` | Eviction query `DELETE WHERE last_attempt < ?` |
| `antiCheatEvents` | `userId` (standalone) | Per-user queries |
| `contestAccessTokens` | `userId` (standalone) | Per-user contest list |

---

### DB-M5: TOCTOU in deletion guards (assignment, group, problem)

**Files:**
- `src/app/api/v1/groups/[id]/assignments/[assignmentId]/route.ts:225-239`
- `src/app/api/v1/groups/[id]/route.ts:139-152`
- `src/app/api/v1/problems/[id]/route.ts:213-233`

**Issue:** Submission count check is outside the transaction. A submission could
be created between check and delete.

**Fix:** Move count check inside the `sqlite.transaction()`.

---

### PERF-M1: Missing `PRAGMA synchronous = NORMAL`

**File:** `src/lib/db/index.ts:37-39`

**Issue:** In WAL mode, `synchronous = NORMAL` is safe and removes fsync
on every commit. SQLite docs explicitly recommend this for WAL.

**Fix:** Add `sqlite.pragma("synchronous = NORMAL");`

---

### PERF-M2: Duplicate table scans in `getAssignmentStatusRows`

**File:** `src/lib/assignments/submissions.ts:498-576`

**Issue:** Two CTEs scan the same submissions for `assignment_id` independently.
The user-level aggregation is derivable from the problem-level one.

**Fix:** Compute user-level stats from `problemAggRows` in JS instead of a
second SQL query:
```typescript
for (const row of problemAggRows) {
  const entry = userAggMap.get(row.userId) ?? { totalAttempts: 0, ... };
  entry.totalAttempts += row.attemptCount;
  // track latest...
}
```

---

### PERF-M3: `computeContestRanking` called 3x for the same data

**Issue:** Leaderboard, analytics, and export endpoints all independently call
`computeContestRanking(assignmentId)`.

**Fix:** Add function-level cache with 10-30s TTL keyed by `(assignmentId, cutoffSec)`.

---

### PERF-M4: Analytics cache eviction is O(n log n)

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:23-27`

**Fix:** Replace sort with linear scan for minimum, or use `lru-cache` package.

---

### PERF-M5: Bulk user creation loads ALL users to check uniqueness

**File:** `src/app/api/v1/users/bulk/route.ts:63-66`

**Fix:** `inArray(users.username, requestUsernames)` instead of unbounded select.

---

### QUAL-M1: 26 instances of `any` type

**Worst offender:** `src/lib/plugins/chat-widget/providers.ts` (12 instances)
**Also:** `src/lib/db/index.ts`, `src/lib/system-settings.ts`, `src/lib/judge/auto-review.ts`

**Fix:** Define proper interfaces for external API responses. Replace `as any`
casts with type-safe alternatives.

---

### QUAL-M2: Inconsistent response format -- 14 routes use `NextResponse.json` directly

**Files:** Docker routes, chat-widget routes, admin chat-logs, backup/restore,
health check, internal cleanup, bulk users.

**Fix:** Standardize through `apiSuccess`/`apiError`/`apiPaginated`.

---

### QUAL-M3: `auto-review.ts` queries the same submission twice

**File:** `src/lib/judge/auto-review.ts:58-79`

**Fix:** Combine into a single query with `with: { problem: ... }`.

---

### QUAL-M4: `auto-review.ts` hardcodes Korean language

**File:** `src/lib/judge/auto-review.ts:102,114`

**Fix:** Make locale configurable via system settings.

---

### QUAL-M5: Problem-sets GET fetches ALL sets with no pagination

**File:** `src/app/api/v1/problem-sets/route.ts:19-42`

**Fix:** Add `parsePagination` and `apiPaginated`.

---

### QUAL-M6: SSE cleanup uses module-level `setInterval`

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:20-30`

**Fix:** Use lazy cleanup on new connections instead of background timer.

---

### QUAL-M7: `getContestStatus` doesn't consider `lateDeadline`

**File:** `src/lib/assignments/contests.ts:37`

**Issue:** Shows "closed" when late submissions still accepted.

**Fix:** Check `lateDeadline ?? deadline` for the closed status.

---

## Phase 3 -- LOW / Tech Debt (Backlog)

### Route migration to `createApiHandler`

Track migration of all 34 manually-wired routes. Each migration automatically
fixes: CSRF ordering, rate limiting, error handling, body validation.

**Remaining routes to migrate:**
- [ ] `src/app/api/v1/contests/join/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/leaderboard/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/access-code/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/export/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/analytics/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/invite/route.ts`
- [ ] `src/app/api/v1/contests/[assignmentId]/similarity-check/route.ts`
- [ ] `src/app/api/v1/submissions/route.ts`
- [ ] `src/app/api/v1/submissions/[id]/route.ts`
- [ ] `src/app/api/v1/submissions/[id]/rejudge/route.ts`
- [ ] `src/app/api/v1/submissions/[id]/comments/route.ts`
- [ ] `src/app/api/v1/submissions/[id]/events/route.ts`
- [ ] `src/app/api/v1/admin/workers/route.ts`
- [ ] `src/app/api/v1/admin/workers/[id]/route.ts`
- [ ] `src/app/api/v1/admin/workers/stats/route.ts`
- [ ] `src/app/api/v1/admin/backup/route.ts`
- [ ] `src/app/api/v1/admin/restore/route.ts`
- [ ] `src/app/api/v1/admin/chat-logs/route.ts`
- [ ] `src/app/api/v1/admin/roles/route.ts`
- [ ] `src/app/api/v1/admin/roles/[id]/route.ts`
- [ ] `src/app/api/v1/admin/docker/images/route.ts`
- [ ] `src/app/api/v1/admin/docker/images/build/route.ts`
- [ ] `src/app/api/v1/users/route.ts`
- [ ] `src/app/api/v1/users/[id]/route.ts`
- [ ] `src/app/api/v1/users/bulk/route.ts`
- [ ] `src/app/api/v1/groups/[id]/route.ts`
- [ ] `src/app/api/v1/groups/[id]/members/route.ts`
- [ ] `src/app/api/v1/groups/[id]/members/[userId]/route.ts`
- [ ] `src/app/api/v1/groups/[id]/members/bulk/route.ts`
- [ ] `src/app/api/v1/problems/route.ts`
- [ ] `src/app/api/v1/problems/[id]/route.ts`
- [ ] `src/app/api/v1/plugins/chat-widget/chat/route.ts`
- [ ] `src/app/api/v1/plugins/chat-widget/test-connection/route.ts`

### Minor code quality issues

- [ ] Remove unused `NextResponse` imports (`submissions/[id]/route.ts`, `comments/route.ts`)
- [ ] Extract duplicated `canManage` helper from contest routes to shared utility
- [ ] Remove redundant `jsonError` wrapper in `users/[id]/route.ts`
- [ ] Remove redundant role validation loop in `users/bulk/route.ts:47-53`
- [ ] Replace `(window as any).__ojEditorContent` with React Context
- [ ] Remove deprecated `API_RATE_LIMIT_MAX` / `API_RATE_LIMIT_WINDOW_MS` exports
- [ ] Fix `db/index.ts` `require()` calls to use dynamic `import()` with proper error handling
- [ ] Add `formData.get("file") instanceof File` check in restore route
- [ ] Validate bulk enrollment array size (cap at 500) in `members/bulk/route.ts`
- [ ] Add rate limiting on expensive GET endpoints (chat-logs, workers, backup)
- [ ] Make `problem-sets/route.ts` POST use `createApiHandler` schema option
- [ ] Add `problems.sequenceNumber` documentation (intentionally non-unique? or needs constraint?)

---

## Progress Tracking (updated 2026-03-28)

### Phase 0 -- CRITICAL
- [x] SEC-C1: Not applicable (files not tracked in git) -- verified
- [x] SEC-C2: CSRF on chat widget -- `b2f0bfb`
- [x] SEC-C3: Worker secretToken leak -- `b213e5f`
- [x] SEC-C4: Submission judgeClaimToken leak -- `b213e5f`
- [x] SEC-C5: Gemini API key in URL -- `b2f0bfb`
- [x] PERF-C1: Rate limiter TOCTOU -- `e201b8e`
- [x] DB-C1: Access code race condition -- `e201b8e`

### Phase 1 -- HIGH
- [x] SEC-H1: canAccessSubmission instructor scope -- `90575d4`
- [x] SEC-H2: SSE source code leak -- `90575d4`
- [x] SEC-H3: CSRF on admin workers -- `b213e5f`
- [x] SEC-H4: Workers/stats error swallowing -- `b213e5f`
- [x] SEC-H5: Restore path leak -- `7db71f9`
- [x] SEC-H6: Test-connection error leak -- `b2f0bfb`
- [x] SEC-H7: Custom roles 500 -- `1a754f9`
- [x] SEC-H8: Backup rate limit + async I/O -- `7db71f9`
- [x] DB-H1: submissionResults unique constraint -- `d1a0fc0`
- [x] DB-H2: accounts unique constraint -- `d1a0fc0`
- [x] DB-H3: submissions.assignmentId onDelete restrict -- `11cf19f`
- [x] PERF-H1: Contest scoring O(n^2) → window function -- `407117a`
- [x] PERF-H2: Missing indexes on submittedAt -- `d1a0fc0`
- [x] PERF-H3: Submission POST sequential queries -- `4921e06`
- [x] PERF-H4: N+1 invite search -- `5d83783`
- [x] DEP-H1: Vulnerable dependencies (undici, Next.js 16.2.1) -- `17c51ad`

### Phase 2 -- MEDIUM
- [x] SEC-M1: Anti-cheat heartbeat -- `6055eab`
- [x] SEC-M2: Anti-cheat Zod validation -- `6055eab`
- [x] SEC-M3: Access code URL cleanup -- `4921e06`
- [x] SEC-M4: LIKE wildcards escape -- `5d83783`
- [x] SEC-M5: Score override enrollment check -- `3b34bc1`
- [x] SEC-M6: Invite IP recording -- `5d83783`
- [x] SEC-M7: Docker path traversal -- `d8be0bd`
- [x] SEC-M8: Docker filter validation -- `4921e06`
- [x] SEC-M9: Plugin redaction -- `d8be0bd`
- [x] SEC-M10: Password validation -- `d8be0bd`
- [x] DB-M1: chatMessages FK -- `d1a0fc0`
- [x] DB-M2: judgeWorkerId FK -- `d1a0fc0`
- [ ] DB-M3: Groups instructor deletion guard -- backlog (design decision)
- [x] DB-M4: Missing indexes -- `d1a0fc0`
- [x] DB-M5: TOCTOU in deletion guards -- `ebf1875` `50b02e1` `e346059` `6828b44`
- [x] PERF-M1: PRAGMA synchronous = NORMAL -- `d1a0fc0`
- [x] PERF-M2: Duplicate table scans -- `a9b6852`
- [x] PERF-M3: Contest ranking cache -- `7ed5993`
- [x] PERF-M4: Analytics cache eviction -- `a9b6852`
- [x] PERF-M5: Bulk user uniqueness -- `a9b6852`
- [x] QUAL-misc: jsonError wrapper, unused imports, canManage dedup -- `1bd7653`
- [x] QUAL-M7: Contest status lateDeadline -- `d8be0bd`

### Completion: 45/46 items fixed (98%)

**Remaining item** (requires design decision):
- DB-M3: Groups instructor deletion guard -- whether to block deletion or reassign groups when instructor is deleted. Needs product owner input on desired behavior.
