# Cycle 6 Tracer Review

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### TR-1: Contest detail page temporal comparison — tracing the causal chain [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188-192`
**Description:** Tracing the flow:
1. User navigates to `/dashboard/contests/[assignmentId]`
2. Server component fetches assignment data from DB
3. `const now = new Date()` captures app-server time (line 188)
4. `isUpcoming` and `isPast` computed with app-server time (lines 189-192)
5. These flags control which tabs/content are rendered
6. If `isUpcoming` is true, the contest problems are hidden

Competing hypothesis: Is this actually a security issue or just cosmetic?
- **Hypothesis A (security):** In a proctored exam, seeing problems early gives an unfair advantage. The `isUpcoming` flag directly controls problem visibility. This IS security-relevant.
- **Hypothesis B (cosmetic):** The actual submission is enforced by API routes using DB time. Students can't submit early even if they see problems.

**Verdict:** Hypothesis A is correct for exam integrity. Seeing problems early allows students to prepare solutions in advance, even if they can't submit until the exam starts. This undermines exam fairness.
**Fix:** Use `getDbNow()` for temporal comparisons.
**Confidence:** HIGH

### TR-2: Quick-create contest `startsAt` — stored value vs enforcement mismatch [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/quick-create/route.ts:28-32`
**Description:** Tracing the flow:
1. Admin calls quick-create without `startsAt`
2. `const now = new Date()` captures app-server time (line 28)
3. `startsAt = now` is stored in the DB (line 29)
4. Exam session enforcement uses `SELECT NOW()` within transaction
5. Submission deadline check uses `NOW()` in SQL

The stored `startsAt` is from the app server clock. All enforcement uses the DB clock. If the clocks diverge, the intended schedule and the enforced schedule differ.
**Fix:** Use `getDbNowUncached()` for default `startsAt`.
**Confidence:** MEDIUM
