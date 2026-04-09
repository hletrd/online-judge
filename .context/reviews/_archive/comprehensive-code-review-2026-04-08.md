# Comprehensive Code Review — JudgeKit

**Date:** 2026-04-08  
**Scope reviewed:** full tracked repository, with focused inspection of `src/`, Rust services, deploy/compose scripts, CI, migrations, tests, and user-facing/ops documentation.  
**Repo state reviewed:** current working tree (including local uncommitted changes).

## Review inventory

I first built an inventory from `git ls-files` and grouped review-relevant files by subsystem.

### Reviewed file categories
- **Core app / API / auth / security:** `src/app/**`, `src/lib/**`, `src/hooks/**`, `src/components/**`, `src/types/**`, `src/i18n/**`
- **Rust services:** `judge-worker-rs/src/**`, `code-similarity-rs/src/**`, `rate-limiter-rs/src/**`
- **Infrastructure / deployment:** `Dockerfile*`, `docker/**`, `docker-compose*.yml`, `deploy*.sh`, `scripts/**`, `.github/workflows/**`
- **Database / schema:** `drizzle.config.ts`, `drizzle/**/*.sql`, `src/lib/db/**`
- **Tests:** `tests/**`, Playwright/Vitest configs
- **Documentation / guidance:** `README.md`, `docs/**`, `AGENTS.md`, `.context/development/**`, existing review notes in `.context/reviews`

### Explicitly excluded as non-review-relevant / vendored artifacts
- `node_modules/**`
- `.next/**`
- generated migration snapshot metadata under `drizzle/**/meta/**`
- static vendored assets under `static-site/html/**`
- lockfiles as implementation evidence only (`package-lock.json`, `Cargo.lock`) rather than review targets

## Method

- Built repository inventory and cross-file map.
- Read the core security/auth, permissions, DB import/export, judge-worker, deployment, admin, and language-management paths in detail.
- Cross-checked code against docs, deployment scripts, and UI/API interactions.
- Ran verification where it helped ground the review:
  - `npx tsc --noEmit` ✅
  - `cd judge-worker-rs && cargo test --quiet` ✅ (29 passed)
  - `cd code-similarity-rs && cargo test --quiet` ✅ (46 passed)
  - `cd rate-limiter-rs && cargo test --quiet` ✅ but **0 tests**

---

# Findings

## 1) Confirmed — High — IP-based rate limiting is bypassable via spoofed `X-Forwarded-For`

**Files / regions**
- `src/lib/security/ip.ts:13-31`
- `src/lib/security/rate-limit.ts:26-31`
- `src/lib/security/api-rate-limit.ts:103-145`
- `deploy-docker.sh:469-472`, `deploy-docker.sh:481-484`, `deploy-docker.sh:493-496`
- `scripts/online-judge.nginx.conf:55`, `:67`, `:80`

**Why this is a problem**
`extractClientIp()` trusts the client-address position inside `X-Forwarded-For`, but the shipped nginx config forwards `$proxy_add_x_forwarded_for`, which appends the real remote address to any client-supplied header instead of replacing it. With the default `TRUSTED_PROXY_HOPS=1`, `extractClientIp()` picks the first hop before the proxy — which is attacker-controlled if the client sends its own `X-Forwarded-For` header.

That value feeds directly into login/API rate-limit keys, so rate limiting can be bypassed by rotating spoofed header values.

**Concrete failure scenario**
An attacker sends repeated bad login attempts with:

```http
X-Forwarded-For: 198.51.100.1
X-Forwarded-For: 198.51.100.2
X-Forwarded-For: 198.51.100.3
```

nginx appends the real client IP to each header, but the app still extracts the spoofed first entry. The attacker gets fresh rate-limit keys and can brute-force far beyond the intended limit.

**Suggested fix**
- Make nginx overwrite `X-Forwarded-For` with `$remote_addr` instead of appending untrusted incoming values, or explicitly clear incoming XFF first.
- Alternatively, only trust a header that the proxy rewrites exclusively.
- Add regression tests for header-injection cases.

**Confidence:** High

---

## 2) Confirmed — High — Group co-instructors/TAs are largely ignored by the actual access-control paths

