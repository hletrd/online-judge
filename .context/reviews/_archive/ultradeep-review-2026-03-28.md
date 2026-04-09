# Ultra-Deep Security & Quality Review -- 2026-03-28

Second-pass audit following the initial review (45/46 items fixed).
Covers: new auth/logic flaws, race conditions, performance/DoS, client-side
integrity, type safety, scoring edge cases, and data leakage paths.

**Agents deployed:** Security (auth/logic/race), Performance (memory/CPU/DoS),
Code Quality (types/errors/scoring), Client-Side (contest integrity/leakage).
**Files reviewed:** 120+ source files across all layers.

---

## Severity Legend

| Tag | Meaning | SLA |
|-----|---------|-----|
| **SECn** | Security vulnerability | by severity |
| **PERFn** | Performance / scalability | by severity |
| **QUALn** | Code quality / correctness | by severity |
| **CLIENTn** | Client-side / contest integrity | by severity |

---

## Phase 0 -- CRITICAL (Block deployment)

### SEC-C1: Score override accepts arbitrary `problemId` -- no assignment membership check

**File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:86-121`

The POST handler validates user enrollment but **never validates that
`problemId` belongs to the target assignment**. An instructor can inject
a fabricated score for any problem into any assignment they manage.
`overrideScore` has no upper bound (Zod schema is `z.number().int().min(0)`).

`getAssignmentStatusRows` reads overrides keyed by `(assignmentId, userId, problemId)`,
so an override for a problem that _does_ exist in the assignment but was never
attempted silently injects a fabricated score into the status board and leaderboard.

**Fix:**
```typescript
const assignmentProblem = await db.query.assignmentProblems.findFirst({
  where: and(
    eq(assignmentProblems.assignmentId, assignment.id),
    eq(assignmentProblems.problemId, problemId)
  ),
  columns: { id: true, points: true },
});
if (!assignmentProblem) return apiError("problemNotInAssignment", 400);
if (overrideScore > (assignmentProblem.points ?? 100))
  return apiError("overrideScoreExceedsMax", 400);
```

---

### SEC-C2: Custom roles bypass all hardcoded `isAdmin`/`isInstructor` checks -- capability system non-functional

**Files:** `src/lib/api/auth.ts:90-91,107-108`, `src/lib/assignments/management.ts:23-31`,
`src/app/api/v1/submissions/[id]/route.ts:58`, many others

The sync `isAdmin()` and `isInstructor()` use `ROLE_LEVEL` which maps only the
4 built-in role strings. Custom roles always get level `-1` and fail every check.
The capability system (`resolveCapabilities`) was designed to grant those
permissions, but the vast majority of route handlers use the sync level-based
check, **not** the async capability-based check. The two authorization systems
are inconsistent.

**Impact:** A custom role with admin-equivalent capabilities is denied access to
admin endpoints. Worse, if `canManageGroupResources` (sync) returns false but
`canManageGroupResourcesAsync` returns true, the behavior diverges depending on
which function the caller chose. Any developer creating custom roles for TAs
will find them non-functional.

**Fix:** Either (a) migrate all sync role checks to async capability checks, or
(b) document and enforce that custom roles do NOT grant API access and add a
guard in the role-creation UI warning admins.

---

### PERF-C1: Backup reads live SQLite file without WAL checkpoint -- corrupt/incomplete backup

**File:** `src/app/api/v1/admin/backup/route.ts:33`

```typescript
const fileBuffer = await fs.readFile(dbPath);
```

In WAL mode, committed transactions may exist only in the `-wal` file and not
yet checkpointed into the main file. `fs.readFile` reads only the main file.
The downloaded backup is missing recent data and may be internally inconsistent
if a write occurs during the read.

**Fix:**
```typescript
const backupPath = path.join(os.tmpdir(), `judgekit-backup-${Date.now()}.sqlite`);
await sqlite.backup(backupPath);          // atomic, WAL-consistent
const stream = fs.createReadStream(backupPath);
// stream to response, then unlink
```

---

### PERF-C2: Restore overwrites live DB file without closing connection -- corruption

**File:** `src/app/api/v1/admin/restore/route.ts:59`

```typescript
await fs.writeFile(dbPath, buffer);
```

The `better-sqlite3` singleton holds the old file open via mmap. Overwriting
the file corrupts the active connection. Orphaned WAL/SHM files from the old DB
apply to the new file on next open, compounding corruption.

**Fix:** Close the sqlite connection before writing, delete WAL/SHM files, write
the new file, then force a process restart (or call `process.exit(0)`).

---

### PERF-C3: Argon2 concurrent memory explosion in bulk user creation

**File:** `src/lib/security/password-hash.ts:4-9`, `src/app/api/v1/users/bulk/route.ts:95-115`

Bulk user import runs `hashPassword` in `Promise.all` for up to 200 users.
Each Argon2id hash allocates **19 MiB**. All 200 promises are created
simultaneously: `200 * 19 MiB = 3.8 GB` peak transient memory. The libuv
thread pool (default 4 threads) queues them, but memory is allocated eagerly.

During contest-start login storms (50 concurrent logins), `verifyPassword`
consumes `50 * 19 MiB = 950 MiB` and saturates the thread pool for ~25 seconds,
starving all other native async I/O.

**Fix:**
```typescript
import pLimit from 'p-limit';
const limit = pLimit(4); // match libuv thread pool
const entries = await Promise.all(
  items.map(item => limit(async () => ({
    ...item,
    passwordHash: await hashPassword(generateSecurePassword()),
  })))
);
```

---

## Phase 1 -- HIGH (Fix within 1 week)

### SEC-H1: Instructor can modify assignment problems during active contest

**File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/route.ts:82-97`

