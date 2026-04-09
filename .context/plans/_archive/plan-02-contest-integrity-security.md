# Plan 02: Contest Integrity & Security Hardening

**Priority:** CRITICAL to HIGH
**Effort:** Medium (2-3 days)
**Source findings:** SEC-C1, SEC-H1, SEC-H4, SEC-H5, SEC-H6, SEC-M3,
CLIENT-H1, CLIENT-H2, CLIENT-H3, CLIENT-M1, CLIENT-M2, QUAL-M6

## Problem

Multiple contest integrity gaps allow score fabrication, submission after
deadline, data leakage, and client-side manipulation. These directly affect
fairness in exams, contests, and recruiting tests.

## Implementation Steps

### Step 1: Score override validation (SEC-C1, QUAL-M6) -- CRITICAL

```
File: src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts

1. After parsing body, verify problemId belongs to assignment:
   - Query assignmentProblems for (assignmentId, problemId)
   - If not found, return apiError("problemNotInAssignment", 400)
   - Cap overrideScore to assignmentProblem.points

2. Update Zod schema:
   - Change z.number().int().min(0) to z.number().min(0).max(10000)
   - Remove .int() to allow partial credit (fractional scores)
```

### Step 2: Block problem changes during active contests (SEC-H1)

```
File: src/app/api/v1/groups/[id]/assignments/[assignmentId]/route.ts

In PATCH handler, before processing body.problems:
  - If assignment.examMode !== "none":
    - Check if now >= startsAt
    - If yes, return apiError("contestProblemsLockedDuringActive", 409)
  - For non-exam assignments with submissions:
    - Allow additions but block removals/replacements of existing problems

Add i18n key: "contestProblemsLockedDuringActive" to messages/{en,ko}.json
```

### Step 3: Atomic submission rate limit + deadline enforcement (SEC-H4, SEC-H5)

```
File: src/app/api/v1/submissions/route.ts

Wrap the rate limit check + INSERT in sqlite.transaction():

  sqlite.transaction(() => {
    // 1. Read rate limits
    const counts = sqlite.prepare(`
      SELECT
        SUM(CASE WHEN user_id = ? AND submitted_at > ? THEN 1 ELSE 0 END) AS recent,
        SUM(CASE WHEN user_id = ? AND status IN ('pending','judging','queued') THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status IN ('pending','queued') THEN 1 ELSE 0 END) AS global_pending
      FROM submissions
      WHERE user_id = ? OR status IN ('pending','queued')
    `).get(userId, windowStart, userId, userId);

    // 2. Check limits
    if (counts.recent >= maxPerMinute) throw rateError;
    if (counts.pending >= maxPending) throw pendingError;
    if (counts.global_pending >= maxGlobalPending) throw queueError;

    // 3. For windowed exams, verify deadline at INSERT time
    if (assignmentId && examMode === "windowed") {
      const expired = sqlite.prepare(`
        SELECT 1 FROM exam_sessions
        WHERE assignment_id = ? AND user_id = ? AND personal_deadline < ?
      `).get(assignmentId, userId, Math.floor(Date.now() / 1000));
      if (expired) throw deadlineError;
    }

    // 4. INSERT
    db.insert(submissions).values({...}).run();
  })();

This ensures rate limits and deadline are checked atomically with the insert.
```

### Step 4: Anti-cheat time bounds (SEC-H6)

```
File: src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts

After fetching assignment and before inserting event:
  const now = Date.now();
  if (assignment.startsAt && now < new Date(assignment.startsAt).getTime())
    return apiError("contestNotStarted", 403);
  if (assignment.deadline && now > new Date(assignment.deadline).getTime())
    return apiError("contestEnded", 403);
```

### Step 5: Clear localStorage on logout (CLIENT-H1)

```
File: src/lib/auth/config.ts (or a new client-side logout handler)

On sign-out, clear all oj:* localStorage entries:
  - Find sign-out handler or create one
  - Add: Object.keys(localStorage).forEach(k => {
      if (k.startsWith("oj:")) localStorage.removeItem(k);
    });

For exam mode, use sessionStorage instead:
  File: src/hooks/use-source-draft.ts
  - Accept an `examMode` parameter
  - If examMode, use sessionStorage instead of localStorage
  - The draft key already includes userId, but clearing on logout adds defense-in-depth
```

