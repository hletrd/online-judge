# Cycle 14 Verifier Report

**Base commit:** 74d403a6
**Reviewer:** verifier
**Scope:** Evidence-based correctness check — verify stated behavior matches actual code

---

## CR14-V1 — [MEDIUM] `mapTokenToSession` uses `(session.user as Record<string, unknown>)[field]` — unsafe cast that bypasses TypeScript's session type

- **Confidence:** HIGH
- **Files:** `src/lib/auth/config.ts:148-158`
- **Evidence:** The `mapTokenToSession` function casts `session.user` to `Record<string, unknown>` to set preference fields dynamically. This bypasses the TypeScript `DefaultSession` type, which only defines `id`, `name`, `email`, `image`. The preference fields (preferredLanguage, preferredTheme, etc.) are not in the type definition. This means TypeScript will not catch typos or missing fields in session access elsewhere in the codebase. The code works correctly at runtime, but the type safety is eroded.
- **Suggested fix:** Extend the NextAuth `Session` type declaration to include all preference fields from `AUTH_PREFERENCE_FIELDS`. This way, `session.user.preferredLanguage` would be properly typed without unsafe casts.

## CR14-V2 — [MEDIUM] `AUTH_PREFERENCE_FIELDS` in `types.ts` does not include `mustChangePassword` — but it's treated differently in `mapTokenToSession`

- **Confidence:** MEDIUM
- **Files:** `src/lib/auth/types.ts:8-19`, `src/lib/auth/config.ts:134-158`
- **Evidence:** `AUTH_PREFERENCE_FIELDS` lists 10 preference fields (preferredLanguage through lectureColorScheme). `mustChangePassword` is NOT in this list — it's handled as a core field with explicit assignment at line 137. This is correct behavior (mustChangePassword is not a preference, it's a security field). However, the `AUTH_TOKEN_FIELDS` in `session-security.ts` (line 45-57) includes `mustChangePassword` alongside `AUTH_PREFERENCE_FIELDS`. The distinction between "core" and "preference" fields is clear in the code, but there's no comment in `AUTH_PREFERENCE_FIELDS` explaining why `mustChangePassword` is excluded.
- **Suggested fix:** Add a comment in `AUTH_PREFERENCE_FIELDS` explaining that `mustChangePassword` is intentionally excluded because it's a security field, not a user preference.

## CR14-V3 — [LOW] `getActiveAuthUserById` returns `role` as `UserRole` via cast — but the DB column accepts any string (custom roles)

- **Confidence:** MEDIUM
- **Files:** `src/lib/api/auth.ts:52`
- **Evidence:** `role: user.role as UserRole` casts the DB string to `UserRole` (a union type of 5 built-in roles). If a custom role exists in the DB (e.g., "teaching_assistant"), this cast silently passes it as `UserRole`, which is technically incorrect. Downstream code that pattern-matches on `UserRole` won't match custom roles. This is a known tradeoff — the `UserRole` type should probably be `string` in API auth contexts.
- **Suggested fix:** Change the return type to use `string` for `role` in the `getActiveAuthUserById` return type, or use a branded type that accepts both built-in and custom roles.

## CR14-V4 — [LOW] Navigation items in `getDropdownItems` don't include "contests" but `AppSidebar` does — capability gap

- **Confidence:** MEDIUM
- **Files:** `src/components/layout/public-header.tsx:68-93`, `src/components/layout/app-sidebar.tsx:73-77`
- **Evidence:** The `getDropdownItems` function in PublicHeader returns: dashboard, problems (if canCreateProblems), groups (if canViewAllGroups), submissions, profile, admin (if canAdminSystem). The AppSidebar's learning group includes: problems, submissions, contests, compiler, rankings. The "contests" link is in the sidebar but NOT in the PublicHeader dropdown. A user on a public page who wants to access their contests must first navigate to the dashboard to see the sidebar. This is a navigation gap.
- **Suggested fix:** Consider adding "contests" to the dropdown items (no capability check needed — any authenticated user can see their contests). Or document this as intentional (contests are accessible via the top nav "Contests" link).

## Final Sweep

- Verified `AUTH_USER_COLUMNS` is derived from `AUTH_CORE_FIELDS` + `AUTH_PREFERENCE_FIELDS` — correct.
- Verified `AUTH_TOKEN_FIELDS` includes all auth fields — correct.
- Verified `clearAuthToken` clears all token fields — correct (uses `AUTH_TOKEN_FIELDS` loop).
- Verified `syncTokenWithUser` uses `Object.assign` — correct (cycle 13 fix).
- Verified `mapTokenToSession` preference fields loop matches `AUTH_PREFERENCE_FIELDS` — correct.
- Verified `getPublicNavItems` matches between both layouts — correct (shared helper).
