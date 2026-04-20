# Cycle 22 Designer Review

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: Control layout lacks PublicHeader -- inconsistent with dashboard layout [MEDIUM/MEDIUM]

**Files:** `src/app/(control)/layout.tsx:43-67`
**Description:** The dashboard layout now includes PublicHeader for unified navigation. The control layout still uses its own `ControlNav` sidebar and a minimal header with just ThemeToggle and LocaleSwitcher. Users navigating between dashboard and control pages experience a jarring layout switch. The control layout should use the same PublicHeader as the dashboard.
**Fix:** Integrate PublicHeader into the control layout (or merge control into dashboard, which would solve it architecturally).
**Confidence:** MEDIUM

## F2: Dashboard rankings page lacks mobile layout while public rankings has it [LOW/HIGH]

**Files:** `src/app/(dashboard)/dashboard/rankings/page.tsx:121-163`
**Description:** The dashboard rankings page only has a desktop table view. The public rankings page has both a desktop table and mobile card layout. If a user navigates to `/dashboard/rankings` on mobile, the table overflows and is hard to read. This reinforces the case for redirecting to the public page.
**Confidence:** HIGH
