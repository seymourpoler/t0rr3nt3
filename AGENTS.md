# AGENTS.md

## Fast Facts & Agent Guidance

**Purpose:** Robust, fault-tolerant BitTorrent `.torrent` file parser (TypeScript, no monorepo)

---

## Repo Structure
- All implementation is in `src/`, single-package TypeScript
- Entry via `Parser`, `TorrentFile`, `FileReader`; no CLI, no HTTP server
- No codegen, no migrations, no special assets

## How to Test
- Unit tests only (no integration tests, not flaky/slow)
- Test runner: **vitest** (`npm run test`, `npm run test:watch`)
- Adding/removing test files: place in `/test`, extension `.test.ts`
- Tests do not require services, fixtures, or network

## How to Build & Lint
- Typecheck & build: `npm run build` (runs `tsc`)
- Lint: `npm run lint` (runs eslint on `src/`)
- No special order required, but prefer: lint → build → test

## Extending
- Add new file format support, parser logic, or error detection in `src/`
- For parsing changes, **edit `parser.ts` and update/create matching tests**

## Testing Quirks
- Tests use `vitest` syntax (`describe`, `it`, `expect`), not jest or mocha
- Some tests use `vitest-mock-extended` for dependency mocks
- No test setup scripts, postinstall scripts, or external prerequisites

## References
- For BitTorrent spec edge cases, see links in `README.md`

---

## When You Might Trip Up
- Test runner is `vitest` (not jest or mocha); use `npm run test`
- Project is intentionally simple—**don’t add complexity or extra config unless required by the problem**
- No `.env`, build system, or toolchain subtleties

---

