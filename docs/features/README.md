# Feature Map

This folder is the contributor entry point for product behavior. Each feature document describes the current user behavior, owning files, tests, extension points, and static-app boundaries.

## Current Features

| Feature | Document | Runtime files | Test coverage |
|---|---|---|---|
| Document ingestion | `document-ingestion.md` | `index.html`, `script.js`, `src/rag-core.js` | `tests/core.test.js`, `tests/app.spec.js` |
| Local RAG chat | `local-rag-chat.md` | `script.js`, `src/rag-core.js` | `tests/core.test.js`, `tests/app.spec.js` |
| Settings and service health | `settings-and-service-health.md` | `index.html`, `script.js`, `src/rag-core.js` | `tests/core.test.js`, `tests/app.spec.js` |
| Browser UI | `browser-ui.md` | `index.html`, `style.css`, `script.js` | `tests/app.spec.js`, `tests/static-assets.test.js` |

## How To Add A Feature

1. Pick the closest feature document and read its boundaries.
2. Keep browser orchestration in `script.js`.
3. Put reusable pure logic in `src/rag-core.js`.
4. Add or update unit tests for pure logic and Playwright tests for user-facing behavior.
5. Update the feature document and README if the user workflow changes.

Create a new feature document only when the behavior has a distinct user workflow or ownership boundary.
