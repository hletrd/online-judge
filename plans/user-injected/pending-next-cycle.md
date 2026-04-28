# User-injected TODOs — pending next cycle

These are user-injected TODOs queued by the review-plan-fix orchestrator on
2026-04-29. Each cycle's PROMPT 2 MUST ingest this file alongside the
review aggregate, turn the items below into concrete plan entries (or
update existing matching plans), and PROMPT 3 MUST implement them
alongside the normal plan work.

When all items below are landed and verified, archive the corresponding
plans (mark them done) and clear this file (or remove the bullets that
have been completed). Do NOT silently drop any item — if a sub-item is
deferred, record it in the plan directory with file+line, original
severity, the concrete reason, and the exit criterion that would re-open
it.

## TODO #1 — Continue workspace → public migration (long-term plan) — DONE 2026-04-29 (cycle 1 RPF)

**Resolution (cycle 1 RPF, 2026-04-29):** All done criteria verified. Migration plan archived to `plans/archive/2026-04-29-archived-workspace-to-public-migration.md`. `(workspace)` and `(control)` route groups removed; 7 308-redirects intact in `next.config.ts`; `npx tsc --noEmit` exit 0; `npm run lint` 0 errors; `npm run build` succeeded (confirmed by cycle 1 RPF gate run, see `.context/reviews/rpf-cycle-1-verifier.md`). Remaining `(dashboard)` routes are admin-only or auth-gated per the migration plan's Phase 4 audit "must stay in authenticated area" list.

**User wording (verbatim, 2026-04-29):**

> I have a long term plan to move all workspace only pages to public pages
> with new top navbar layout, and deprecate workspace only pages. for each
> menus, unless there is a specific reason that it should stay in
> workspace, bring out to public menu, in a good placement, with new
> layouts. I think this work is now ongoing, not complete. Please go on
> migrating entire UI, except admin and some cannot-move ui pages.

### Concrete intent

1. Treat the existing migration plan
   `plans/open/2026-04-19-workspace-to-public-migration.md` as the
   authoritative tracker. Re-read it at the start of every cycle and
   bring its status to ground truth (current code may have moved past
   what the plan says).
2. For every page currently under `(workspace)` or `(dashboard)`:
   - Default action: move it to a public route (`(public)/...`) with the
     new top-navbar layout (`PublicHeader` + `PublicFooter`, max-w-6xl).
     Pick a sensible URL placement (mirror existing public IA — e.g.
     `/practice/...`, `/contests/...`, `/submissions/...`, `/profile/...`,
     `/community/...`).
   - Render auth-gated content with auth-aware sections inside the
     public page rather than a separate route group. Unauth users see a
     reasonable login CTA where applicable.
   - Add a permanent redirect (308) from the old `(dashboard)` /
     `(workspace)` route to the new public route so deep links survive.
   - Update every internal link, navbar item, breadcrumb, sidebar entry,
     test selector, e2e fixture, i18n string, and OG metadata that points
     at the old path.
   - Remove the now-empty page file once the redirect is in place AND
     the new page is verified.
3. **Do NOT move** these pages — they explicitly stay where they are:
   - All `/dashboard/admin/*` routes (admin-only — must remain in
     authenticated dashboard layout).
   - Any page that the existing migration plan flags as "Must stay in
     authenticated area" with a documented reason. If a page is not yet
     classified, classify it explicitly in the plan before deciding.
4. Layout work for moved pages:
   - Use `PublicHeader` top navbar; do NOT mount a left sidebar on
     migrated pages.
   - The top navbar must adapt to auth state: show role-aware items
     (e.g. "My Submissions", "My Contests", "Profile") only when signed
     in; collapse them into a user menu where it makes sense.
   - Preserve dark mode parity (Korean letter-spacing rule from
     `CLAUDE.md` still applies — do NOT add `tracking-*` to Korean
     text).
5. Progress tracking:
   - Update the migration plan's status checklist after each migrated
     page lands.
   - When the migration plan reaches "all phases complete and verified
     in production-equivalent build (`npm run build` + smoke nav)",
     archive it under `plans/archive/` and remove TODO #1 from this
     file.

### Deferral rules (strict)

- A specific page may only be left un-migrated for a cycle if the
  cycle's plan entry quotes a concrete reason (e.g. "blocked on
  shared-state context that requires sidebar provider", "auth-flow
  redirect target hard-coded in `next-auth` config — needs separate
  plan"). Quote the file+line of the constraint in the plan.
- "Out of scope this cycle" alone is NOT a sufficient deferral reason
  for a page that fits the default-move criterion.
- Security/correctness regressions discovered during migration (e.g. a
  page becomes accessible to unauth users that should not be) are NOT
  deferrable — fix them in the same cycle.
- All deferred work remains bound by repo policy (GPG-signed commits,
  conventional commit + gitmoji, no `--no-verify`, no force-push to
  protected branches).

### Done criteria for TODO #1

- `(workspace)` route group is empty or removed.
- Every non-admin page that previously lived under `(dashboard)` either
  (a) has a public counterpart with feature parity and an old-path 308
  redirect, or (b) is explicitly listed in the migration plan as "stays
  in dashboard" with a quoted reason.
- `npm run build` succeeds.
- `npx tsc --noEmit` succeeds.
- `eslint` is clean for the affected files.
- Affected vitest/playwright tests are updated and green.
- The migration plan is archived under `plans/archive/`.
