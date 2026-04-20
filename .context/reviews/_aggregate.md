# Cycle 8 Aggregate Review

**Date:** 2026-04-20
**Base commit:** ddffef18
**Review artifacts:** `cycle-8-code-reviewer.md`, `cycle-8-security-reviewer.md`, `cycle-8-perf-reviewer.md`, `cycle-8-architect.md`, `cycle-8-critic.md`, `cycle-8-debugger.md`, `cycle-8-verifier.md`, `cycle-8-test-engineer.md`, `cycle-8-tracer.md`, `cycle-8-designer.md`, `cycle-8-document-specialist.md`

## Deduped Findings (sorted by severity then signal)

### AGG-1: Exam submission `submittedAt` uses `new Date()` while deadline check uses SQL `NOW()` — direct clock-skew bug [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1 partial), critic (CRI-3), debugger (DBG-1), tracer (TR-1), verifier (V-1), test-engineer (TE-1)
**Files:** `src/app/api/v1/submissions/route.ts:317`
**Description:** The submission creation route performs exam deadline checks using SQL `NOW()` (authoritative DB time) inside a transaction, then writes `submittedAt: new Date()` using app server time. If the app server clock drifts ahead of the DB clock, a submission that passes the deadline check could have a `submittedAt` timestamp after the deadline. This directly undermines exam integrity — the most critical time-sensitive domain in the application.
**Concrete failure scenario:** Exam deadline is 11:59 PM DB time. Student submits at 11:58 PM DB time. App server clock is 2 minutes ahead, recording `submittedAt` as 12:00 AM. The submission appears late in audit queries despite being accepted by the deadline check.
**Fix:** Replace `submittedAt: new Date()` with `submittedAt: await getDbNowUncached()` to ensure consistency with the SQL `NOW()` deadline check.

### AGG-2: Judge poll route `judgeClaimedAt` and `judgedAt` use `new Date()` — clock-skew inconsistency with DB-time migration [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1), debugger (DBG-2), verifier (V-2), test-engineer (TE-2)
**Files:** `src/app/api/v1/judge/poll/route.ts:75,142`
**Description:** The judge poll route sets `judgeClaimedAt: new Date()` and `judgedAt: new Date()` using app server time. These timestamps are used in submission ordering and contest result queries. The broader codebase has migrated high-priority timestamps to `getDbNowUncached()`, making these remaining `new Date()` calls inconsistent.
**Concrete failure scenario:** A contest submission is judged at 11:59 PM DB time, but the app server clock is 2 minutes ahead, recording `judgedAt` as 12:01 AM. This could incorrectly make the submission appear late in contest results.
**Fix:** Replace `new Date()` with `await getDbNowUncached()` for both `judgeClaimedAt` and `judgedAt`.

### AGG-3: Judge heartbeat uses `new Date()` for `lastHeartbeatAt` and staleness calculation [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-7), security-reviewer (SEC-2)
**Files:** `src/app/api/v1/judge/heartbeat/route.ts:39,72-82`
**Description:** The heartbeat route writes `lastHeartbeatAt: new Date()` and computes staleness threshold using `Date.now()`. Both use app server time, so they are internally consistent. However, if other code queries `lastHeartbeatAt` and compares it with DB time (e.g., in a monitoring dashboard or admin query), the mixed time sources could cause inconsistencies.
**Concrete failure scenario:** A monitoring query uses `NOW() - lastHeartbeatAt` to compute worker age. If the app clock is 2 minutes behind DB time, the worker appears 2 minutes younger than expected.
**Fix:** Use `await getDbNowUncached()` for `lastHeartbeatAt` and compute staleness threshold from the same DB time.

### AGG-4: Group enrollment `enrolledAt` uses inconsistent time source between invite and manual enrollment [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-6), security-reviewer (SEC-3), tracer (TR-2)
**Files:** `src/app/api/v1/groups/[id]/members/route.ts:105`
**Description:** Manual group enrollment uses `enrolledAt: new Date()`, while the invite route uses `getDbNowUncached()` for the same column. This creates inconsistent timestamps in the same database column depending on the enrollment path.
**Concrete failure scenario:** An enrollment audit query orders by `enrolledAt` and shows a manual enrollment occurring before an invite enrollment that actually happened first, due to clock skew.
**Fix:** Use `await getDbNowUncached()` for `enrolledAt` in the manual enrollment route.