The PATCH handler blocks problem changes only when `hasExistingSubmissions`
is true. An instructor can swap problems in an active contest **before the
first submission arrives** (between `startsAt` and first student submit).
Additionally, new problems can be added to active contests after submissions
exist (the guard only blocks changes to existing problem mappings, not additions).

**Fix:** Block problem changes when `startsAt` has passed and `deadline` hasn't:
```typescript
if (body.problems !== undefined && assignment.examMode !== "none") {
  const now = Date.now();
  if (assignment.startsAt && now >= new Date(assignment.startsAt).getTime())
    return apiError("contestProblemsLockedDuringActive", 409);
}
```

---

### SEC-H2: `isPrivileged` uses hardcoded role strings, ignoring capabilities -- source code leak/denial

**Files:** `src/app/api/v1/submissions/[id]/route.ts:58`, `src/app/api/v1/submissions/[id]/events/route.ts:72`

```typescript
const isPrivileged = user.role === "admin" || user.role === "super_admin" || user.role === "instructor";
```

Custom roles with `submissions.view_source` capability are denied source code.
Custom roles with `submissions.view_all` but NOT `submissions.view_source`
would still pass `canAccessSubmission` but have source code stripped -- which is
correct behavior but for the wrong reason (string check, not capability check).

**Fix:** `const canViewSource = (await resolveCapabilities(user.role)).has("submissions.view_source");`

---

### SEC-H3: `canViewAssignmentSubmissions` hardcodes role check, ignoring capabilities

**File:** `src/lib/assignments/submissions.ts:274-298`

```typescript
if (!isAdmin(role) && role !== "instructor") return false;
```

Custom roles with `submissions.view_all` or `assignments.view_status` are
completely locked out. Since `canAccessSubmission` delegates to this function,
the capability system is bypassed for assignment-scoped submission viewing.

**Fix:** Add capability fallback:
```typescript
const caps = await resolveCapabilities(role);
if (!isAdmin(role) && !caps.has("submissions.view_all")) return false;
```

---

### SEC-H4: Submission rate limit is non-atomic (TOCTOU) -- bypassable under concurrent load

**File:** `src/app/api/v1/submissions/route.ts:166-197`

The rate limit counts (recentCount, pendingCount, globalPending) are read in
a SELECT, then the submission is INSERTed in a separate statement. Concurrent
requests all read the same counts and all pass, effectively multiplying the
rate limit by the concurrency factor.

