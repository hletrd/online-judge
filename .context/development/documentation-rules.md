# Documentation Rules

## Do NOT add these sections to docs/languages.md

- **No "Newly Fixed" section** — do not add sections tracking which languages were "previously flaky, now passing". This information is transient and belongs in .context/project/current-state.md session logs, not in permanent documentation.
- **No "Known Flaky" section** — all languages must either pass or be in KNOWN_FAILING with documented reasons. Fix tests instead of marking them flaky.
