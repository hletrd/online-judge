# Critic Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** critic

## F1 — User-injected TODO #2 (UntrustedHost) was marked "Done" in cycle 1 but the live site still shows the error
- **Severity:** HIGH | **Confidence:** HIGH
- **File:** `plans/open/2026-04-19-cycle-2-review-remediation.md:86` (status: Done, commit: 5353f41f)
- The plan claims AUTH-01 is "Done" with commit `5353f41f`, but the user's injected TODO explicitly says login still shows `{"error":"UntrustedHost"}` on algo.xylolabs.com. Either the fix was not deployed, or the fix was insufficient (the `shouldTrustAuthHost()` check was added to `validateTrustedAuthHost` but the production environment may not have `AUTH_TRUST_HOST=true` set, or the `x-forwarded-host` header is being stripped before reaching the auth route).
- **Fix:** Verify that the deployed production `.env` has `AUTH_TRUST_HOST=true` and that nginx passes `x-forwarded-host` to the Next.js app container on auth routes. The code fix alone is insufficient if the env var is not set.

## F2 — Workspace-to-public migration (User TODO #3) is underspecified and high-risk
- **Severity:** MEDIUM | **Confidence:** HIGH
- **Files:** `src/app/(workspace)/`, `src/app/(control)/`, `src/components/layout/workspace-nav.tsx`
- The workspace pages redirect to `/dashboard` and the control pages are thin wrappers. Merging these into public pages with a new top navbar is a large architectural change that touches routing, layout, navigation, and authorization. The user TODO says "plan it, don't try to implement everything in one cycle" but the risk of partial implementation breaking existing workflows is high.
- **Fix:** Create a detailed migration plan with: (1) inventory of all workspace/control pages, (2) authorization requirements for each, (3) new layout wireframes, (4) phased migration order. Do not implement until the plan is reviewed.

## F3 — Duplicate CSV escaping logic is a maintenance trap
- **Severity:** LOW | **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:32-41`, `src/app/api/v1/admin/login-logs/route.ts:19-28`
- Identical `escapeCsvField` function defined in two files. If a CSV injection vulnerability is found, both must be patched simultaneously.
- **Fix:** Extract to shared utility.

## F4 — `Number()` NaN issue in admin routes was missed during cycle 1 fix
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:47-48`, `src/app/api/v1/admin/login-logs/route.ts:34-35`
- The tags route NaN bug was fixed in cycle 1 (AGG-1), but the same bug pattern in two admin routes was not caught. This suggests the fix should have been a shared `parsePositiveInt` utility rather than per-route fixes.
- **Fix:** Create a shared `parsePositiveInt(value, defaultValue)` utility and use it in all query-param parsing locations.

## F5 — Chat widget tool execution error handling was added but still has edge case
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:425-434`
- The tool execution is now wrapped in try/catch (fixing cycle 1 AGG-2), but if `executeTool` returns a very large string (e.g., a full problem description), it gets pushed into `fullMessages` which could cause memory issues in subsequent LLM API calls.
- **Fix:** Truncate tool results to a maximum length (e.g., 4000 characters) before pushing to the message array.