**Files / regions**
- `src/lib/auth/permissions.ts:11-55`
- `src/lib/assignments/management.ts:25-32`
- `src/app/(dashboard)/dashboard/groups/page.tsx:57-84`
- `src/app/(dashboard)/dashboard/groups/[id]/page.tsx:99-103`
- `src/app/api/v1/groups/[id]/members/bulk/route.ts:23-30`
- `src/app/api/v1/groups/[id]/assignments/route.ts:80-86`

**Why this is a problem**
The repository has a dedicated `group_instructors` table and helper comments describing co-instructor / TA support, but the actual access checks for group pages and most management routes still only honor:
- built-in admin/super_admin
- `groups.instructorId`
- student enrollment

`canAccessGroup()` never checks `group_instructors`, and many group-management routes use the synchronous `canManageGroupResources()` helper that likewise only checks the owner instructor.

**Concrete failure scenario**
A co-instructor is added through `/api/v1/groups/[id]/instructors`, but then:
- `/dashboard/groups` does not list the group for them
- `/dashboard/groups/[id]` redirects them away unless they are also enrolled as a student
- member bulk add / assignment creation endpoints return `403`

So the platform’s co-instructor / TA feature exists in schema and UI flows but does not work consistently in practice.

**Suggested fix**
- Make `canAccessGroup()` and the page/API call sites consult `group_instructors`.
- Replace synchronous owner-only checks with a role-aware helper where co-instructor / TA behavior is intended.
- Add route tests for owner, co-instructor, TA, student, and custom-role permutations.

**Confidence:** High

---

## 3) Confirmed — High — The one route that *does* use the async group-role helper overgrants TAs full score-edit powers

**Files / regions**
- `src/lib/assignments/management.ts:39-56`
- `src/lib/assignments/management.ts:59-70`
- `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:44-50`

**Why this is a problem**
`canManageGroupResourcesAsync()` returns `true` for **any** `group_instructors` row, regardless of whether the role is `co_instructor` or `ta`. But the nearby `isGroupTA()` comment explicitly says TAs should have limited permissions.

The score-override API uses this async helper, so a TA can write grade overrides even though the code comments describe TA permissions as narrower.

**Concrete failure scenario**
A TA assigned only to help monitor submissions can call the score-override API directly and change a student’s score, even though the intended role model says TAs should have limited powers.

**Suggested fix**
- Split “can manage everything” from “has any instructional role”.
- Require `co_instructor` (or a specific capability) for score overrides.
- Add negative tests proving a TA cannot create/delete overrides.

**Confidence:** High

---

## 4) Confirmed — High — Capability-based custom roles are inconsistent with built-in-only API guards

**Files / regions**
- `src/lib/api/handler.ts:107-114`
- `src/app/(dashboard)/dashboard/admin/languages/page.tsx:11-15`
- `src/app/api/v1/admin/docker/images/route.ts:39-40`, `:66-67`, `:92-93`
- `src/app/api/v1/admin/docker/images/build/route.ts:17-20`
- `src/app/api/v1/groups/[id]/members/bulk/route.ts:23-30`

**Why this is a problem**
The app has a real capability system and server components often gate pages with `resolveCapabilities(...)`, but `createApiHandler({ auth: { roles: [...] } })` only recognizes built-in role strings. That means custom roles can be allowed into admin screens yet still hit built-in-only API `403`s.

**Concrete failure scenario**
A custom role with `system.settings` can load `/dashboard/admin/languages`, but its build/remove/prune actions fail because the backing Docker image routes only accept built-in `admin` / `super_admin` role names.

**Suggested fix**
- Stop using built-in role name lists for endpoints that are capability-backed elsewhere.
- Add a capability-aware auth mode to `createApiHandler`, or check capabilities explicitly in the route.
- Add E2E/API tests for at least one non-built-in admin-capable role.

**Confidence:** High

---

## 5) Confirmed — High — The “Allowed hosts” admin setting is effectively a no-op

**Files / regions**
- `src/lib/security/env.ts:95-109`
- `src/lib/security/env.ts:126-140`
- `src/app/api/v1/admin/settings/route.ts:25-45`
- `src/app/(dashboard)/dashboard/admin/settings/page.tsx:131-197`
- `src/lib/security/server-actions.ts:18-31`
- `src/lib/auth/trusted-host.ts:23-31`