**Fix:** Wrap count-check + insert in `sqlite.transaction()`, or use an atomic
`INSERT...WHERE (SELECT COUNT(*) ...) < ?` pattern.

---

### SEC-H5: Exam `personalDeadline` not enforced at INSERT time -- race window

**File:** `src/lib/assignments/submissions.ts:233-245`, `src/app/api/v1/submissions/route.ts:255`

The deadline check (`personalDeadline < Date.now()`) and the INSERT are
separated by multiple `await` points (canAccessProblem, problem lookup,
language config). A student whose deadline expires at time T can fire a request
at T-1ms; by the time INSERT runs at T+50ms, the deadline has passed.

**Fix:** Enforce at INSERT time with a WHERE subquery:
```sql
INSERT INTO submissions (...) SELECT ...
WHERE NOT EXISTS (
  SELECT 1 FROM exam_sessions
  WHERE assignment_id = ? AND user_id = ? AND personal_deadline < unixepoch('now')
)
```

---

### SEC-H6: Anti-cheat events accepted after contest ends -- data pollution

**File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:45-65`

POST handler verifies enrollment and anti-cheat enabled, but does NOT verify
the contest is active. A student can POST events indefinitely after the contest
ends, polluting logs and inflating event counts in export reports.

**Fix:** Check `now < deadline` before inserting events.

---

### CLIENT-H1: Source code drafts persist in localStorage across user sessions

**File:** `src/hooks/use-source-draft.ts:51-53`

Draft key: `oj:submission-draft:{userId}:{problemId}`. On shared/lab computers,
the next student can enumerate all `oj:*` keys in localStorage via DevTools.
The 7-day TTL means drafts survive well past any exam. The "Resubmit" feature
(`submission-detail-client.tsx:72-82`) also writes full source code to localStorage.

**Fix:** Clear all `oj:*` localStorage entries on logout. For exam mode, use
`sessionStorage` instead.

---

### CLIENT-H2: Contest timer uses client-side `Date.now()` -- manipulable

**File:** `src/components/exam/countdown-timer.tsx:29,47`

System clock change extends the visible timer indefinitely. While submissions
are enforced server-side, the student gains the advantage of working without
time pressure UI.

**Fix:** Fetch server time offset at mount, apply correction:
```typescript
const diff = deadline - (Date.now() + serverTimeOffset);
```

---

### CLIENT-H3: Editor content exposed on `window.__ojEditorContent` global

**File:** `src/app/(dashboard)/dashboard/problems/[id]/problem-submission-form.tsx:59-66`

Any browser extension or injected script can read the student's current code
in real-time. The chat widget reads this global and sends it via API.

**Fix:** Use React Context instead of window global.

---

### PERF-H1: Full table scan on every submission creation (rate limit query)

**File:** `src/app/api/v1/submissions/route.ts:168-175`

The combined rate limit query has NO WHERE clause -- it scans every row in
`submissions` using CASE/WHEN. At 100K submissions: ~50-100ms per submit.
At 500K: 200-500ms. Under contest load with 100 concurrent submits, these
compound to multi-second delays.

**Fix:** Split into two targeted queries with proper indexes:
```sql
-- User-scoped (uses submissions_user_status_submitted_idx)
SELECT COUNT(*) FILTER (WHERE submitted_at > ?) AS recent,
       COUNT(*) FILTER (WHERE status IN (...)) AS pending
FROM submissions WHERE user_id = ?;

-- Global pending (uses submissions_status_idx)
SELECT COUNT(*) FROM submissions WHERE status IN ('pending','queued');
```
Or maintain an in-memory global pending counter.

---

### PERF-H2: TS similarity fallback blocks event loop (O(n^2), synchronous)

**File:** `src/lib/assignments/code-similarity.ts:72-115`

Without the Rust sidecar, similarity runs synchronous nested loops: 500
submissions = 124,750 pair comparisons * ~300 n-gram lookups each = 37.4M
string lookups. Blocks the event loop for 5-15 seconds. The 30-second
`Promise.race` timeout is useless against synchronous blocking.

**Fix:** Move to `worker_threads` or make the Rust sidecar mandatory.

---

### PERF-H3: SSE has no global connection limit -- connection exhaustion DoS

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:14,44-48`