### Step 6: Server-synced contest timer (CLIENT-H2)

```
File: src/components/exam/countdown-timer.tsx

1. Add a /api/v1/time endpoint (GET, public, returns { timestamp: Date.now() })

2. In CountdownTimer, on mount:
   - Fetch /api/v1/time
   - Compute offset = serverTime - (requestStart + roundTrip/2)
   - Store offset in state

3. In the interval callback:
   - Use (Date.now() + offset) instead of raw Date.now()

4. Add periodic re-sync every 5 minutes to correct drift

New file: src/app/api/v1/time/route.ts (trivial GET endpoint)
```

### Step 7: Replace window global with React Context (CLIENT-H3)

```
File: src/app/(dashboard)/dashboard/problems/[id]/problem-submission-form.tsx

1. Create EditorContentContext:
   File: src/contexts/editor-content-context.tsx
   - EditorContentProvider with { code, language } state
   - useEditorContent() hook

2. Wrap problem page layout in EditorContentProvider

3. In problem-submission-form.tsx:
   - Replace (window as any).__ojEditorContent = ... with context setter
   - Remove the useEffect that writes to window

4. In chat-widget.tsx:
   - Replace (window as any).__ojEditorContent read with useEditorContent()
```

### Step 8: Filter actualOutput server-side (CLIENT-M2)

```
File: src/app/(dashboard)/dashboard/submissions/[id]/page.tsx

When building results array for client component:
  - If !showDetailedResults: strip actualOutput, executionTimeMs, memoryUsedKb
  - If !showRuntimeErrors && status === "runtime_error": strip actualOutput
  - Only pass what the UI would display anyway
```

### Step 9: Anonymous leaderboard option (SEC-M3)

```
File: src/lib/db/schema.ts
  - Add anonymousLeaderboard: integer("anonymous_leaderboard", { mode: "boolean" }).default(false)
    to assignments table

File: src/app/api/v1/contests/[assignmentId]/leaderboard/route.ts
  - If assignment.anonymousLeaderboard && !isInstructorView:
    - Replace username with "Participant {rank}"
    - Strip name, className

File: assignment creation/edit forms
  - Add toggle for anonymousLeaderboard
```

### Step 10: Server-side anti-cheat heartbeat enforcement (CLIENT-M1)

```
This was already partially implemented (SEC-M1 in first review added heartbeat).
Remaining: add server-side gap detection.

File: src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts (GET handler)
  - When fetching events for a user, compute gaps between consecutive heartbeats
  - Flag gaps > 60s as suspicious
  - Include gap analysis in the anti-cheat dashboard response

File: src/components/exam/anti-cheat-monitor.tsx
  - Add retry queue for failed event reports (buffer in memory, retry on next heartbeat)
  - Remove silent catch {} -- at least log to console.warn
```

## Testing

- Test score override rejects invalid problemId
- Test score override rejects overrideScore > problem points
- Test problem swap blocked during active contest
- Test submission rejected after exam deadline (concurrent timing)
- Test anti-cheat events rejected after contest ends
- Test localStorage cleared on logout
- Test timer offset calculation with mocked server time
- Test EditorContentContext replaces window global
- Test anonymous leaderboard hides names

## Progress (2026-03-28)

- [x] Step 1: Score override validation (problemId + bounds) -- commit `cbfcf92`
- [x] Step 2: Block problem changes during active contests -- commit `cbfcf92`
- [x] Step 3: Atomic submission rate limit + deadline enforcement -- commit `5454cdd`
- [x] Step 4: Anti-cheat time bounds -- commit `46a24e7`
- [x] Step 5: Clear localStorage on logout -- commit `685ace5`
- [x] Step 6: Server-synced contest timer -- commit `685ace5`
- [x] Step 7: EditorContentContext replaces window global -- commit `685ace5`
- [x] Step 8: Filter actualOutput server-side -- commit `46a24e7`
- [x] Step 9: Anonymous leaderboard option -- commit `d959e8e`
- [x] Step 10: Server-side heartbeat enforcement (throttle to 60s) -- commit `857f0e7`

**Status: COMPLETE**