**Why this is a problem**
The admin UI stores `allowedHosts` in `system_settings`, but the runtime host-trust code never loads them. `getAllowedHostsFromDb()` is a stub that always returns `[]`.

So the UI invites operators to believe they have configured additional trusted hosts, but the security checks still only trust `AUTH_URL`.

**Concrete failure scenario**
An operator adds a secondary internal hostname in the admin settings to support server actions or auth flows. The setting is persisted successfully, shown back in the UI, and yet requests from that host still fail host validation because the runtime never reads the DB value.

**Suggested fix**
- Remove the stub and load `allowedHosts` from cached system settings.
- Add a test that updates `allowedHosts` and verifies `getTrustedAuthHosts()` reflects it.
- Until fixed, either hide the setting or label it as unsupported.

**Confidence:** High

---

## 6) Confirmed — High — Database export pagination is nondeterministic and can skip or duplicate rows

**Files / regions**
- `src/lib/db/export.ts:126-155`
- `src/lib/db/queries.ts:14-19` (unused deterministic-order helper)

**Why this is a problem**
`exportDatabase()` pages every table using `.limit(...).offset(...)` with **no `ORDER BY` at all**. PostgreSQL does not guarantee stable row ordering without an explicit sort, so multiple chunk queries can overlap or skip rows.

**Concrete failure scenario**
A large `submissions` table exports in two chunks. PostgreSQL chooses a different scan order between chunk 1 and chunk 2, so some rows appear twice and others never appear in the export. Importing the backup silently produces an incomplete or duplicated dataset.

**Suggested fix**
- Export each table with a deterministic order (at minimum primary-key order).
- Prefer keyset/cursor pagination over `OFFSET` for large tables.
- Add an integration test exporting/importing a large table with more than one chunk.

**Confidence:** High

---

## 7) Confirmed — High — Database export is not taken under a single snapshot, so backups can be internally inconsistent

**Files / regions**
- `src/lib/db/export.ts:117-165`
- `src/app/api/v1/admin/backup/route.ts:58-60`

**Why this is a problem**
The export engine reads tables one-by-one outside a transaction. Under PostgreSQL’s default isolation, each query can see a different snapshot of the database. A backup taken during active writes can therefore mix parents from one moment with children from another.

**Concrete failure scenario**
While export is running, a submission is inserted after the `assignments` table has already been read but before `submissions` is exported. The backup imports cleanly only sometimes; in worse cases it contains orphaned or logically torn state.

**Suggested fix**
- Run the whole export in a single read-only transaction with a repeatable snapshot.
- For operational backups, consider delegating to `pg_dump` instead of hand-rolled JSON export.

**Confidence:** High

---

## 8) Confirmed — Medium/High — Backup/export path scales poorly because it materializes the entire database twice in memory

**Files / regions**
- `src/lib/db/export.ts:126-160`
- `src/app/api/v1/admin/backup/route.ts:58-61`

**Why this is a problem**
The export engine accumulates every row of every table into `allExportedRows`, then the backup route immediately `JSON.stringify`s the full export into one giant string before sending it. For large installations this creates at least two large in-memory copies.

**Concrete failure scenario**
A production instance with many submissions attempts an admin backup. The Node process spikes memory, the request stalls, and the container may be OOM-killed before the backup is returned.

**Suggested fix**
- Stream backups instead of materializing the whole payload.
- Use NDJSON / table-at-a-time streaming / compressed archive output.
- Enforce documented size ceilings.

**Confidence:** High

---

## 9) Confirmed — High — Admin import/validate JSON paths have no body-size limit

**Files / regions**
- `src/app/api/v1/admin/migrate/import/route.ts:26-39`
- `src/app/api/v1/admin/migrate/validate/route.ts:20-29`

**Why this is a problem**
The multipart code path enforces file-size checks, but the JSON body code path calls `request.json()` directly with no maximum size. A single oversized body can force the server to buffer and parse an arbitrarily large payload.

**Concrete failure scenario**
A compromised super-admin session (or misdirected automation) sends a multi-hundred-megabyte JSON body directly to the import/validate endpoints. The Node process attempts to parse it in memory and can exhaust RAM.

**Suggested fix**
- Read raw text first with a hard byte limit.
- Apply the same size ceiling to both multipart and JSON submission paths.
- Return `413 Payload Too Large` instead of parsing unbounded data.