### AGG-5: Judge deregister uses `new Date()` for `deregisteredAt` [LOW/LOW]

**Flagged by:** code-reviewer (CR-2)
**Files:** `src/app/api/v1/judge/deregister/route.ts:50`
**Description:** `deregisteredAt: new Date()` uses the app server clock. While this timestamp is not used in access control comparisons, it could be compared with `lastHeartbeatAt` for worker lifecycle analysis.
**Fix:** Use `await getDbNowUncached()` for consistency with the broader migration.

### AGG-6: Community thread moderation timestamps use `new Date()` [LOW/LOW]

**Flagged by:** code-reviewer (CR-3), security-reviewer (SEC-4), debugger (DBG-3)
**Files:** `src/app/api/v1/community/threads/[id]/route.ts:41-43`, `src/app/api/v1/community/threads/[id]/posts/route.ts:52`
**Description:** `lockedAt`, `pinnedAt`, `updatedAt` use `new Date()`. These are moderation timestamps with no security implications.
**Fix:** Use `await getDbNowUncached()` for consistency.

### AGG-7: User creation, role creation, and other `createdAt`/`updatedAt` fields use `new Date()` [LOW/LOW]

**Flagged by:** code-reviewer (CR-4, CR-5, CR-8)
**Files:** `src/app/api/v1/users/route.ts:126-127`, `src/app/api/v1/users/bulk/route.ts:126-127`, `src/lib/problem-sets/management.ts:85,108,164`, `src/app/api/v1/admin/roles/route.ts:74,97-98`
**Description:** Creation and update timestamps for users, problem sets, and roles use `new Date()`. These are write-once timestamps with no temporal comparison usage.
**Fix:** Use `await getDbNowUncached()` for consistency with the migration pattern. Low priority.

### AGG-8: Stale plan statuses in cycles 7, 24, and 25 — items marked TODO are already done in code [LOW/HIGH]

**Flagged by:** architect (ARCH-2), critic (CRI-2), verifier (V-3, V-4), document-specialist (DOC-1 through DOC-4)
**Files:** `plans/open/2026-04-20-cycle-7-review-remediation.md`, `plans/open/2026-04-20-cycle-24-review-remediation.md`, `plans/open/2026-04-20-cycle-25-review-remediation.md`
**Description:** Multiple plan items show TODO status but the code already has the fixes:
- Cycle 7 M3 (invite route clock-skew): DONE in code (commit 598f52c9)
- Cycle 7 L1 (tests for tokenInvalidatedAt): may be DONE (commit f149c200)
- Cycle 24 M2 (remove /workspace from public-route-seo.ts): DONE in code
- Cycle 25 M2 (Korean letter-spacing): DONE in code (progress log confirms)
Plans where all items are DONE should be archived.
**Fix:** Update plan statuses and archive completed plans.

### AGG-9: Prior cycle 22 AGG-1 (`PaginationControls` outage) was a false positive [INFO/HIGH]

**Flagged by:** architect (ARCH-3), designer (DES-2), verifier (V-4 partial)
**Files:** `src/components/pagination-controls.tsx`
**Description:** The cycle 22 aggregate review claimed that `PaginationControls` was an invalid async client component marked with `"use client"`. Code inspection confirms it has NO `"use client"` directive and is a valid async server component using `getTranslations` from `next-intl/server`. The `/practice` and `/rankings` outages reported in cycle 22 were likely caused by a different issue (stale `nav.workspace` key or deployment artifact) that has since been resolved.
**Fix:** No code change needed. Document as resolved / false positive.

## Verified Safe / No Regression Found

- Auth flow is robust with Argon2id, timing-safe dummy hash, rate limiting, and proper token invalidation.
- HTML sanitization uses DOMPurify with strict tag/attribute allowlists, URI regexp blocking, auto-rel=noopener.
- No `innerHTML` assignments, `as any` casts, `@ts-ignore`, or unsanitized SQL queries.
- Only 2 eslint-disable directives, both with justification comments.
- SSE `viewerId` capture fix confirmed at line 198.
- All Korean letter-spacing remediation is complete and consistent.
- The workspace-to-public migration is complete: no `/workspace` references in source, SEO config, or robots.txt.
- Navigation is centralized via shared `public-nav.ts`.

## Agent Failures

None. All 11 review perspectives completed successfully.
