# Third-Pass Review -- Post-Remediation Audit (2026-03-29)

Review after Plans 01-07 implementation (92 prior findings fixed + 30 route
migrations + 3 new UX features). Focuses on regressions from fixes, issues
in new code, and remaining gaps.

**Agents deployed:** Security, Code Quality, Performance.
**Files reviewed:** 36 changed files across 18 commits.

---

## Phase 0 -- CRITICAL (Fix immediately)

### SEC-C1: Chat widget `test-connection` URL injection via unsanitized `model` parameter

**File:** `src/app/api/v1/plugins/chat-widget/test-connection/route.ts:65`

The Gemini URL interpolates `model` directly:
```typescript
const url = `https://...googleapis.com/v1beta/models/${model}:generateContent`;
```
The Zod schema allows any non-empty string. A crafted `model` value could
redirect the request to an attacker-controlled endpoint with the victim's
API key.

**Fix:** Validate model contains only safe characters:
```typescript
const MODEL_REGEX = /^[a-zA-Z0-9._-]+$/;
if (!MODEL_REGEX.test(model)) return apiError("invalidModel", 400);
```

---

### PERF-C1: SSE connection counter TOCTOU race allows limit bypass

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:57,81-83`

`globalConnectionCount` is read at line 50 and incremented at line 83, with
multiple `await` points between (DB query, access check, capability resolve).
Two concurrent requests both read 499 and both pass the <500 check, then both
increment to 501. The per-user `activeConnections` map has the same race.

**Fix:** Increment immediately after the check (before any await), decrement
in catch if subsequent operations fail:
```typescript
// After limit check, BEFORE any await:
activeConnections.set(userId, currentCount + 1);
globalConnectionCount += 1;
try {
  // ... db lookups, access checks ...
} catch {
  // Decrement on failure
  const c = activeConnections.get(userId) ?? 1;
  if (c <= 1) activeConnections.delete(userId);
  else activeConnections.set(userId, c - 1);
  globalConnectionCount = Math.max(0, globalConnectionCount - 1);
  throw;
}
```

---

## Phase 1 -- HIGH (Fix within 1 week)

### SEC-H1: Anonymous leaderboard bypassed -- `className` and timing data leaked

**File:** `src/app/api/v1/contests/[assignmentId]/leaderboard/route.ts:58-69`

The `...rest` spread passes through ALL fields from `computeContestRanking()`.
Only `userId` is explicitly stripped. Fields like `className`, `firstAcAt`
timing, and any future user-identifying fields leak through. The anonymous
overrides only replace `username`/`name`/`className`, but the spread happens
before the overrides.

**Fix:** Explicitly enumerate allowed fields instead of spreading:
```typescript
const entries = leaderboard.entries.map((entry) => ({
  rank: entry.rank,
  totalScore: entry.totalScore,
  totalPenalty: entry.totalPenalty,
  problems: entry.problems,
  isCurrentUser: entry.userId === user.id,
  userId: "",
  username: isAnonymous ? `Participant ${entry.rank}` : entry.username,
  name: isAnonymous ? "" : entry.name,
  className: isAnonymous ? null : entry.className,
}));
```

---

### SEC-H2: Chat widget tool `get_submission_detail` bypasses group-scoped access check

**File:** `src/lib/plugins/chat-widget/tools.ts:170-176`

Uses `canViewAllSubmissions(role)` which returns true for any instructor,
allowing cross-group source code access. The regular submission API correctly
uses `canAccessSubmission()` with group scoping.

**Fix:** Use `canAccessSubmission()` for proper group-level scoping.

---

### SEC-H3: `/api/v1/time` endpoint has no rate limiting or auth

**File:** `src/app/api/v1/time/route.ts:1-5`

Plain export with no `createApiHandler` wrapper. No rate limit, leaks
millisecond-precision server clock (useful for timing attacks).

**Fix:** Wrap in `createApiHandler({ auth: false, rateLimit: "time:sync" })`.
Round timestamp to nearest second. Add to proxy.ts public route list.

---

### SEC-H4: Backup download allows `admin` role -- should require `super_admin`

**File:** `src/app/api/v1/admin/backup/route.ts:26`

Backup checks `isAdmin(user.role)` (allows admin + super_admin), but restore
correctly restricts to `super_admin` only. An admin can download the entire
database with all password hashes and source code.

**Fix:** `if (user.role !== "super_admin") return forbidden();`

---

### QUAL-H1: 8 migrated routes import from `@/lib/api/auth` instead of `@/lib/api/handler`

**Files:** admin/roles, admin/workers, submissions/[id], submissions/comments,
submissions/rejudge, admin/workers/stats, submissions/route, admin/chat-logs

The handler module re-exports `forbidden`/`notFound`/`isAdmin`/`isInstructor`.
Split imports create fragile patterns if the handler ever wraps these functions.

**Fix:** Consolidate all imports to `@/lib/api/handler` for routes using
`createApiHandler`.

---

### QUAL-H2: Dead imports left behind from migration

**Files:**
- `groups/[id]/members/[userId]/route.ts`: unused `assertUserRole`
- `admin/workers/route.ts`, `admin/workers/stats/route.ts`: unused `apiError`
- `submissions/route.ts`: unused `consumeApiRateLimit`

**Fix:** Remove unused imports.

---

### PERF-H1: Worker thread missing `exit` event handler -- 30s hang on crash

**File:** `src/lib/assignments/code-similarity.ts:80-97`

No `worker.on("exit")` handler. If worker exits abnormally (OOM kill), the
promise hangs for 30 seconds until timeout.

