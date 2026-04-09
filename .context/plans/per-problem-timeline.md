# Per-Problem Timeline for Contest Participants

## Context

Contest administrators need detailed visibility into each participant's problem-solving journey: when they started working on a problem, how many attempts they made, what scores they achieved, when they switched problems, and behavioral signals. Currently, analytics are contest-wide aggregates (solve rates, score distributions) without per-participant per-problem detail.

## Data Sources (Already Available)

| Source | What it provides | Key timestamps |
|--------|-----------------|----------------|
| `submissions` | Every attempt with score, status, language, source code | `submittedAt`, `judgedAt` |
| `codeSnapshots` | Periodic code state captures (every 10-60s during editing) | `createdAt` |
| `examSessions` | Participant exam start time and personal deadline | `startedAt`, `personalDeadline` |
| `antiCheatEvents` | Behavioral signals (tab_switch, blur, copy, paste, contextmenu) | `createdAt` |
| `contestAccessTokens` | First contest access | `redeemedAt` |
| `contest-scoring` (derived) | `firstAcAt`, `wrongBeforeAc`, penalty, best score | computed from submissions |

No new database tables are needed. All data exists; we need a query layer and UI.

## Architecture

### New API Endpoint

```
GET /api/v1/contests/[assignmentId]/participant-timeline/[userId]
```

**Auth:** Admin or instructor (group owner / co-instructor)

**Response:**
```typescript
{
  participant: {
    userId: string;
    username: string;
    name: string;
    examStartedAt: string | null;     // from examSessions
    personalDeadline: string | null;
    contestAccessAt: string | null;    // from contestAccessTokens
  };
  problems: Array<{
    problemId: string;
    title: string;
    points: number;
    sortOrder: number;
    summary: {
      totalAttempts: number;
      bestScore: number | null;
      firstSubmissionAt: string | null;
      lastSubmissionAt: string | null;
      firstAcAt: string | null;
      timeToFirstSubmission: number | null;   // seconds from exam start
      timeToFirstAc: number | null;           // seconds from exam start
      wrongBeforeAc: number;
      snapshotCount: number;                  // code snapshots captured
    };
    timeline: Array<TimelineEvent>;
  }>;
  antiCheatSummary: {
    totalEvents: number;
    byType: Record<string, number>;
  };
}
```

**TimelineEvent** (union type):
```typescript
type TimelineEvent =
  | { type: "submission"; at: string; submissionId: string; status: string; score: number | null; language: string; executionTimeMs: number | null }
  | { type: "snapshot"; at: string; snapshotId: string; charCount: number; language: string }
  | { type: "anti_cheat"; at: string; eventType: string; details: string | null }
  | { type: "exam_start"; at: string }
  | { type: "first_ac"; at: string; submissionId: string };
```

All events are sorted chronologically. This provides a unified timeline view per problem.

### New Library Function

**File:** `src/lib/assignments/participant-timeline.ts`

```typescript
export async function getParticipantTimeline(
  assignmentId: string,
  userId: string
): Promise<ParticipantTimeline>
```

**Implementation:**
1. Fetch participant info (user, exam session, contest access token)
2. Fetch all assignment problems with points/sort order
3. For each problem, query in parallel:
   - All submissions (`WHERE assignmentId AND userId AND problemId ORDER BY submittedAt`)
   - All code snapshots (`WHERE assignmentId AND userId AND problemId ORDER BY createdAt`)
4. Fetch all anti-cheat events for this user+assignment
5. Merge into per-problem timeline events, sorted chronologically
6. Compute summary stats (first submission, first AC, time-to-solve, etc.)

**Performance:** Uses existing indexes:
- `submissions_assignment_user_problem_idx`
- `cs_user_problem_idx` (code snapshots)
- `ace_assignment_user_idx` (anti-cheat events)

### UI Component

**File:** `src/components/contest/participant-timeline.tsx`

A timeline view per participant that shows:
- Header: participant name, exam start time, personal deadline
- Per-problem accordion/tabs:
  - Summary card: attempts, best score, time to solve, snapshot count
  - Visual timeline: chronological list of events with icons
    - Submission events: status badge (AC/WA/CE/TLE/etc.), score, language
    - Snapshot events: char count indicator, clickable to view code diff
    - Anti-cheat events: colored badges (yellow/red/gray by severity)
    - First AC marker: highlighted
  - Time indicators: relative time from exam start
