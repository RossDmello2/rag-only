# Settings And Service Health

## User Behavior

Users open Settings to configure local Ollama and Qdrant URLs, model names, collection name, chunking, retrieval limits, score threshold, and memory turns. The health check tests whether Ollama and Qdrant are reachable from the browser.

## Owning Files

- `index.html`: settings modal fields and health-check button.
- `script.js`: settings loading, validation, localStorage persistence, and service pings.
- `src/rag-core.js`: default settings and URL/number validation helpers.

## Current Guardrails

- Settings are stored in browser localStorage and must not contain secrets.
- Service URLs must be valid `http://` or `https://` URLs.
- The app warns when opened through `file://`.
- The health check only calls local service status endpoints.

## Tests

- `tests/core.test.js` covers URL and numeric validation helpers.
- `tests/app.spec.js` verifies the settings modal is keyboard-accessible and can close with Escape.

## Extension Points

- Add new non-secret settings to `src/rag-core.js`, `index.html`, and `script.js` together.
- Add a unit test for validation and a browser test when the setting affects visible behavior.
- Do not store API keys, bearer tokens, passwords, or cloud credentials in these settings.
