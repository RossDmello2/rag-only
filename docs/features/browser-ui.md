# Browser UI

## User Behavior

The first screen is the usable assistant, not a marketing page. Users can open the assistant, attach a file, ask a question, inspect local service status, open settings, and clear chat state.

## Owning Files

- `index.html`: semantic structure, form controls, modal, and page metadata.
- `style.css`: desktop panel, mobile full-screen layout, modal styling, and focus states.
- `script.js`: event wiring, message rendering, busy state, modal focus handling, and runtime status messages.

## Current Guardrails

- Desktop keeps the assistant as a compact work panel.
- Mobile uses a full-screen assistant panel without horizontal overflow.
- The modal supports Escape close and focus trapping.
- UI copy must not imply hosted cloud-key support.

## Tests

- `tests/app.spec.js` covers desktop render, startup console errors, settings modal behavior, and mobile overflow.
- `tests/static-assets.test.js` verifies static asset references exist.

## Extension Points

- Add visible controls only when they serve the document ingestion, retrieval, settings, or local-service workflow.
- Add Playwright coverage for every new critical UI state.
- Keep generated screenshots or demo assets under `docs/assets/` only when they are intentionally maintained documentation assets.
