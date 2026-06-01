# Contributing

## Setup

```powershell
npm install
npx playwright install chromium
npm run verify
```

## Development Rules

- Keep the runtime browser-only unless a separate backend-proxy feature is approved.
- Do not add client-side cloud API key handling.
- Keep pure logic in `src/rag-core.js` when it needs unit coverage.
- Keep `script.js` as the canonical runtime loaded by `index.html`.
- Preserve archived files under `docs/archive/` unless they are intentionally superseded with a documented replacement.

## Feature Work

Before adding or changing behavior:

1. Read `docs/features/README.md`.
2. Read the feature document that owns the behavior.
3. Update the feature document when the behavior changes.
4. Add or update the smallest test that proves the behavior.

If no feature document owns the behavior, add one under `docs/features/` before implementing the feature. Do not move runtime code into a framework or backend unless the issue explicitly accepts that product-shape change.

## Pull Requests

- Explain user-facing behavior changes.
- Include tests for changed behavior.
- Run `npm run verify` before requesting review.
- Keep unrelated formatting churn out of the patch.

## Branches, Commits, And Releases

- Use short topic branches such as `feature/new-file-type` or `fix/qdrant-error-state`.
- Keep commits focused on one behavior, documentation, or infrastructure concern.
- Use imperative commit subjects, for example `Add feature map docs`.
- This project does not require a DCO or CLA.
- Releases follow `CHANGELOG.md`; update the `Unreleased` section before tagging.

## Maintainer Review

Maintainers should verify that each PR preserves the static-app boundary, keeps secrets out of browser settings, updates feature docs when behavior changes, and passes `npm run verify`.