Per-user cap exists but no global cap. An attacker with N accounts can open
`N * maxPerUser` connections, each polling the DB every `ssePollIntervalMs`.
1000 accounts * 5 connections = 5000 DB queries/second.

**Fix:** Add `MAX_GLOBAL_SSE_CONNECTIONS = 500` with a global counter.

---

### PERF-H4: WAL checkpoint starvation under write-heavy load

**File:** `src/lib/db/index.ts:37-40`

No `wal_autocheckpoint` configured. Default is 1000 frames (~4MB). During
heavy contests with anti-cheat heartbeats (200 writes/sec), the WAL grows
unbounded if long-running reads (contest scoring with multiple non-transactional
queries) hold snapshots.

**Fix:**
```typescript
sqlite.pragma("wal_autocheckpoint = 100"); // 100 frames (~400KB)
```
Wrap multi-statement reads in explicit transactions for single snapshot.

---

### PERF-H5: SSE connection counter leaks on crash paths

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:49,190-193`

Counter incremented at line 49, but if DB queries (lines 56-68) throw, the
catch at line 190 returns error without decrementing. Under sustained DB errors,
users are permanently locked out of SSE.

**Fix:** Move increment to after all fallible operations, or use try/finally.

---

### QUAL-H1: `auto-review.ts` queries same submission twice + uses `as any` cast

**File:** `src/lib/judge/auto-review.ts:58-79,87`

Lines 58-68 fetch the submission. Lines 72-79 fetch it again with `with: { problem }`.
Then `(submissionFull as any).problemId` bypasses TypeScript. If the Drizzle query
shape changes, `problemId` becomes `undefined` and the AI assistant check is
skipped -- reviews sent for problems where `allowAiAssistant` is disabled.

**Fix:** Single query with `with: { problem: { columns: { allowAiAssistant: true } } }`.

---

### QUAL-H2: Database restore leaves live connection corrupted + triple memory allocation

**File:** `src/app/api/v1/admin/restore/route.ts:29,40,59`

`file.arrayBuffer()` creates a copy, `Buffer.from()` creates another copy.
For 100MB upload (the limit): ~300MB transient memory. Then `writeFile` to
the live DB path while `better-sqlite3` has it mmap'd.

**Fix:** Stream upload to temp file, close sqlite connection, atomic rename.

---

### QUAL-H3: `system-settings.ts` uses `(settings as any)?.aiAssistantEnabled`

**File:** `src/lib/system-settings.ts:43,50`

The `as any` cast bypasses all type checking. If the column is renamed,
these silently return `true` (the default), enabling AI assistance globally.

**Fix:** Add `aiAssistantEnabled` to the typed select query.

---

### QUAL-H4: ICPC scoring breaks when `startsAt` is null

**File:** `src/lib/assignments/contest-scoring.ts:119`

```typescript
const contestStartMs = meta.startsAt ? meta.startsAt * 1000 : 0;
```

If null, penalty = `Math.floor((firstAcMs - 0) / 60_000)` = millions of minutes
since Unix epoch. The UI may not prevent ICPC contests without `startsAt`.

**Fix:** Return early with error when `scoringModel === "icpc" && !meta.startsAt`.

---

## Phase 2 -- MEDIUM (Fix within 1 month)

### SEC-M1: Instructor exam session query allows cross-group student lookup

**File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/exam-session/route.ts:92-95`

Any instructor (not just the group owner) enrolled as a student in another
group can pass a `userId` parameter to query other students' exam sessions.

**Fix:** Only allow `userId` override for the group's owning instructor or admin.

---

### SEC-M2: Role cache has no TTL -- deleted/modified custom roles retain cached capabilities

**File:** `src/lib/capabilities/cache.ts:14-15,59-67`

`roleCache` loaded once, never expires. Only cleared by explicit
`invalidateRoleCache()`. If any code path modifying roles forgets to
invalidate, stale capabilities persist until restart.

