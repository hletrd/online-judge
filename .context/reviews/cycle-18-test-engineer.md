# Cycle 18 Test Engineer Findings

**Date:** 2026-04-19
**Reviewer:** Test coverage gaps, flaky tests, TDD opportunities
**Base commit:** 7c1b65cc

---

## Findings

### F1: No test coverage for `getRecruitingAccessContext` caching/deduplication

- **File**: `src/lib/recruiting/access.ts:14-66`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: There are no unit tests for `getRecruitingAccessContext` or `isRecruitingCandidateUser`. These functions are called from 15+ locations and perform DB queries. If a caching layer is added (as recommended by the code reviewer and architect), tests should verify that the cache works correctly and that stale data is not returned after invitation status changes.
- **Suggested fix**: Add unit tests that verify: (1) the function returns correct results for users with and without recruiting invitations, (2) when a caching layer is added, the cache is hit on repeated calls within the same request, (3) the cache is invalidated when invitation status changes.

### F2: No test coverage for admin backup/restore `needsRehash` handling

- **File**: `src/app/api/v1/admin/backup/route.ts:62`, `src/app/api/v1/admin/restore/route.ts:56`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: The admin backup and restore routes verify the user's password but discard `needsRehash`. If rehash logic is added in the future (as recommended by the security reviewer), tests should verify that the rehash occurs after successful password verification on these routes.
- **Suggested fix**: Add integration tests that verify: (1) a bcrypt-hashed admin can successfully download a backup, (2) if rehash is implemented, the hash is upgraded after backup password verification.

### F3: No test for `db/cleanup.ts` legal hold behavior

- **File**: `src/lib/db/cleanup.ts:25-31`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: While the legal hold check was added in a previous cycle fix, there is no automated test verifying that `cleanupOldEvents()` returns early when `DATA_RETENTION_LEGAL_HOLD` is true. This is a compliance-critical behavior that should have automated coverage.
- **Suggested fix**: Add a unit test that mocks `DATA_RETENTION_LEGAL_HOLD` and verifies `cleanupOldEvents()` returns `{ auditDeleted: 0, loginDeleted: 0 }` without executing any DELETE queries.

---

## Verified Safe

### VS1: Existing test suite covers core recruiting invitation flows
- `tests/unit/api/recruiting-invitations-race-implementation.test.ts` covers concurrent redemption.

### VS2: Existing test suite covers sign-out storage cleanup
- `tests/unit/hooks/use-source-draft.test.ts` and related tests verify draft storage.

### VS3: Contest scoring tests exist
- `tests/unit/assignments/scoring.test.ts` covers scoring logic.
