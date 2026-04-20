# Security Reviewer — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## SEC-1: Contest detail "Open workspace" link uses stale label that could enable phishing [LOW/MEDIUM]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236-237`, `src/app/(public)/_components/public-contest-detail.tsx:117-118`
**Description:** The contest detail page has a button labeled "Open workspace" / "워크스페이스 열기" that links to `/workspace`. The `/workspace` route performs a 302 redirect to `/dashboard`. While not a direct security vulnerability, a 302 redirect from a stale label creates a minor phishing surface: a user expecting "workspace" lands on "dashboard" and may not notice the URL change. This is a defense-in-depth concern.
**Concrete failure scenario:** Low risk, but the redirect adds an unnecessary hop that could be exploited in redirect-based phishing scenarios.
**Fix:** Update the link to point directly to `/dashboard` and update the label to match.

## SEC-2: Auth cache FIFO eviction has no TTL-based purge for stale entries [LOW/LOW]

**Files:** `src/proxy.ts:23-71`
**Description:** The auth user cache uses FIFO eviction based on size (`AUTH_CACHE_MAX_SIZE = 500`) with per-entry TTL (`AUTH_CACHE_TTL_MS`). However, there is no periodic purge of expired entries — they are only evicted on read (`getCachedAuthUser` removes expired entries when accessed). If many unique users make a single request and never return, their expired entries remain in the map until the size limit forces FIFO eviction. This is a minor memory concern, not a security vulnerability.
**Concrete failure scenario:** Under unusual traffic patterns with many unique single-visit users, expired cache entries accumulate until the 500-entry limit is hit, at which point FIFO eviction clears old entries. The TTL is only 2 seconds so practical impact is minimal.
**Fix:** Low priority. Could add a periodic sweep or use a more aggressive eviction strategy.

---

## Verified Safe

- CSP headers are properly set with nonce-based script-src in proxy middleware.
- Auth cookie clearing on invalid sessions works correctly.
- API key bypass for Bearer auth in middleware is correctly limited to API routes.
- `canModerateDiscussions` properly checks capabilities, not just role strings.
- Judge worker routes are excluded from auth requirement in middleware.