**Fix:** Add 60-second TTL:
```typescript
let roleCacheLoadedAt = 0;
const ROLE_CACHE_TTL_MS = 60_000;
async function ensureLoaded() {
  if (roleCache && Date.now() - roleCacheLoadedAt < ROLE_CACHE_TTL_MS) return;
  // ... reload ...
}
```

---

### SEC-M3: Leaderboard exposes student names/classNames to other students

**File:** `src/app/api/v1/contests/[assignmentId]/leaderboard/route.ts:65-71`

Student view strips `userId` but leaves `username`, `name`, `className` visible.
For recruiting/exam contexts, individual performance data should be private.

**Fix:** Add contest-level `anonymousLeaderboard` setting.

---

### SEC-M4: `updateAssignmentWithProblems` DELETE-then-INSERT visible to concurrent WAL readers

**File:** `src/lib/assignments/management.ts:201-204`

Within a transaction, all `assignment_problems` rows are DELETEd then re-INSERTed.
In WAL mode, concurrent readers may observe the empty state (between DELETE and INSERT).
A leaderboard query during this window returns empty.

**Fix:** Use upsert / diff-based update instead of full DELETE+INSERT.

---

### PERF-M1: Synchronous SQLite in contest scoring blocks event loop 200-800ms

**Files:** `src/lib/assignments/contest-scoring.ts:107-186`, `src/lib/assignments/leaderboard.ts`,
`src/lib/assignments/contest-analytics.ts`

All scoring/analytics use sync `prepare().all()`. For 200 students * 8 problems
* 10 submissions = 16K rows, the CTE query blocks 50-200ms. Analytics compounds
to 200-800ms. First request after 15s cache expiry blocks all concurrent requests.

**Fix:** Use background refresh pattern: timer populates cache, requests always read
from cache, never block on computation.

---

### PERF-M2: Anti-cheat heartbeat events grow unbounded (72K rows/contest)

**File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:77-89`

200 students * 30s heartbeat * 3h = 72,000 rows per contest. No pruning.
Queries that scan by assignmentId slow down proportionally.

**Fix:** Store `lastHeartbeatAt` per user-assignment row instead of individual
events. Or prune heartbeat events after 24 hours.

---

### PERF-M3: Contest scoring queries not wrapped in read transaction -- inconsistent snapshots

**File:** `src/lib/assignments/contest-scoring.ts:107-217`

Three separate `prepare().all()` queries without an explicit transaction.
Concurrent writes between queries can produce inconsistent leaderboard data.

**Fix:** Wrap in `sqlite.transaction(() => { ... })()` for single snapshot.

---

### PERF-M4: Unbounded JSON body parsing on multiple endpoints

**Files:** `src/app/api/v1/submissions/route.ts:153`, `src/app/api/v1/judge/claim/route.ts:44`,
`src/app/api/v1/plugins/chat-widget/chat/route.ts:150`

`await request.json()` has no body size limit. Zod validates structure after
parsing. A 50MB JSON body: ~200MB V8 heap + 500-1000ms sync parse.
10 concurrent requests = 2GB.

**Fix:** Add body size middleware (1MB for API, 100MB for restore).

---

### PERF-M5: Module-level `setInterval` leaks across hot reloads (2 locations)

**Files:** `src/app/api/v1/submissions/[id]/events/route.ts:21`, `src/lib/audit/events.ts:146-151`

Each hot reload creates a new interval while the old one remains. Old intervals
hold closures over old Maps, preventing GC.

**Fix:** Guard with module-level variable: `if (timer) clearInterval(timer);`

---

### PERF-M6: Analytics/ranking cache eviction is O(n) linear scan, evicts only 1 entry

**Files:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:23-34`,
`src/lib/assignments/contest-scoring.ts:57-68`

Under burst traffic (200 students refresh simultaneously), cache grows to
100+N entries and stays there. Each insert past threshold scans all entries.

**Fix:** Evict oldest N/4 in a single pass, or use `lru-cache`.

---

### CLIENT-M1: Anti-cheat monitor is trivially bypassable (multiple vectors)

**File:** `src/components/exam/anti-cheat-monitor.tsx`