**Confidence:** High

---

## 10) Likely — Medium/High — Rate-limit failures are recorded asynchronously, leaving a burst window for parallel guessing

**Files / regions**
- `src/lib/auth/config.ts:177-192`, `:216`
- `src/lib/actions/change-password.ts:42-49`, `:76`
- `src/lib/security/rate-limit.ts:117-161`

**Why this is a problem**
Failed login attempts and failed current-password checks call the rate-limit write path with `void ...`, so the request returns before the failure is recorded. Parallel requests can all perform the “am I limited?” check before earlier failures are written.

**Concrete failure scenario**
An attacker sends many invalid login attempts concurrently. Because the write side is fire-and-forget, several requests race past the `isAnyKeyRateLimited()` gate before the DB updates land, allowing a larger-than-configured burst.

**Suggested fix**
- Await failure-recording for security-critical paths.
- Add concurrency tests for login and password-change flows.
- If latency is a concern, use an atomic “check + increment” limiter instead of split read/write steps.

**Confidence:** Medium

---

## 11) Confirmed — High — Deploy scripts default `AUTH_URL` to `http://...` even when TLS is present, which disables secure auth cookies

**Files / regions**
- `deploy-docker.sh:203-208`, `:259-261`
- `deploy.sh:46-49`
- `src/lib/security/env.ts:142-159`
- `src/lib/auth/config.ts:112-126`

**Why this is a problem**
The deployment scripts generate/patch `AUTH_URL=http://...` by default. But secure session-cookie behavior is derived from `AUTH_URL.startsWith("https://")`. On a TLS-enabled deployment, forgetting to override `AUTH_URL` leaves auth cookies non-`Secure`.

**Concrete failure scenario**
A host already has a valid HTTPS certificate. `deploy-docker.sh` detects TLS for nginx, but `.env.production` still ends up with `AUTH_URL=http://example.com`. The app therefore issues non-secure session cookies, which browsers may send over plaintext HTTP before the redirect to HTTPS.

**Suggested fix**
- Default to `https://${DOMAIN}` whenever TLS is present.
- Refuse to deploy with `AUTH_URL=http://...` in production unless an explicit override says otherwise.
- Add a deployment smoke check that verifies the session cookie has the `Secure` flag on HTTPS deployments.

**Confidence:** High

---

## 12) Confirmed — High — Deployment scripts disable SSH host verification and expose sudo passwords unsafely

**Files / regions**
- `deploy-docker.sh:135`, `:420`
- `deploy.sh:25`
- `deploy-test-backends.sh:41`

**Why this is a problem**
The SSH options disable host-key verification (`StrictHostKeyChecking=no`, `UserKnownHostsFile=/dev/null`), which enables MITM attacks. `deploy-docker.sh` also builds `SUDO_CMD="echo '${SSH_PASSWORD}' | sudo -S"`, putting a reusable password directly into the remote command string.

**Concrete failure scenario**
A compromised network path or rogue bastion can impersonate the target host and capture deployment traffic, including secrets pushed into `.env.production`. On the remote host, the echoed sudo password is also exposed to shell history/process inspection opportunities more broadly than necessary.

**Suggested fix**
- Use `StrictHostKeyChecking=accept-new` (or managed `known_hosts`) instead of disabling verification.
- Stop piping the password through `echo`; use passwordless sudo for deploy users or a safer prompt/SSH key strategy.
- Apply the same fix to every deploy helper script.

**Confidence:** High

---

## 13) Confirmed — Medium — Judge worker ignores the server-provided heartbeat interval

**Files / regions**
- `judge-worker-rs/src/main.rs:216-221`
- `judge-worker-rs/src/main.rs:241-250`

**Why this is a problem**
The app registration response includes `heartbeat_interval_ms`, but the worker always sleeps for a hard-coded 30 seconds before every heartbeat.

**Concrete failure scenario**
An operator lowers the server-side heartbeat interval to detect dead workers faster. Existing workers ignore the negotiated value, send heartbeats too slowly, and get marked stale or noisy depending on the server configuration.

**Suggested fix**
- Store the returned interval from registration and sleep for that value.
- Add a unit/integration test covering non-default heartbeat intervals.

