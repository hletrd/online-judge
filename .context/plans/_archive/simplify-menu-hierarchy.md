# Simplify Menu Hierarchy - Consolidate Groups

**Status:** COMPLETE (2026-04-04)

## Context
The sidebar had **7 group headers** (4 main + 3 admin), making it visually cluttered. The admin section alone had 3 sub-groups (Users, Monitoring, System) with 13 items. The goal was to reduce the number of group headers while keeping all menu items.

## Before (7 groups)
```
[Navigation]     Dashboard
[Learning]       Problems, Submissions, Contests, Compiler, Rankings
[Manage]         Groups, Problem Sets
[Account]        Profile
--- ADMINISTRATION ---
[Admin Users]    User Management, Role Management
[Admin Monitor]  All Submissions, Judge Workers, Audit Logs, Login Logs, Chat Logs
[Admin System]   File Management, API Keys, System Settings, Languages, Tag Management, Plugins
```

## After (4 groups)
```
(no label)       Dashboard
[Learning]       Problems, Submissions, Contests, Compiler, Rankings
[Manage]         Groups, Problem Sets, Profile
--- ADMINISTRATION ---
[Users & Logs]   User Management, Role Management, All Submissions, Audit Logs, Login Logs, Chat Logs
[System]         Judge Workers, Languages, System Settings, File Management, API Keys, Tag Management, Plugins
```

## Changes Made
1. **Removed "Navigation" group label** - Dashboard renders without a header; conditionally skip `SidebarGroupLabel` when `labelKey` is empty
2. **Merged "Account" into "Manage"** - Profile added as 3rd item in Manage group; "Account" group removed
3. **Merged 3 admin groups into 2** - "Users & Logs" (people + audit trail) and "System" (infrastructure + config)
4. **Reordered admin System items** - Most-used items first (Judge Workers, Languages, Settings)

## Files Modified
- `src/components/layout/app-sidebar.tsx` - Restructured `navGroups` (4→3 groups) and `adminGroups` (3→2 groups); conditional label rendering
- `messages/en.json` - Added `usersAndLogs`, `system` i18n keys
- `messages/ko.json` - Added `usersAndLogs`, `system` i18n keys (Korean)

## Verification
- Build passes with no TypeScript errors
- All 22 menu items preserved
- Capability filtering unchanged
- Platform mode filtering unchanged