(a) Client-side rate limit (`MIN_INTERVAL_MS = 1000`) suppressible via console
(b) Silent `catch {}` -- block the URL in DevTools and all events are lost
(c) No paste prevention (only logged)
(d) No DevTools/VM/screen-sharing detection
(e) `document.hidden` bypassed by split-screen

**Fix:** Server-side heartbeat enforcement (flag >30s gaps as suspicious).

---

### CLIENT-M2: `actualOutput` sent to client regardless of `showRuntimeErrors` flag

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/page.tsx:89`

The UI conditionally hides `actualOutput`, but the data is in the React props
and accessible via DevTools. For hidden test cases, runtime error output can
reveal information about the test input.

**Fix:** Filter server-side before passing to client component:
```typescript
actualOutput: showRuntimeErrors ? result.actualOutput : null,
```

---

### QUAL-M1: `latePenalty` float arithmetic produces precision artifacts in scoring SQL

**File:** `src/lib/assignments/contest-scoring.ts:157-163`

`1.0 - 20/100.0 = 0.8` but `score * 0.8` may yield `79.99999999999999`.
`ROUND(..., 2)` helps but doesn't eliminate all cases.

**Fix:** Store `latePenalty` as integer (percentage * 100) or document the rounding.

---

### QUAL-M2: `updateProfile`/`updatePreferences` don't handle SQLITE_BUSY, proceed to update session on failure

**Files:** `src/lib/actions/update-profile.ts:75-86`, `src/lib/actions/update-preferences.ts:100-103`

Sync `.run()` call with no try/catch. If it throws (SQLITE_BUSY, disk full),
the function proceeds to `unstable_update()` to update the session with values
that were never persisted to the DB.

**Fix:** Wrap `.run()` in try/catch, return error before session update.

---

### QUAL-M3: `changePassword` audit event is fire-and-forget

**File:** `src/lib/actions/change-password.ts:64-71,77-93`

The password change invalidates all sessions immediately, but the audit event
is not awaited. If audit write fails, there's no record of the password change.

**Fix:** Await `recordAuditEvent` within the same try/catch.

---

### QUAL-M4: `resetAllLanguagesToDefaults` runs 80+ sequential updates without transaction

**File:** `src/lib/actions/language-configs.ts:283-294`

A failure midway leaves some languages reset and others not.

**Fix:** Wrap in `sqlite.transaction()`.

---

### QUAL-M5: `providers.ts` OpenAI tool call `JSON.parse` unguarded

**File:** `src/lib/plugins/chat-widget/providers.ts:113`

`JSON.parse(tc.function.arguments || "{}")` throws on malformed JSON from
OpenAI, crashing the auto-review flow.

**Fix:** Wrap in try/catch, fallback to `{}`.

---

### QUAL-M6: Score override Zod schema allows unbounded score, requires `.int()` but column is `real`

**File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:17`

`z.number().int().min(0)` -- no max, and `.int()` rejects legitimate fractional
partial-credit scores.

**Fix:** `z.number().min(0).max(10000)` (remove `.int()` for partial credit).

---

## Phase 3 -- LOW (Backlog)

### QUAL-L1: `auto-review.ts` hardcodes Korean system prompt

**File:** `src/lib/judge/auto-review.ts:102-112`

Non-Korean users receive AI reviews in Korean.
**Fix:** Make locale configurable via system settings or user preference.

---

### QUAL-L2: `lecture-mode-toggle.tsx` imports `useTranslations` but uses hardcoded English

**File:** `src/components/layout/lecture-mode-toggle.tsx:36,42-51`

**Fix:** Add translation keys to `messages/{en,ko}.json`.

---

### QUAL-L3: `antiCheatEvents.details` stored as untyped `text` instead of `{ mode: "json" }`

**File:** `src/lib/db/schema.ts:755`

Requires manual `JSON.parse` at every access point. Components that parse it
(`participant-anti-cheat-timeline.tsx:43`, `anti-cheat-dashboard.tsx:57`) have
no error handling on `JSON.parse`.