**Fix:** Add `worker.on("exit", (code) => { if (code !== 0) reject(...); })`.

---

### PERF-H2: Full problem table scan for instructor contest editor

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:449-452`

`db.select({ id, title }).from(problems)` loads ALL problems for the
assignment editor dropdown. At 10,000+ problems this is O(total_problems)
per page load.

**Fix:** Scope to instructor's accessible problems, or lazy-load on dialog open.

---

## Phase 2 -- MEDIUM (Fix within 1 month)

### SEC-M1: 6 POST/PATCH routes parse body manually without try/catch

**Files:** users/route, users/bulk, users/[id], problems/route, problems/[id],
groups/[id]/assignments/[assignmentId]/route, groups/members/bulk

These use `createApiHandler` but call `req.json()` manually instead of using
the `schema` option. Malformed JSON returns generic 500 instead of clear 400.

**Fix:** Either pass `schema` in config or wrap `req.json()` in try/catch.

---

### SEC-M2: `sanitize-html.ts` allows external `img src` -- tracking pixel risk

**File:** `src/lib/security/sanitize-html.ts:10-57`

Allows `img` with `https:` URLs. Instructors can embed tracking pixels in
problem descriptions. CSP blocks this on pages through proxy, but API-served
HTML may not have CSP.

**Fix:** Restrict `img src` to `data:` and relative URLs only.

---

### QUAL-M1: `anonymousLeaderboard` has no UI toggle in assignment forms

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:461-479`

Column exists in schema and leaderboard route, but `contestEditorValue` does
not include it. Feature is unreachable from the UI.

**Fix:** Add toggle to `AssignmentFormDialog`.

---

### QUAL-M2: Countdown timer fires retroactive toasts on mount

**File:** `src/components/exam/countdown-timer.tsx:78-89`

When mounting with 3 minutes left, both 15min and 5min toasts fire immediately.
`firedThresholds` starts empty.

**Fix:** Initialize with already-crossed thresholds:
```typescript
const firedThresholds = useRef<Set<number>>(new Set(
  THRESHOLDS_MS.filter(t => (deadline - Date.now()) <= t)
));
```

---

### QUAL-M3: `ValidatedJWT` type defined but never used

**File:** `src/types/next-auth.d.ts:70-75`

Dead type. Zero imports found.

**Fix:** Either adopt in auth code or remove.

---

### QUAL-M4: Language selector "No languages found" is hardcoded English

**File:** `src/components/language-selector.tsx:218`

Not covered by i18n props.

**Fix:** Add `noResultsLabel` prop.

---

### QUAL-M5: Similarity worker duplicates functions from main module

**Files:** `src/lib/assignments/similarity-worker.ts` vs `code-similarity.ts`

`normalizeSource`, `generateNgrams`, `jaccardSimilarity` are copy-pasted.
Bug fixes in one copy will be missed in the other.

**Fix:** Extract shared functions into a pure utility file importable by both.

---

### PERF-M1: Similarity n-gram generation allocates intermediate arrays

**File:** `src/lib/assignments/similarity-worker.ts:31-36`

`tokens.slice(i, i + n).join(" ")` creates a new array per n-gram. For 500
tokens with n=3, ~498 allocations per submission in O(n^2) comparisons.

**Fix:** Use index-based string concatenation instead of slice+join.

---

### PERF-M2: Bulk user insert uses serial loop instead of batch insert

**File:** `src/app/api/v1/users/bulk/route.ts:117-133`

100 users = 100 sequential INSERT statements. Drizzle supports batch insert.

**Fix:** `tx.insert(users).values(allEntries)` as a single batch.

---

## Phase 3 -- LOW (Backlog)

### QUAL-L1: `getTextColor` returns empty string for no-color case

**File:** `src/components/exam/countdown-timer.tsx:104`

Returns `""` instead of `undefined`. Requires `|| undefined` workaround.
Minor code smell.

---

### QUAL-L2: `Content-Disposition` in export route lacks RFC 5987 encoding

**File:** `src/app/api/v1/contests/[assignmentId]/export/route.ts:111`

Non-ASCII filenames garbled. Uses simple `filename="..."` form.

---

### PERF-L1: SSE poll interval could use exponential backoff

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:146-200`

Fixed poll interval (default 2s). Could start at 1s and back off to 5s after
30s of no change. Most submissions judge within seconds.

---

### PERF-L2: Argon2 p-limit(4) is hardcoded

**File:** `src/app/api/v1/users/bulk/route.ts:88`

Could derive from `os.availableParallelism()`.

---

## Summary

| Phase | Count | Categories |
|-------|-------|------------|
| **Phase 0 -- CRITICAL** | 2 | URL injection in chat widget, SSE counter race |
| **Phase 1 -- HIGH** | 6 | Leaderboard data leak, chat tool scope, /time endpoint, backup role, split imports, dead imports, worker exit handler, problem table scan |
| **Phase 2 -- MEDIUM** | 9 | Manual body parsing, img tracking, anonymous UI gap, timer toasts, dead type, i18n gap, worker duplication, n-gram allocation, serial inserts |
| **Phase 3 -- LOW** | 4 | Minor code smells, encoding, backoff, hardcoded limit |

**Total new findings: 21** (post-remediation, including regressions)

Most findings are LOW-to-MEDIUM quality issues and migration cleanup. The
two CRITICAL items (URL injection and SSE race) should be fixed before the
next deployment. The route migration was executed correctly with no auth
bypass regressions.
