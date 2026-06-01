# Verification Matrix

Date: 2026-05-17

| Gate | Command or Evidence | Result | Notes |
|---|---|---|---|
| File preservation | `docs/archive/script_fixed.legacy.js` hash matched before root removal | PASS | Original runtime preserved in archive |
| Full local verification | `npm run verify` | PASS | Syntax, 10 unit/static tests, 3 Playwright tests, and audit passed |
| Dependency audit | `npm audit --audit-level=high` | PASS | 0 vulnerabilities |
| Placeholder scan | `rg` scan for unreplaced project, author, GitHub, and temporary planning tokens | PASS | No matches |
| Secrets file check | `Get-ChildItem -Force -Filter '.env*'` | PASS | No `.env` files present |
| Git status | `git status --short` | HISTORICAL BLOCKED | The 2026-05-17 pass ran before the folder was initialized as the published Git repository |
| CodeRabbit | CodeRabbit review | BLOCKED | Requires a git repository and CLI/auth |

## Final Command Evidence

```text
npm run verify
Result: exit 0
Unit/static tests: 10 passed
Playwright tests: 3 passed

npm audit --audit-level=high
Result: exit 0, found 0 vulnerabilities

Placeholder scan
Result: exit 1 from rg because no matches were found
```

## 2026-06-01 Continuation Verification

| Gate | Command or Evidence | Result | Notes |
|---|---|---|---|
| Syntax | `npm run check:syntax` via `npm run verify` | PASS | Checks `script.js` and `scripts/serve-static.js` |
| Unit/static tests | `npm run test:unit` via `npm run verify` | PASS | 10 Node tests passed |
| Browser e2e | `npm run test:e2e` via `npm run verify` | PASS | 3 Playwright tests passed |
| Dependency audit | `npm audit --audit-level=high` via `npm run verify` | PASS | 0 vulnerabilities |
| Local browser smoke | Playwright against `http://127.0.0.1:8010/` with Ollama/Qdrant routes mocked | PASS | Title, heading, assistant panel, meta description, and console-error-free render verified |
| Placeholder scan | `rg` scan for unreplaced template tokens | PASS | No matches; `rg` exited 1 because nothing was found |
| Secrets file check | `Get-ChildItem -Force -Filter '.env*'` | PASS | No `.env` files present |
| Git status | `git status --short --branch` | PASS | Repository is initialized on `main` with `origin` set to `https://github.com/RossDmello2/local-doc-rag.git` after the owner-approved rename |

```text
npm run verify
Result: exit 0
Syntax: script.js and scripts/serve-static.js passed
Node tests: 10 passed
Playwright tests: 3 passed
npm audit: 0 vulnerabilities

Browser smoke at http://127.0.0.1:8010/
Result: title, app panel, heading, and meta description visible; console errors empty with local services mocked
```
