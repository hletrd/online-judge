# Plan 07: UX Improvements

**Priority:** LOW to MEDIUM (feature work, not bugs)
**Effort:** Large (ongoing)
**Source:** Multi-perspective review (review.md), user perspective analysis

These are feature-level improvements identified across student, instructor,
TA, and job applicant perspectives. None are security bugs -- they are
prioritized by impact and effort.

Note: Autocompletion is intentionally excluded (by design, to assess syntax).
SQLite scaling is excluded (sufficient for internal use with few dozen students).

## Tier 1: High Impact, Low-Medium Effort

### 1.1 Custom test case execution (run without submit)

**Impact:** Highest-impact missing feature across ALL user perspectives.
**Effort:** Medium

```
Concept:
- Add a "Run" button alongside "Submit" on the problem page
- "Run" accepts custom stdin input, executes code, returns stdout/stderr
- Does NOT create a submission record, does NOT count toward rate limits
- Uses the same Docker sandbox but with a separate queue priority
- Results are ephemeral (not stored in DB)

Implementation outline:
- New API: POST /api/v1/problems/[id]/run
  - Accepts: { sourceCode, language, stdin }
  - Returns: { stdout, stderr, exitCode, executionTimeMs, memoryUsedKb }
  - Rate limit: separate, more generous (e.g., 10/minute)
- New judge claim type: "run" vs "judge"
- UI: split submit button into "Run" and "Submit"
- For exam mode: optionally disable custom runs (per-assignment toggle)
```

### 1.2 Exam countdown warnings

**Impact:** Important for exam/recruiting UX.
**Effort:** Low

```
File: src/components/exam/countdown-timer.tsx
- Add configurable warning thresholds (15min, 5min, 1min)
- Show toast/banner when threshold crossed
- Optional audio ping at 1 minute
- Visual indicator (color change: green -> yellow -> red)
```

### 1.3 Language selector UX

**Impact:** 88 languages in a flat dropdown is overwhelming.
**Effort:** Low

```
- Group by category (C/C++, Java, Python, JavaScript, etc.)
- Add search/filter input at top of dropdown
- Remember last-used language per user (already stored as preferredLanguage)
- Show "Recently Used" section at top
- Show language version in subtitle (e.g., "C++20" under "C++")
```

### 1.4 Bulk test case import

**Impact:** Major time-saver for instructors creating problems.
**Effort:** Medium

```
- Accept ZIP file with numbered input/output pairs:
  01.in, 01.out, 02.in, 02.out, ...
- Parse and preview before import
- Set visibility (all hidden by default, first N visible)
- Add to existing test cases or replace all
```

## Tier 2: Medium Impact, Medium Effort

### 2.1 Co-instructor / TA support

**Impact:** Critical for university use with TAs.
**Effort:** Medium

```
- New table: group_instructors (groupId, userId, role: "co_instructor" | "ta")
- TAs can view submissions, add comments, view analytics
- TAs cannot delete problems, modify system settings
- Co-instructors have full instructor access to the group
- Update canAccessGroup, canManageGroupResources to check group_instructors
```

### 2.2 Diff view for visible test cases

**Impact:** Better feedback for students.
**Effort:** Low-Medium

```
- When a test case is visible and result is wrong_answer:
  Show side-by-side diff of expected vs actual output
- Use a lightweight diff library (e.g., diff-match-patch or jsdiff)
- Only for visible test cases -- never reveal hidden expected output
```

### 2.3 Problem import/export

**Impact:** Important for problem sharing between instances/semesters.
**Effort:** Medium

```
Export format: JSON with test cases
  {
    title, description, timeLimitMs, memoryLimitMb,
    comparisonMode, tags: [...],
    testCases: [{ input, expectedOutput, isVisible, sortOrder }]
  }

Import: upload JSON, preview, create problem with test cases
Future: support Polygon/DOMjudge XML formats
```

### 2.4 Submission history within contest view

**Impact:** Students don't have to navigate away from contest.
**Effort:** Low

```
- Add a "My Submissions" tab in the contest page
- Filter submissions by assignmentId + userId
- Show verdict, score, time for each
- Link to full submission detail
```

## Tier 3: Lower Priority

### 3.1 Plagiarism report with side-by-side diff

```
- After similarity check, show flagged pairs
- Side-by-side source code view with highlighted similar regions
- Export report as PDF for academic integrity proceedings
```

### 3.2 Progress dashboard for students

```
- "You've solved 15/30 problems"
- Acceptance rate, average score, language distribution
- Personal statistics over time
```

### 3.3 Submission comments: line-level annotations

```
- Allow instructors/TAs to annotate specific lines
- Inline comment bubbles in the code viewer
- Much richer feedback than submission-level comments
```

### 3.4 Recruiter dashboard

```
- View all candidates for a test, sorted by score
- Per-candidate report: scores, time spent, languages used
- Compare candidates side-by-side
- Export as CSV/PDF
```

### 3.5 Email notifications

```
- Invite candidates via email with access link
- Notify instructors when all students have submitted
- Optional: email students their results after contest ends
```

## Not planned (intentional exclusions)

- **Autocompletion in editor** -- intentional, to assess syntax knowledge
- **SQLite horizontal scaling** -- sufficient for internal use
- **AI plugin key encryption** -- deferred, requires key backup coordination
- **Default admin password hardening** -- irrelevant, changed immediately on setup
- **LMS integration** (Canvas/Moodle) -- out of scope for now
- **Special judge / interactive problems** -- significant architecture change

## Progress (2026-04-04)

### Tier 1
- [x] 1.1 Custom test case execution (run without submit) -- Run button alongside Submit, collapsible stdin, inline result display
- [x] 1.2 Exam countdown warnings -- implemented with configurable thresholds and color transitions
- [x] 1.3 Language selector UX -- implemented with search, grouping, and recently-used section
- [x] 1.4 Bulk test case import -- ZIP import with numbered pairs (01.in/01.out), appends to existing test cases

### Tier 2
- [x] 2.1 Co-instructor / TA support -- group_instructors table, API, UI for managing co-instructors and TAs per group
- [x] 2.2 Diff view for visible test cases -- side-by-side expected vs actual output for visible wrong_answer test cases
- [x] 2.3 Problem import/export -- JSON export/import with test cases and tags, UI buttons on problem pages
- [x] 2.4 Submission history within contest view -- implemented with per-user filtering

### Tier 3
- [x] 3.1 Plagiarism report -- flagged pairs table in anti-cheat dashboard with similarity percentages and user names
- [x] 3.2 Progress dashboard for students -- solved/attempted count, acceptance rate, language distribution on student dashboard
- [x] 3.3 Line-level submission comments -- lineNumber column, L# badges, targeted comment input with line context
- [x] 3.4 Recruiter candidates panel -- sortable candidates table with search, CSV export, anti-cheat flag counts
- [ ] 3.5 Email notifications -- not implemented (requires email service integration, deferred)

**Status: COMPLETE (12/13 items implemented, email notifications deferred)**