**Fix:** Change to `text("details", { mode: "json" }).$type<Record<string, unknown>>()`.

---

### QUAL-L4: JWT type declaration makes all fields optional -- weakens type safety

**File:** `src/types/next-auth.d.ts:46-63`

`id?: string`, `role?: string`, etc. means every consumer must null-check.
**Fix:** Create `ValidatedJWT` type with required fields for post-validation use.

---

### QUAL-L5: SSE connection counter not decremented on error paths

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:45-51`

(Also noted in PERF-H5 above. Minor additional detail: the stale-entry cleanup
at lines 20-30 partially mitigates but only after `sseTimeoutMs + 30s`.)

---

### PERF-L1: Deprecated rate limit constants still exported with insecure defaults

**File:** `src/lib/security/constants.ts:22-40`

`SUBMISSION_RATE_LIMIT_MAX_PER_MINUTE = 120`, `SUBMISSION_MAX_PENDING = 200`.
If any code path references these instead of `getConfiguredSettings()`, the
runtime config is silently ignored.

**Fix:** Remove deprecated exports or change defaults to match configured values.

---

### PERF-L2: Docker build `maxBuffer: 10MB` -- large builds silently fail

**File:** `src/lib/docker/client.ts:93`

Verbose builds (Rust crates) can exceed 10MB output. The build may succeed
but the result is reported as failed.

**Fix:** Use `spawn` with streaming output instead of `execFile`.

---

### CLIENT-L1: `key.pem` RSA private key exists at project root

**File:** `key.pem` (project root)

1675-byte RSA private key. Not tracked in git (`.gitignore` covers `*.pem`)
but present on disk. Verified not in git history.

**Fix:** Move to a secrets manager. Delete from disk.

---

### CLIENT-L2: Open redirect mitigation has minor `hash` gap

**File:** `src/app/(auth)/login/login-form.tsx:11-17`

`getSafeRedirectUrl` correctly blocks absolute and protocol-relative URLs.
After `signIn`, `result.url` is decomposed via `new URL()` -- the `hash` portion
could theoretically be abused if NextAuth returns a crafted URL.

**Fix:** Strip hash from redirect URL.

---

## Summary

| Phase | Count | Categories |
|-------|-------|------------|
| **Phase 0 -- CRITICAL** | 5 | Score override validation, custom role auth bypass, backup corruption, restore corruption, Argon2 memory explosion |
| **Phase 1 -- HIGH** | 16 | Contest problem swap, isPrivileged bypass, rate limit TOCTOU, exam deadline race, anti-cheat data pollution, localStorage leaks, timer manipulation, window global, full table scans, similarity DoS, SSE exhaustion, WAL starvation, connection leak, auto-review type safety, restore memory, settings type safety, ICPC null startsAt |
| **Phase 2 -- MEDIUM** | 16 | Exam session cross-group, role cache TTL, leaderboard names, DELETE+INSERT visibility, sync scoring, heartbeat growth, read transaction, JSON body limits, setInterval leaks, cache eviction, anti-cheat bypass, actualOutput leak, float precision, profile error handling, audit fire-and-forget, language reset atomicity, JSON.parse unguarded, score override bounds |
| **Phase 3 -- LOW** | 9 | Korean hardcode, untranslated strings, untyped JSON column, JWT optionality, SSE counter (detail), deprecated constants, Docker maxBuffer, key.pem, open redirect hash |

**Total new findings: 46** (deduplicated across all 4 review agents)

---

## Cross-Reference with Previous Review

The previous review (`.context/development/security-and-quality-review-2026-03-28.md`)
found 46 issues, 45 of which were fixed. This review found **46 new issues** that
were not covered by the previous review, focused on:

1. **Business logic flaws** (score override, problem swap, exam timing races)
2. **Custom role system inconsistency** (sync vs async auth checks)
3. **Performance under concurrent load** (Argon2 memory, table scans, event loop blocking)
4. **Client-side contest integrity** (localStorage leaks, timer manipulation, window globals)
5. **Data consistency** (WAL backup, restore corruption, read transaction gaps)

These findings are complementary to, not duplicative of, the previous review.