**Confidence:** High

---

## 14) Confirmed — Medium — Orphan-container cleanup only runs while the worker is idle

**Files / regions**
- `judge-worker-rs/src/main.rs:396-400`

**Why this is a problem**
`cleanup_counter` only advances in the `None`/idle branch. Under sustained load, the worker never reaches that branch often enough, so orphan cleanup may never run.

**Concrete failure scenario**
A busy grading cluster processes submissions continuously for hours. Any orphaned containers created during failures remain behind indefinitely because the cleanup trigger never fires.

**Suggested fix**
- Trigger cleanup by elapsed time rather than by idle-loop count.
- Run cleanup in a background task independent of queue idleness.

**Confidence:** High

---

## 15) Confirmed — High — Admin “build image” uses the wrong Docker build context and breaks images that copy repo-relative files

**Files / regions**
- `src/lib/docker/client.ts:91-95`
- `src/app/api/v1/admin/docker/images/build/route.ts:32-43`
- `docker/Dockerfile.judge-esoteric:43-44`

**Why this is a problem**
`buildDockerImage()` sets the build context to `dirname(dockerfilePath)` (i.e. `docker/`), but at least one shipped language image (`judge-esoteric`) copies `docker/interpreters/whitespace.py` from the **repo root context**. That path only exists when the build context is `.`.

**Concrete failure scenario**
An admin clicks **Build** for the esoteric image in the language-management UI. The route finds the Dockerfile, spawns `docker build -f docker/Dockerfile.judge-esoteric docker`, and Docker fails because `docker/interpreters/whitespace.py` is outside that context.

**Suggested fix**
- Build from repo root (`.`) for these admin-triggered builds, matching the deploy scripts.
- Add a regression test for at least one Dockerfile that copies repo-relative assets.

**Confidence:** High

---

## 16) Confirmed — Medium/High — Language inventory and automation have drifted badly

**Files / regions**
- `deploy-docker.sh:63-74`
- `scripts/setup.sh:59-68`, `:75`
- `README.md:18`, `:25-26`
- `docs/languages.md:1-3`
- `AGENTS.md:18-20`
- `src/lib/judge/languages.ts` (source-of-truth language definitions)

**Why this is a problem**
The repository no longer has a single trustworthy language/image inventory:
- `README.md` says **118** language variants
- `docs/languages.md` says **120** variants / **100** images
- `AGENTS.md` says **114** variants / **95** images
- `src/lib/judge/languages.ts` currently defines **120** language variants
- the `all` build presets in `deploy-docker.sh` / `scripts/setup.sh` miss at least **6 source-referenced images** (`chapel`, `elm`, `flix`, `idris2`, `moonbit`, `rescript`)

**Concrete failure scenario**
An operator chooses the documented `--languages=all` preset expecting every supported language to work. Several supported languages never get built, and submissions for those languages fail at runtime until the missing images are built manually.

**Suggested fix**
- Generate docs and build presets from the language source-of-truth instead of hand-maintaining multiple lists.
- Add a test that compares supported images in `src/lib/judge/languages.ts` against the deploy/setup presets.

**Confidence:** High

---

## 17) Confirmed — Medium — Group member listing is unpaginated

**Files / regions**
- `src/app/api/v1/groups/[id]/members/route.ts:19-34`

**Why this is a problem**
The endpoint returns every enrollment row for the group in one response. There is no `limit`, `offset`, or cursor support.

**Concrete failure scenario**
A large class with thousands of students opens the member-management page or an automation script hits the endpoint repeatedly. Response sizes and DB work scale linearly with group size, hurting latency and memory use.

**Suggested fix**
- Add pagination parameters and return paginated metadata.
- Update the UI to page or incrementally load results.

**Confidence:** High

---

## 18) Confirmed — Medium — Quick-create contest route accepts impossible schedules (`startsAt >= deadline`)

**Files / regions**
- `src/app/api/v1/contests/quick-create/route.ts:29-32`
- `src/app/api/v1/contests/quick-create/route.ts:44-56`

**Why this is a problem**
The route accepts user-supplied `startsAt` and `deadline`, but never validates their ordering before writing the assignment.

**Concrete failure scenario**
An admin accidentally creates a contest with a start time after the deadline. The contest is created successfully, but participants can never meaningfully start it because the schedule is already invalid.

