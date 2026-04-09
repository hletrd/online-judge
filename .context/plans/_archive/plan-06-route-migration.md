# Plan 06: Migrate Routes to `createApiHandler`

**Priority:** MEDIUM (tech debt, reduces security surface area)
**Effort:** Large (3-5 days, mechanical but many files)
**Source findings:** QUAL-H1 (first review), 34 routes listed in Phase 3

## Problem

34 API routes use manual auth/CSRF/rate-limit wiring instead of the
`createApiHandler` wrapper. This means:
- Security middleware order varies between routes
- New security requirements must be patched in 34+ places
- Body validation via Zod is inconsistent
- Error handling patterns differ

## Approach

Migrate in batches by domain. Each migration:
1. Replace manual `getApiUser` + `csrfForbidden` + `consumeApiRateLimit` with
   `createApiHandler({ auth: "required", schema: ... })`
2. Move body parsing into the `schema` option
3. Standardize error responses through `apiError`
4. Test each batch before proceeding

For routes needing raw response types (SSE, file download), extend
`createApiHandler` with a `rawResponse: true` option that skips
`apiSuccess()` wrapping.

## Migration Batches

### Batch 1: Contest routes (8 routes)

```
- src/app/api/v1/contests/join/route.ts
- src/app/api/v1/contests/[assignmentId]/leaderboard/route.ts
- src/app/api/v1/contests/[assignmentId]/access-code/route.ts
- src/app/api/v1/contests/[assignmentId]/export/route.ts
- src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts
- src/app/api/v1/contests/[assignmentId]/analytics/route.ts
- src/app/api/v1/contests/[assignmentId]/invite/route.ts
- src/app/api/v1/contests/[assignmentId]/similarity-check/route.ts
```

### Batch 2: Submission routes (5 routes)

```
- src/app/api/v1/submissions/route.ts
- src/app/api/v1/submissions/[id]/route.ts
- src/app/api/v1/submissions/[id]/rejudge/route.ts
- src/app/api/v1/submissions/[id]/comments/route.ts
- src/app/api/v1/submissions/[id]/events/route.ts (SSE -- needs rawResponse)
```

### Batch 3: Admin routes (10 routes)

```
- src/app/api/v1/admin/workers/route.ts
- src/app/api/v1/admin/workers/[id]/route.ts
- src/app/api/v1/admin/workers/stats/route.ts
- src/app/api/v1/admin/backup/route.ts (file download -- needs rawResponse)
- src/app/api/v1/admin/restore/route.ts (file upload -- needs rawResponse)
- src/app/api/v1/admin/chat-logs/route.ts
- src/app/api/v1/admin/roles/route.ts
- src/app/api/v1/admin/roles/[id]/route.ts
- src/app/api/v1/admin/docker/images/route.ts
- src/app/api/v1/admin/docker/images/build/route.ts
```

### Batch 4: User routes (3 routes)

```
- src/app/api/v1/users/route.ts
- src/app/api/v1/users/[id]/route.ts
- src/app/api/v1/users/bulk/route.ts
```

### Batch 5: Group & Problem routes (6 routes)

```
- src/app/api/v1/groups/[id]/route.ts
- src/app/api/v1/groups/[id]/members/route.ts
- src/app/api/v1/groups/[id]/members/[userId]/route.ts
- src/app/api/v1/groups/[id]/members/bulk/route.ts
- src/app/api/v1/problems/route.ts
- src/app/api/v1/problems/[id]/route.ts
```

### Batch 6: Plugin routes (2 routes)

```
- src/app/api/v1/plugins/chat-widget/chat/route.ts
- src/app/api/v1/plugins/chat-widget/test-connection/route.ts
```

## Prerequisites

Before starting migration, extend `createApiHandler`:

```
File: src/lib/api/handler.ts

Add options:
  - rawResponse?: boolean  // skip apiSuccess wrapping, handler returns Response directly
  - fileUpload?: boolean   // skip JSON body parsing for multipart/form-data
  - capability?: string    // require specific capability instead of just auth
  - rateLimit?: { key: string, max: number, windowMs: number }
```

## Per-Route Migration Pattern

```typescript
// BEFORE (manual wiring):
export async function POST(request: NextRequest) {
  const csrfError = csrfForbidden(request);
  if (csrfError) return csrfError;
  const user = await getApiUser(request);
  if (!user) return unauthorized();
  const body = await request.json();
  // ... handler logic ...
  return NextResponse.json({ ... });
}

// AFTER (createApiHandler):
export const POST = createApiHandler({
  auth: "required",
  schema: myZodSchema,
  handler: async ({ user, body, request }) => {
    // ... handler logic ...
    return apiSuccess({ ... });
  },
});
```

## Testing

- After each batch, run the full test suite
- Verify CSRF is applied on all mutation methods
- Verify rate limiting is applied
- Verify error responses are consistent
- Spot-check 2-3 routes per batch manually

## Progress (2026-04-04)

- [x] Prerequisites: createApiHandler extended with rateLimit, rawResponse, fileUpload, capability options
- [x] Batch 1: Contest routes (8 routes) migrated to createApiHandler
- [x] Batch 2: Submission routes (5 routes) migrated to createApiHandler
- [x] Batch 3: Admin routes (10 routes) migrated to createApiHandler
- [x] Batch 4: User routes (3 routes) migrated to createApiHandler
- [x] Batch 5: Group & Problem routes (6 routes) migrated to createApiHandler
- [x] Batch 6: Plugin routes (2 routes) migrated to createApiHandler

**Status: COMPLETE**