- Anti-cheat summary sidebar

### Page Integration

**Option A:** New page at `/dashboard/contests/[assignmentId]/participant/[userId]/timeline`
**Option B:** Tab within the existing participant detail page

Recommended: **Option A** as a standalone page, linked from the leaderboard and participant list.

### Admin Leaderboard Link

Add a "Timeline" icon/link in the contest leaderboard table for each participant row, linking to the new timeline page.

## Files to Create/Modify

### New Files
1. `src/lib/assignments/participant-timeline.ts` - Core query function
2. `src/app/api/v1/contests/[assignmentId]/participant-timeline/[userId]/route.ts` - API endpoint
3. `src/app/(dashboard)/dashboard/contests/[assignmentId]/participant/[userId]/timeline/page.tsx` - Timeline page
4. `src/components/contest/participant-timeline-view.tsx` - Timeline UI component

### Modified Files
5. `src/components/contest/leaderboard-table.tsx` - Add timeline link per row
6. `messages/en.json` - Add i18n keys under `contests.timeline.*`
7. `messages/ko.json` - Korean translations

## Query Design

### Main Query (per participant, all problems)

```sql
-- Submissions per problem
SELECT s.id, s.problem_id, s.status, s.score, s.language,
       s.execution_time_ms, s.submitted_at, s.judged_at
FROM submissions s
WHERE s.assignment_id = $1 AND s.user_id = $2
ORDER BY s.submitted_at ASC;

-- Code snapshots per problem
SELECT cs.id, cs.problem_id, cs.language, cs.char_count, cs.created_at
FROM code_snapshots cs
WHERE cs.assignment_id = $1 AND cs.user_id = $2
ORDER BY cs.created_at ASC;

-- Anti-cheat events
SELECT ace.id, ace.event_type, ace.details, ace.created_at
FROM anti_cheat_events ace
WHERE ace.assignment_id = $1 AND ace.user_id = $2
ORDER BY ace.created_at ASC;

-- Exam session
SELECT es.started_at, es.personal_deadline
FROM exam_sessions es
WHERE es.assignment_id = $1 AND es.user_id = $2;

-- Contest access
SELECT cat.redeemed_at
FROM contest_access_tokens cat
WHERE cat.assignment_id = $1 AND cat.user_id = $2;
```

All queries use existing indexed columns. Expected total query time: <50ms for a typical contest.

### Grouping Strategy

Group submissions and snapshots by `problemId` client-side (or in the library function). Anti-cheat events are assignment-level and appear in all problem timelines (or in a separate "global" timeline section).

## i18n Keys

```json
{
  "contests": {
    "timeline": {
      "title": "Participant Timeline",
      "examStarted": "Exam Started",
      "personalDeadline": "Personal Deadline",
      "contestAccess": "Contest Accessed",
      "totalAttempts": "Attempts",
      "bestScore": "Best Score",
      "firstSubmission": "First Submission",
      "firstAc": "First Accepted",
      "timeToSolve": "Time to Solve",
      "snapshotCount": "Code Snapshots",
      "wrongBeforeAc": "Wrong Before AC",
      "submission": "Submission",
      "snapshot": "Code Snapshot",
      "noTimeline": "No activity recorded for this participant.",
      "viewTimeline": "Timeline",
      "antiCheatSummary": "Integrity Signals",
      "charCount": "{count} chars",
      "relativeTime": "+{minutes}m {seconds}s"
    }
  }
}
```

## Security Considerations

- Only accessible to admin/super_admin/instructor who owns the group
- Source code in snapshots must be access-controlled (same as submission view)
- Anti-cheat event details should not be exposed to participants
- Rate limit the endpoint (it queries multiple tables)

## Performance Considerations

- All queries use existing indexes - no new indexes needed
- Code snapshot `sourceCode` is NOT included in the timeline API response (only `charCount`)
  - Clicking a snapshot loads the full code via existing `/code-snapshots/[userId]` endpoint
- Consider LRU cache with 30s TTL for repeated views of the same participant
- Pagination not needed: typical contest has <200 submissions per participant

## Implementation Order

1. `participant-timeline.ts` - Core data function
2. API route - REST endpoint
3. `participant-timeline-view.tsx` - UI component
4. Timeline page - Server component integration
5. Leaderboard link - Wire up navigation
6. i18n labels
7. Tests