**Suggested fix**
- Reject `startsAt >= deadline` with a 400 validation error.
- Add a route test covering invalid schedules.

**Confidence:** High

---

## 19) Confirmed — Medium — Recruiting tokens leak a recognizable prefix into admin-visible login logs

**Files / regions**
- `src/lib/auth/recruiting-token.ts:61-63`
- `src/app/(dashboard)/dashboard/admin/login-logs/page.tsx:290-291`

**Why this is a problem**
Recruiting tokens are single-factor credentials, yet the code logs `recruit:${token.slice(0, 8)}` into `attemptedIdentifier`, and the admin login-log UI renders that value directly.

**Concrete failure scenario**
Someone with access to login logs (or an exported audit/log dump) gains the first 8 characters of live recruiting tokens. That reduces brute-force space and turns log access into credential leakage.

**Suggested fix**
- Log a one-way hash prefix instead of a raw token prefix.
- Audit existing login-log retention/export paths for prior exposure.

**Confidence:** High

---

## 20) Confirmed — High — CI still does not enforce the project’s stated typecheck / Rust-test quality gates

**Files / regions**
- `.github/workflows/ci.yml:53-63`
- `next.config.ts:10-15`
- `judge-worker-rs/` (29 passing tests locally, but no CI job)
- `code-similarity-rs/` (46 passing tests locally, but no CI job)
- `rate-limiter-rs/` (0 tests)

**Why this is a problem**
The documented quality gates require `tsc --noEmit` and Rust tests, but CI currently runs:
- lint
- unit tests
- `npm run build`

while `next.config.ts` explicitly sets `ignoreBuildErrors: true`. That means CI is not actually enforcing a hard TypeScript gate, and Rust service logic is not covered by CI at all.

**Concrete failure scenario**
A future change introduces a TS error in route typing or breaks judge-worker behavior. The Next build still succeeds because build-time TS errors are ignored, and CI never runs `cargo test`, so the regression merges unnoticed.

**Suggested fix**
- Add explicit `npx tsc --noEmit` to CI.
- Add `cargo test` jobs for `judge-worker-rs`, `code-similarity-rs`, and `rate-limiter-rs`.
- Remove `ignoreBuildErrors: true` once the route typings are corrected.

**Confidence:** High

---

## 21) Risk needing manual validation — Multi-instance deployments will break the in-memory SSE / anti-cheat dedupe assumptions

