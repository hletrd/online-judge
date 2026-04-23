# Code Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** code-reviewer
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- `src/lib/assignments/submissions.ts` — Submission validation (verified cycle 45 fix)
- `src/lib/assignments/contest-scoring.ts` — Contest ranking
- `src/lib/assignments/contest-analytics.ts` — Contest analytics
- `src/lib/assignments/recruiting-invitations.ts` — Recruiting token flow
- `src/lib/assignments/leaderboard.ts` — Leaderboard freeze
- `src/lib/security/api-rate-limit.ts` — API rate limiting
- `src/lib/realtime/realtime-coordination.ts` — SSE connection management
- `src/app/api/v1/submissions/route.ts` — Submission creation
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE events
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts` — Anti-cheat events
- `src/app/(dashboard)/dashboard/contests/page.tsx` — Contests page
- `src/app/(dashboard)/dashboard/_components/candidate-dashboard.tsx` — Candidate dashboard
- `src/app/(public)/practice/page.tsx` — Practice page
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx` — Problem import
- `src/proxy.ts` — Auth proxy
- `src/lib/security/password-hash.ts` — Password hashing
- `src/lib/security/encryption.ts` — Encryption utilities

## Previously Fixed Items (Verified)

- `validateAssignmentSubmission` uses `getDbNowUncached()` for deadline enforcement: PASS (line 210)
- Non-null assertions replaced with null guards in client components: PASS (cycle 45)
- Map.get() non-null assertions replaced in contest-scoring, submissions, contest-analytics: PASS
- Submission rate-limit uses `getDbNowUncached()` for clock-skew consistency: PASS
- Contest join route has explicit `auth: true`: PASS

## New Findings

### CR-1: Non-null assertions on `Map.get()` in contests page — two instances [MEDIUM/MEDIUM]

**Files:**
1. `src/app/(dashboard)/dashboard/contests/page.tsx:109` — `statusMatchesFilter(statusMap.get(c.id)!, filter)`
2. `src/app/(dashboard)/dashboard/contests/page.tsx:178` — `const status = statusMap.get(contest.id)!;`

**Description:** The contests page builds a `statusMap` from the contests array and then uses non-null assertions to look up each contest's status. While the map is built from the same array being iterated, this pattern is inconsistent with the codebase's recent migration away from `!.get()` patterns (cycles 43-45 replaced these in contest-scoring.ts, submissions.ts, contest-analytics.ts, and multiple client components).

These are technically safe because the map is populated immediately before use from the same data source, but they are fragile — if a contest were removed between the map construction and the iteration (e.g., due to a React re-render), the assertion would throw.

**Fix:** Use optional chaining with a fallback:
```typescript
statusMatchesFilter(statusMap.get(c.id) ?? "closed", filter)
```

**Confidence:** Medium

---

### CR-2: Non-null assertion on `Map.get()` in candidate dashboard [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/_components/candidate-dashboard.tsx:595`

**Description:** `assignmentProblemProgressMap.get(assignment.assignmentId)!` is guarded by the conditional on line 588 that checks `.length`, which implies the map entry exists. This is technically safe but inconsistent with the codebase trend.

**Fix:** Use optional chaining with fallback:
```typescript
const problems = assignmentProblemProgressMap.get(assignment.assignmentId) ?? [];
```

**Confidence:** Low

---

### CR-3: Non-null assertion on `resolvedSearchParams!.sort` in practice page [LOW/LOW]

**File:** `src/app/(public)/practice/page.tsx:129`

**Description:** `resolvedSearchParams!.sort as SortOption` — the non-null assertion is used because the preceding `SORT_VALUES.includes()` check already validated the value is a valid sort option. However, the `!` assertion bypasses null/undefined checks even though `resolvedSearchParams` could be undefined (it's typed as `Promise<...> | undefined`).

The logic is technically safe because if `resolvedSearchParams` is undefined, the `includes` check returns false and the ternary falls through to `"number_asc"`. But the `!` is unnecessary and misleading.

**Fix:** Remove the `!` and use optional chaining:
```typescript
const currentSort: SortOption = SORT_VALUES.includes(resolvedSearchParams?.sort as SortOption)
  ? (resolvedSearchParams?.sort as SortOption)
  : "number_asc";
```

**Confidence:** Low

---

### CR-4: IOI leaderboard sort uses subtraction for floating-point scores — potential sort instability [LOW/LOW]

**File:** `src/lib/assignments/contest-scoring.ts:359`

**Description:** `entries.sort((a, b) => b.totalScore - a.totalScore)` uses subtraction for sorting IOI scores. While the scores are rounded to 2 decimal places (line 322), floating-point subtraction can still produce tiny non-zero differences for mathematically equal values (e.g., `80.03 - 80.03` could be `1.42e-14` instead of `0`). The `isScoreTied()` function at line 340 handles this for rank assignment, but the sort itself may place tied entries in a non-deterministic order.

This is cosmetic — tied entries get the same rank regardless of sort order. But it could cause the leaderboard order to change between requests for tied users, which may confuse students.

**Fix:** Add a secondary sort key (e.g., user ID) for deterministic tie-breaking:
```typescript
entries.sort((a, b) => b.totalScore - a.totalScore || a.userId.localeCompare(b.userId));
```

**Confidence:** Low
