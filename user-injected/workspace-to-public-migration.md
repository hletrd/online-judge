# User-Injected Architectural TODO (Long-Term)

## Workspace-to-Public Page Migration

**Priority:** HIGH (originally) — see "Status (as of 2026-04-26)" below
**Source:** User directive during cycle 14

---

## Status (as of 2026-04-26, RPF cycle 5/100)

The bulk of the migration is **substantially complete**. Three reviewers
(critic, document-specialist, verifier) independently flagged the directive's
"Current State" as stale relative to the actual code. This section reflects
the verified code state at HEAD.

**DONE — non-admin nav items removed from sidebar:**
- `src/components/layout/app-sidebar.tsx:55-59` documents the migration:
  > "Non-admin nav items have been removed from the sidebar. All non-admin
  > navigation (Problems, Groups, Problem Sets, Submissions, Contests,
  > Profile) is now in the PublicHeader dropdown. The sidebar only renders
  > for users with admin capabilities and contains only admin-specific items."
- `src/components/layout/app-sidebar.tsx:154-163` enforces this by returning
  `null` when the user has no admin capabilities — non-admins see no sidebar
  at all.

**DONE — public dropdown carries the migrated items:**
- `src/lib/navigation/public-nav.ts:61-70` (`DROPDOWN_ITEM_DEFINITIONS`) lists
  Dashboard, Problems, Problem-Sets, Groups, My-Submissions, Contests,
  Profile, Admin (capability-gated). Capability filtering at lines 79-86
  matches AppSidebar's `filterItems()`.

**DONE — Languages moved to footer (cycle 1-2 milestone):**
- `src/lib/navigation/public-nav.ts:32-33` inline comment confirms.
- `src/components/layout/public-footer.tsx:23-29` always includes the link.

**REMAINING (specific candidates — review each per cycle if surfaced):**
- Admin-system pages (Languages, Judge Workers, System Settings, File
  Management, API Keys, Tag Management, Plugins) — these are still in the
  Admin sub-group of the sidebar (`app-sidebar.tsx:75-86`). Each is
  capability-gated and should likely STAY in the sidebar/admin shell —
  they're admin tooling, not student-facing pages. NO migration action
  unless a reviewer surfaces a specific page that should be public.
- Admin user-management pages (User Management, Roles, All Submissions,
  Audit Logs, Login Logs, Chat Logs, Discussion Moderation) —
  `app-sidebar.tsx:64-72`. Same reasoning: admin tooling stays in admin
  shell.

The migration as originally scoped (move student/instructor non-admin nav
out of the workspace sidebar into the public top navbar / dropdown) is
substantially complete. The directive remains open as a placeholder for
opportunistic edge cases the per-cycle review may surface, but it does NOT
need force-driven progress every cycle.

---

## Original Context (preserved)

The user has a long-term plan to move all workspace-only (dashboard-only)
pages to public pages with a new top navbar layout, and deprecate the
workspace-only pages entirely. This is an ongoing architectural migration.

### Original Desired Outcome
- For each menu/page currently in the workspace sidebar, evaluate whether it
  should stay in workspace or move to the public navbar
- Unless there is a specific reason a page must stay in workspace, bring it
  out to the public menu in a good placement
- Design a new top navbar layout that accommodates the migrated pages
- Deprecate workspace-only pages as they become publicly accessible
- This is incremental work — each cycle should make progress where the
  review/findings surface relevant opportunities

### Constraints
- Follow CLAUDE.md rules: no custom `letter-spacing` / `tracking-*` on
  Korean text
- GPG-sign commits, semantic commit messages with gitmoji
- Pages that require authentication or specific capabilities should still
  gate access appropriately — "public" here means accessible via the top
  navbar, not necessarily unauthenticated
- The sidebar (AppSidebar) still serves admin/power-user functions — those
  can remain

### Final Migration Considerations (now resolved)
- "Problems" already exists in both public (practice) and dashboard —
  unified via dropdown link to /dashboard/problems for authenticated users
  + /practice for everyone.
- "Submissions" exists in both public and dashboard — dropdown
  "mySubmissions" → /dashboard/submissions; public /submissions also exists.
- "Compiler/Playground" exists in both — already unified via /playground.
- "Contests" exists in both public and dashboard — dropdown "contests" →
  /dashboard/contests; public /contests also exists.
- Admin-specific pages (user management, system settings, etc.) — STAY in
  workspace/sidebar by design (admin tooling).
