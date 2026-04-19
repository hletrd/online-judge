# Aggregate Review — Cycle 6 Deep Code Review

**Date:** 2026-04-19
**Source reviews:**
- `cycle-6-comprehensive-review.md` (comprehensive multi-angle review covering code quality, security, performance, architecture, testing, and design)

---

## CRITICAL (Immediate Action Required)

None.

---

## HIGH (Should Fix This Cycle)

### A1: SSE route registers duplicate SIGTERM handler alongside audit shutdown handler
- **Source**: F1
- **Files**: `src/app/api/v1/submissions/[id]/events/route.ts:83-89`
- **Description**: The SSE events route registers its own `process.on("SIGTERM")` handler at module evaluation time to clear in-memory connection tracking. This duplicates the pattern fixed in cycle 5b for the audit module. While the SSE handler only clears in-memory data (no async flush), it's inconsistent with the cycle 5b fix and adds unnecessary process-level signal handlers.
- **Fix**: Remove the `process.on("SIGTERM")` handler. In-memory data structures are garbage-collected on process exit.

### A2: Public user profile page uses raw SQL fragment as column reference
- **Source**: F2, F8
- **Files**: `src/app/(public)/users/[id]/page.tsx:52`
- **Description**: `eq(sql\`id\`, id)` uses a raw SQL fragment as the column reference instead of `eq(users.id, id)`. This bypasses Drizzle's type system and table-qualified column references. The same file also uses the non-standard `db._.fullSchema.users.id` in `generateMetadata` (line 27).
- **Fix**: Import `users` from `@/lib/db/schema` and use `eq(users.id, id)` in both `generateMetadata` and the default export.

---

## MEDIUM (Should Fix Soon)

None beyond A1/A2.

---

## LOW (Can Defer)

### A3: `files/[id]` DELETE handler uses `select()` without column restriction
- **Source**: F3
- **Files**: `src/app/api/v1/files/[id]/route.ts:145-149`
- **Description**: DELETE handler loads all columns when it only needs `id`, `storedName`, `originalName`, and `uploadedBy`. GET handler legitimately needs all columns.

### A4: `getAllPluginStates()` fetches all rows/columns from plugins table
- **Source**: F4
- **Files**: `src/lib/plugins/data.ts:52`
- **Description**: `db.select().from(plugins)` with no WHERE or column restriction. Plugin configs are loaded fully then immediately redacted.

### A5: SSE route not using `createApiHandler` creates maintenance gap
- **Source**: F5
- **Files**: `src/app/api/v1/submissions/[id]/events/route.ts:1`
- **Description**: The route manually implements auth/CSRF/rate-limit that `createApiHandler` provides. Future middleware changes won't propagate.

### A6: Export Content-Disposition headers don't RFC 5987-encode non-ASCII filenames
- **Source**: F6
- **Files**: Multiple export routes
- **Description**: Korean characters in assignment titles are stripped from export filenames rather than RFC 5987-encoded.

### A7: Judge claim route returns all test case columns
- **Source**: F7
- **Files**: `src/app/api/v1/judge/claim/route.ts:301-305`
- **Description**: `db.select().from(testCases)` without column restriction. Authenticated endpoint, but column selection would be more defensive.

### A8: `db._.fullSchema` internal API access in user profile page
- **Source**: F8
- **Files**: `src/app/(public)/users/[id]/page.tsx:27`
- **Description**: `db._.fullSchema.users.id` is fragile and could break on Drizzle upgrades. Same fix as A2.

---

## PRIOR CYCLE OPEN ITEMS (Carried Forward)

From previous cycles, still open:
1. **Apr-19 C1:** Assistant roles can browse global user directory via `users.view`. OPEN -- design decision pending.
2. **C6 (cycle 4):** Error boundary pages use `console.error` instead of server-side reporting. DEFERRED -- client-side convention.
3. **C7 (cycle 4):** `as never` type assertion in problem-submission-form.tsx bypasses TypeScript type safety. DEFERRED -- LOW severity.
4. **A2 (cycle 4 aggregate):** Rate limit eviction could delete SSE connection slots. LOW risk due to heartbeat refresh, but architecturally fragile.
5. **A7 (cycle 4 aggregate):** Dual encryption key management systems. DEFERRED -- operational concern.
6. **A12 (cycle 4 aggregate):** Inconsistent auth/authorization patterns in some routes. DEFERRED -- convention enforcement.
7. **A17 (cycle 4 aggregate):** JWT contains excessive UI preference data. DEFERRED -- would require session restructure.
8. **A19 (cycle 4 aggregate):** `new Date()` clock skew risk in distributed deployments. DEFERRED -- PostgreSQL `now()` for critical ordering.
9. **A25 (cycle 4 aggregate):** Timing-unsafe bcrypt fallback. DEFERRED -- migration in progress.
10. **A26 (cycle 4 aggregate):** Polling-based backpressure wait (busy-wait) in export. DEFERRED -- LOW priority.

---

## AGENT FAILURES

None. (Single-agent review mode -- no fan-out agents available.)

---

## SUMMARY STATISTICS
- New findings this cycle: 8
- Critical: 0
- High: 2
- Medium: 0
- Low: 6