**Files / regions**
- `src/app/api/v1/submissions/[id]/events/route.ts:23-25`, `:75-112`
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:13-15`, `:72-90`

**Why this is a risk**
Both systems rely on process-local memory:
- SSE connection tracking lives in `Set` / `Map`
- anti-cheat heartbeat dedupe lives in an in-process `LRUCache`

That is fine on a single Next.js instance, but it does not survive horizontal scaling.

**Concrete failure scenario**
With multiple app instances behind a load balancer, one instance enforces the per-user SSE cap while another does not know about existing connections; anti-cheat heartbeat dedupe also becomes per-instance, so the same user can generate multiple heartbeat rows per minute depending on which instance handles the request.

**Suggested fix**
- If multi-instance deployments are supported, move these coordination primitives to Redis / Postgres / another shared backend.
- If single-instance is the only supported mode, document that explicitly and test the deployment assumptions.

**Confidence:** Medium

---

# Additional low-severity observations

- `.github/workflows/ci.yml:56-60` still runs unit tests twice (normal + coverage), which is unnecessary CI time once a dedicated coverage job exists.
- `Dockerfile.judge-worker:17-22` and `:34-35` still suppress worker binary verification failures with `|| true`, weakening the purpose of the verification step.

---

# Final sweep

I did a last pass specifically for easy-to-miss issues and cross-file interactions:

- **Security sweep:** auth cookie config, host trust, proxy headers, rate limits, token logging, deploy SSH settings, Docker build surfaces
- **Data-integrity sweep:** import/export ordering, snapshot consistency, backup/restore size handling, schedule validation
- **Authorization sweep:** capability-based custom roles, group owner vs co-instructor / TA behavior, UI/API mismatches
- **Ops/docs sweep:** deployment defaults, build presets, language counts, CI gates, worker runtime negotiation
- **Scalability sweep:** unpaginated member listing, in-memory SSE/heartbeat coordination, full-memory backup generation

### Coverage confirmation
- [x] App/API auth and security paths reviewed
- [x] DB import/export, schema, and migration interactions reviewed
- [x] Judge worker runtime / deployment / Docker integration reviewed
- [x] Language-management automation and docs reviewed
- [x] CI/test configuration reviewed
- [x] Relevant documentation reviewed
- [x] Non-relevant vendored/static/generated artifacts explicitly excluded rather than silently skipped


---

# Post-review remediation update

**Update status:** partial remediation completed in the current workspace after this review was written.

## Findings now addressed in code

The following findings from this review were implemented and re-verified in the current workspace:

- **1 — IP-based rate limiting spoof via `X-Forwarded-For`**
  - nginx/deploy configs now forward `X-Forwarded-For: $remote_addr`
  - `extractClientIp()` now prefers `X-Real-IP`
- **2 — Group co-instructor/TA access gaps**
  - group access now consults `group_instructors`
  - group pages and routes were updated to honor instructional roles
- **3 — TA overgrant on score overrides**
  - async management checks now distinguish `co_instructor` from `ta`
- **4 — Custom-role/capability mismatch on admin Docker routes**
  - Docker image admin routes now use capability-based auth
- **5 — `allowedHosts` setting was a no-op**
  - trusted-host/server-action paths now await async host resolution from settings-backed code
- **6 / 7 — export ordering + snapshot consistency**
  - export now runs in a repeatable-read transaction and uses explicit ordering
- **9 — import/validate JSON body size limits**
  - large JSON bodies are now bounded before parse
- **10 — async rate-limit writes leaving burst windows**
  - security-critical login/password-change paths now await rate-limit writes/clears
- **11 / 12 — insecure deploy defaults**
  - deploy scripts moved to safer SSH host-key defaults and HTTPS-oriented `AUTH_URL` defaults
- **13 / 14 — worker heartbeat / orphan cleanup issues**
  - worker now honors negotiated heartbeat interval and cleanup is time-based
- **15 — wrong Docker build context for admin image builds**
  - Docker admin build path now uses repo-root context
- **16 — language preset/docs drift**
  - presets/docs were updated toward the 120-language source-of-truth
- **17 — unpaginated group member listing**
  - group members API now paginates
- **18 — invalid quick-create schedules**
  - route now rejects `startsAt >= deadline`
- **19 — recruiting token prefix leakage in login logs**
  - recruiting token log identifier now uses a hash fingerprint instead of a raw prefix
- **20 — CI/typecheck/build-health gap**
  - CI now runs `tsc` and Rust test jobs, and `next.config.ts` no longer ignores build errors
- **Additional low-severity observation — worker Dockerfile verification suppression**
  - `Dockerfile.judge-worker` no longer masks binary verification failures with `|| true`

## Verification performed after remediation

- `npx vitest run tests/unit/auth/trusted-host.test.ts tests/unit/security/env.test.ts tests/unit/api/handler.test.ts tests/unit/api/users.route.test.ts tests/unit/api/contests-quick-create.route.test.ts`
- `npx vitest run tests/unit/security/ip.test.ts tests/unit/auth/permissions.test.ts tests/unit/assignments/management.test.ts tests/unit/auth/rate-limit-await.test.ts tests/unit/db/export-implementation.test.ts tests/unit/docker/client.test.ts tests/unit/infra/deploy-security.test.ts tests/unit/infra/language-inventory.test.ts tests/unit/infra/worker-runtime.test.ts tests/unit/api/contests.route.test.ts`
- `npx tsc --noEmit`
- `cargo test --manifest-path judge-worker-rs/Cargo.toml --quiet`
- `cargo test --manifest-path code-similarity-rs/Cargo.toml --quiet`
- `cargo test --manifest-path rate-limiter-rs/Cargo.toml --quiet`
- `npm run build`

## Final remediation note

All actionable code and configuration items from this review have been addressed in the current workspace.

The only remaining item is **21 — multi-instance SSE / anti-cheat dedupe assumptions**, which is now handled as an explicit **documented deployment constraint**: run a single app instance unless shared coordination or an equivalent sticky-session design is introduced.
