# Critic — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## CRI-1: Workspace-to-public migration is incomplete — contest page and robots.txt still reference `/workspace` [HIGH/HIGH]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236`, `src/app/(public)/_components/public-contest-detail.tsx:58-59`, `src/app/robots.ts:17`, `src/lib/public-route-seo.ts:107`
**Description:** The workspace-to-public migration (Phase 4) declared the control route merge as complete, but the `/workspace` route reference still appears in:
1. Contest detail page — button links to `/workspace` with label "Open workspace"
2. robots.ts — disallow list includes `/workspace`
3. public-route-seo.ts — SEO logic references `/workspace`

This is a partial migration that leaves the user-facing "workspace" concept alive in at least one prominent public page. The i18n keys `contests.openWorkspace` ("Open workspace" / "워크스페이스 열기") are still in both locale files.
**Concrete failure scenario:** Users see "Open workspace" on the contest detail page, click it, and get redirected to `/dashboard`. The label and target are inconsistent with the migration goal.
**Fix:** Complete the workspace-to-public migration by updating the contest detail link, removing `/workspace` from robots.txt and public-route-seo.ts, and updating the i18n keys.

## CRI-2: Korean letter-spacing violations are widespread — the CLAUDE.md rule is inconsistently applied [MEDIUM/MEDIUM]

**Files:** See CR-3 in code-reviewer review for the full list of 10+ locations.
**Description:** The CLAUDE.md rule about Korean letter spacing is followed in `AppSidebar` and `PublicHeader` (which use `locale !== "ko" ? " tracking-wider" : ""`), but is violated in at least 10 other locations across the codebase. This inconsistency suggests the rule is known but not systematically enforced.
**Concrete failure scenario:** Korean users experience inconsistent letter spacing across the app — some labels are correctly spaced, others are cramped or over-spaced.
**Fix:** Apply the locale-conditional pattern consistently across all affected components.

---

## Verified Safe

- The migration plan (Phase 4) correctly documents the control-to-dashboard merge.
- Next.config.ts redirects are correctly configured for `/control` and `/workspace`.
