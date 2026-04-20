# Cycle 25 Aggregate Review

**Date:** 2026-04-20
**Base commit:** cbae7efd
**Review artifacts:** `cycle-25-code-reviewer.md`, `cycle-25-security-reviewer.md`, `cycle-25-critic.md`, `cycle-25-architect.md`, `cycle-25-verifier.md`, `cycle-25-test-engineer.md`, `cycle-25-debugger.md`, `cycle-25-perf-reviewer.md`, `cycle-25-designer.md`, `cycle-25-tracer.md`, `cycle-25-document-specialist.md`

## Deduped Findings (sorted by severity then signal)

### AGG-1: Hardcoded English string "Solved" in public-problem-set-detail.tsx — not internationalized [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1), critic (CRI-1), verifier (V-1), test-engineer (TE-1)
**Files:** `src/components/problem/public-problem-set-detail.tsx:81`
**Description:** The Badge text "Solved" is hardcoded in English while the rest of the component correctly uses i18n props. This app supports Korean locale, but this string will always render in English.
**Concrete failure scenario:** Korean users viewing problem sets see "Solved" in English instead of the Korean equivalent.
**Fix:**
1. Add a `solvedLabel: string` prop to `PublicProblemSetDetailProps`
2. Replace the hardcoded `>Solved<` with `{solvedLabel}`
3. Pass the i18n string from the calling page component

### AGG-2: 13 components still have hardcoded `tracking-tight` on Korean-reachable headings — Korean letter-spacing remediation incomplete [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-2), critic (CRI-2), designer (DES-2), verifier (V-2), architect (ARCH-2), test-engineer (TE-2)
**Files:**
- `src/app/(public)/community/new/page.tsx:19`
- `src/components/problem/public-problem-set-detail.tsx:49`
- `src/app/(public)/rankings/page.tsx:217`
- `src/app/(public)/users/[id]/page.tsx:215`
- `src/components/problem/public-problem-set-list.tsx:33`
- `src/app/(public)/_components/public-preview-page.tsx:14`
- `src/app/(public)/_components/public-problem-list.tsx:96`
- `src/app/(public)/submissions/page.tsx:123,275`
- `src/components/discussions/discussion-thread-list.tsx:48`
- `src/components/discussions/my-discussions-list.tsx:26`
- `src/components/discussions/discussion-thread-view.tsx:41`
- `src/components/discussions/discussion-moderation-list.tsx:39`
- `src/components/user/user-stats-dashboard.tsx:58`

**Description:** Per CLAUDE.md, Korean text must use browser/font default letter-spacing. Cycle 24's M3 fix was marked DONE, but it only covered 7 specific files cited in that cycle's review. Thirteen additional component locations still apply hardcoded `tracking-tight` to headings that may render Korean text.
**Concrete failure scenario:** Korean users see inconsistent letter-spacing across the app — headings on community, rankings, problem sets, discussions, user profile, and submissions pages are cramped while home page headings are correctly spaced.
**Fix:** Apply locale-conditional tracking pattern to all 13 remaining locations. For client components, use `useLocale()`. For server components, use `getLocale()`. Pattern: `const headingTracking = locale !== "ko" ? " tracking-tight" : ""`.

### AGG-3: `/languages` route missing from SEO route matrix and sitemap [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-3), architect (ARCH-1), verifier (V-3)
**Files:** `src/lib/public-route-seo.ts`
**Description:** The `/languages` page is a public, indexable page (visible in the top nav), but it is not listed in `SEO_ROUTE_MATRIX` or `INDEXABLE_PUBLIC_ROUTE_PREFIXES`. It is excluded from sitemap generation.
**Concrete failure scenario:** The `/languages` page is absent from sitemap.xml, reducing its discoverability by search engines.
**Fix:** Add `/languages` to `INDEXABLE_PUBLIC_ROUTE_PREFIXES` and `SEO_ROUTE_MATRIX` with `indexable: true, localized: true, includedInSitemap: true, jsonLd: false, socialCards: false`. Note: this fix should still be applied even after the user-injected TODO moves Languages to secondary navigation — the page remains a reachable public page.

### AGG-4: "Languages" as top-level nav item is an information architecture problem [MEDIUM/HIGH — user-injected TODO]

**Flagged by:** critic (CRI-3), designer (DES-1)
**Files:** `src/lib/navigation/public-nav.ts:32`
**Description:** The "Languages" page is an informational reference page, not a primary action page. Having it at the top level inflates the nav and dilutes information hierarchy.
**Fix:** Addressed by the user-injected TODO (move Languages to secondary navigation).

## Verified Safe / No Regression Found

- Auth flow is robust with Argon2id, timing-safe dummy hash, rate limiting, and proper token invalidation.
- No `dangerouslySetInnerHTML` without sanitization.
- No `console.log` in production code (only `console.error` in error boundaries).
- Only 2 eslint-disable directives, both with justification comments.
- No `as any` type casts.
- No silently swallowed catch blocks.
- Environment variables are properly validated in production.
- Stale `/workspace` web route references have been fully cleaned up from previous cycles.

## Agent Failures

None. All review perspectives completed successfully.
