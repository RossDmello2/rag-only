# Agent Guidance

This repository is a static browser app. Preserve that shape unless the user explicitly asks for a backend-proxy feature.

## Safe Entry Points

- App shell: `index.html`
- Runtime: `script.js`
- Pure helpers: `src/rag-core.js`
- Tests: `tests/`
- Feature map: `docs/features/`
- Historical source: `docs/archive/script_fixed.legacy.js`

## Verification

Run these before claiming completion:

```powershell
npm run check:syntax
npm test
npm run test:e2e
npm audit --audit-level=high
```

## Boundaries

- Do not reintroduce browser-side cloud API key fields.
- Do not edit `docs/archive/script_fixed.legacy.js` as runtime code.
- Do not add generated build output to source control.
- Update the relevant `docs/features/` file when feature behavior changes.
