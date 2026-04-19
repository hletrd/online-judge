# Cycle 18 (Second Pass) Review Remediation Plan

**Date:** 2026-04-19
**Source:** `.context/reviews/_aggregate.md` (second-pass multi-agent review), `.context/reviews/cycle-18-code-reviewer.md`, `cycle-18-security-reviewer.md`, `cycle-18-perf-reviewer.md`, `cycle-18-architect.md`, `cycle-18-test-engineer.md`, `cycle-18-debugger.md`, `cycle-18-critic.md`
**Status:** COMPLETE

---

## MEDIUM Priority

### M1: Add React `cache()` wrapper to `getRecruitingAccessContext` — eliminate N+1 DB queries

- **From:** AGG-1 (code-reviewer F1, perf-reviewer F1, architect F1, security-reviewer F2, critic)
- **Files:** `src/lib/recruiting/access.ts:14-66`
- **Status:** DONE (commit 02f053b3)
- **Plan:**
  1. Import `cache` from `react`
  2. Wrap `loadRecruitingAccessContext` with `cache()` so that repeated calls within the same server component render return the cached result
  3. Export the cached version as `getRecruitingAccessContext` (keeping the same API)
  4. Export `isRecruitingCandidateUser` using the same cached function
  5. Verify that all 15+ call sites still work correctly (no API change needed)
  6. Add a comment explaining the caching behavior and that `cache()` is request-scoped in React Server Components
- **Exit criterion:** `getRecruitingAccessContext` is memoized per-request via React `cache()`. Dashboard page loads for recruiting candidates no longer trigger duplicate DB queries.

### M2: Optimize `import-transfer.ts` to use buffer-based accumulation — reduce OOM risk

- **From:** AGG-2 (code-reviewer F2, debugger F1)
- **Files:** `src/lib/db/import-transfer.ts:8-25`
- **Status:** DONE (commit 2897da5f)
- **Plan:**
  1. In `readUploadedJsonFileWithLimit`: replace the streaming read with `file.arrayBuffer()` since `file.size` is already validated. Decode the buffer once and parse.
  2. In `readStreamTextWithLimit` (used by `readJsonBodyWithLimit`): replace string concatenation with `Uint8Array` accumulation. Collect chunks in an array, then concatenate once at the end using `Buffer.concat()`, then decode.
  3. This avoids: (a) intermediate string allocations during concatenation, (b) UTF-16 doubling of memory for multi-byte content, (c) peak memory being 3x the upload size
  4. Verify both the file-upload and JSON-body import paths still work
- **Exit criterion:** `readUploadedJsonFileWithLimit` uses `file.arrayBuffer()` instead of streaming. `readStreamTextWithLimit` uses buffer-based accumulation. Peak memory for a 100 MB upload is ~100 MB (not 300 MB).

---

## LOW Priority

### L1: Add `needsRehash` handling to admin backup and export routes

- **From:** AGG-3 (security-reviewer F1)
- **Files:** `src/app/api/v1/admin/backup/route.ts:62`, `src/app/api/v1/admin/migrate/export/route.ts:56`
- **Status:** DONE (commit aa4992c0)
- **Plan:**
  1. In both routes, change `const { valid } = await verifyPassword(...)` to `const { valid, needsRehash } = await verifyPassword(...)`
  2. After the `if (!valid)` check, add rehash logic:
     ```ts
     if (needsRehash) {
       try {
         const newHash = await hashPassword(password);
         await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
       } catch (err) {
         logger.error({ err, userId: user.id }, "[admin] Failed to rehash password during backup/export");
       }
     }
     ```
  3. The restore and import routes are lower priority since they run infrequently — defer those
- **Exit criterion:** Admin backup and export routes rehash bcrypt passwords to argon2id on successful verification.

### L2: Add deprecation log message to `/api/internal/cleanup` cron endpoint

- **From:** AGG-6 (critic F1)
- **Files:** `src/app/api/internal/cleanup/route.ts:23`
- **Status:** DONE (commit 79e21a53, combined with L3)
- **Plan:**
  1. Add a `logger.info` call before `cleanupOldEvents()` noting that the endpoint is deprecated and operators should rely on the in-process pruners
  2. The deprecation JSDoc on `cleanupOldEvents()` is already in place — just need the runtime log message
- **Exit criterion:** Calling `/api/internal/cleanup` logs a deprecation message.

### L3: Add rate limiting to `/api/internal/cleanup` endpoint

- **From:** AGG-8 (security-reviewer F3)
- **Files:** `src/app/api/internal/cleanup/route.ts`
- **Status:** DONE (commit 79e21a53, combined with L2)
- **Plan:**
  1. Import `consumeApiRateLimit` from `@/lib/security/api-rate-limit`
  2. Add rate limit check after auth validation, before `cleanupOldEvents()`
  3. Use endpoint key `"internal:cleanup"` with a low max (e.g., 10 requests per minute)
- **Exit criterion:** Internal cleanup endpoint has rate limiting as defense-in-depth against secret leaks.

### L4: Continue workspace-to-public migration Phase 3 — slim down `AppSidebar`

- **From:** Workspace-to-public migration plan Phase 3 remaining items, architect F3
- **Files:** `src/components/layout/app-sidebar.tsx`
- **Status:** DONE (commit 9a2acc35)
- **Plan:**
  1. Remove contests and rankings from AppSidebar since they are already in the PublicHeader dropdown
  2. Keep remaining items (problems, submissions, compiler, groups, problem sets, admin)
  3. This reduces visual clutter and makes the dual-navigation less confusing
  4. Verify type check and lint pass
- **Exit criterion:** AppSidebar no longer shows contests and rankings (available in PublicHeader instead).

---

## Workspace-to-Public Migration Progress

- Phase 1: COMPLETE
- Phase 2: COMPLETE
- Phase 3: IN PROGRESS (this cycle: L4 — slim down AppSidebar)
- Phase 4: PENDING (deferred — route consolidation)

---

## Deferred Items

| Finding | Severity | Reason | Exit Criterion |
|---------|----------|--------|----------------|
| AGG-4 (admin route DRY violation) | LOW | All routes work correctly; refactoring is a nice-to-have cleanup | Next time admin routes are significantly modified |
| AGG-5 (updateRecruitingInvitation uses JS new Date()) | LOW | Only affects distributed deployments with unsynchronized clocks; most deployments run single-server | Re-open if distributed deployment is implemented |
| AGG-7 (contest-analytics progression raw scores) | LOW | Already documented in code comments; behavior is intentional for raw score trajectory | Re-open if users report confusion about score discrepancy |
| Restore/import needsRehash | LOW | These routes run infrequently; admins typically also use the main login flow | Next time these routes are significantly modified |
