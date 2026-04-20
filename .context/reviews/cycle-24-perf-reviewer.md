# Performance Reviewer — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## PERF-1: Contest detail page `/workspace` link creates unnecessary 302 redirect [LOW/MEDIUM]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236`
**Description:** The contest detail page links to `/workspace` which triggers a 302 redirect to `/dashboard`. This adds an extra HTTP round-trip on every click. While the latency impact is small (same-origin redirect), it's avoidable.
**Concrete failure scenario:** Every user click on "Open workspace" incurs an extra redirect hop.
**Fix:** Link directly to `/dashboard`.

## PERF-2: Auth cache in proxy.ts lacks periodic purge of expired entries [LOW/LOW]

**Files:** `src/proxy.ts:23-71`
**Description:** The in-process auth user cache uses FIFO eviction by size (500 entries max) with per-entry TTL (2 seconds). Expired entries are only cleaned up when accessed (`getCachedAuthUser`). There's no periodic sweep. With the small TTL and reasonable traffic, this is unlikely to cause memory issues in practice.
**Concrete failure scenario:** Under burst traffic with many unique users, up to 500 expired entries could remain in memory until evicted by new entries.
**Fix:** Low priority. The 2-second TTL and 500-entry limit make this safe in practice.

---

## Verified Safe

- Next.js standalone output mode is correctly configured.
- Server external packages are properly listed.
- CSP nonce generation uses efficient crypto API.
