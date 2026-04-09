# Plan 01: Fix Authorization & Custom Roles System

**Priority:** CRITICAL
**Effort:** Medium (2-3 days)
**Source findings:** SEC-C2, SEC-H2, SEC-H3, SEC-M1, SEC-M2, DB-M3 (first review)

## Problem

The custom role system is fundamentally broken. Two parallel authorization
systems exist:

1. **Sync level-based:** `isAdmin(role)`, `isInstructor(role)` -- checks 4 hardcoded role strings via `ROLE_LEVEL`
2. **Async capability-based:** `resolveCapabilities(role)` -- reads from `roles` table

The vast majority of route handlers use the sync system. Custom roles always
get level `-1` and fail. The capability system exists but is never consulted
in most code paths. This means custom TA/grader roles are non-functional.

## Scope

### Files to modify

| File | Changes |
|------|---------|
| `src/lib/api/auth.ts` | Update `isAdmin`, `isInstructor` to be capability-aware |
| `src/lib/assignments/submissions.ts:274-298` | `canViewAssignmentSubmissions` -- add capability fallback |
| `src/app/api/v1/submissions/[id]/route.ts:58` | Replace `isPrivileged` string check with capability check |
| `src/app/api/v1/submissions/[id]/events/route.ts:72` | Same as above |
| `src/lib/assignments/management.ts:23-31` | `canManageGroupResources` -- add capability fallback |
| `src/app/api/v1/groups/[id]/assignments/[assignmentId]/exam-session/route.ts:92-95` | Restrict `userId` override to group owner |
| `src/lib/capabilities/cache.ts:14-15,59-67` | Add 60s TTL to role cache |

### Implementation steps

**Step 1: Add TTL to role cache**
```
File: src/lib/capabilities/cache.ts
- Add `roleCacheLoadedAt` timestamp
- In `ensureLoaded()`, check if cache is older than 60s
- If expired, set roleCache = null to force reload
```

**Step 2: Create async-aware auth helpers**

Option A (recommended): Make existing helpers async + capability-aware.
```
File: src/lib/api/auth.ts
- isAdmin(role) stays sync for backwards compat (built-in roles only)
- Add isAdminAsync(role): checks isAdmin(role) || caps.has("system.settings")
- Add isInstructorAsync(role): checks isInstructor(role) || caps.has("problems.create")
- Add hasCapability(role, cap): resolves capabilities and checks
```

Option B: Add a `resolvedLevel(role)` function that queries the role table
for custom roles and returns the correct level.

**Step 3: Update submission access checks**
```
File: src/app/api/v1/submissions/[id]/route.ts
- Replace: const isPrivileged = role === "admin" || role === "super_admin" || role === "instructor"
- With: const canViewSource = (await resolveCapabilities(user.role)).has("submissions.view_source")

File: src/app/api/v1/submissions/[id]/events/route.ts
- Same change

File: src/lib/assignments/submissions.ts:274-298
- Add capability fallback: if (!isAdmin(role) && !caps.has("submissions.view_all")) return false
```

**Step 4: Update group management checks**
```
File: src/lib/assignments/management.ts:23-31
- canManageGroupResources: add caps.has("assignments.edit") fallback

File: src/app/api/v1/groups/[id]/assignments/[assignmentId]/exam-session/route.ts
- Only allow userId override for group owner or admin, not any instructor enrolled as student
```

**Step 5: Handle instructor deletion (DB-M3 from first review)**

Design decision: Block deletion when instructor owns groups.
```
File: src/lib/actions/user-management.ts (deleteUserPermanently)
- Before deletion, check if user owns any groups
- If yes, return error "instructorOwnsGroups" with list of group names
- Admin must reassign or delete those groups first
```

## Testing

- Unit test: custom role with `submissions.view_source` can access source code
- Unit test: custom role without `submissions.view_source` cannot
- Unit test: custom role with `assignments.edit` can manage assignments
- Unit test: role cache expires after 60s and reloads
- Integration test: create custom TA role, assign to user, verify access
- Regression test: built-in roles still work identically

## Progress (2026-03-28)

- [x] Step 1: Role cache TTL (60s) -- commit `7305b4c`
- [x] Step 2: Chose Option A (async capability-aware helpers)
- [x] Step 3: Capability-aware submission source code gating -- commit `7305b4c`
- [x] Step 4: Capability-aware group management + exam session scoping -- commit `7305b4c`
- [x] Step 5: Instructor deletion guard (DB-M3) -- commit `7305b4c`

**Status: COMPLETE**
