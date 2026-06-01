# Productionization Plan

Date: 2026-05-17

## Product Shape

Keep the project as a static browser-only RAG assistant for local Ollama and Qdrant.

## Preservation

- Preserve existing local intelligence docs on disk, but keep them out of public git publication because they are stale analysis artifacts with local-machine context.
- Preserve the original root runtime as `docs/archive/script_fixed.legacy.js`.
- Keep the app source in plain HTML/CSS/JS.

## Runtime Changes

- Use `script.js` as the canonical runtime.
- Move testable pure logic into `src/rag-core.js`.
- Remove browser-side cloud key UI from the supported product surface.
- Add file size validation, URL validation, zero-overlap chunking fix, DOCX dependency failure messaging, focus handling, active-document retrieval scope, and stricter Qdrant dedupe metadata.

## Repository Changes

- Add README, license, contribution, conduct, security, changelog, GitHub templates, CI, Dependabot, and agent guidance.
- Add Node and Playwright dev tooling for repeatable verification.
- Do not add a backend, database, Dockerfile, or environment file in this pass.

## Verification Commands

```powershell
node --check script.js
npm test
npm run test:e2e
npm audit --audit-level=high
```

Also run a placeholder scan for unreplaced project, author, GitHub, and temporary planning tokens across `README.md`, `docs`, and `.github`.

## 2026-06-01 Continuation Pass

Goal: improve public GitHub contribution readiness without changing the static app product shape.

Files to modify:

- `README.md`, `package.json`, and `index.html` for project positioning, metadata, and discoverability.
- `CONTRIBUTING.md`, `SUPPORT.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/`, `.editorconfig`, and `.nvmrc` for contributor workflow and maintainer expectations.
- `docs/features/` for future feature ownership and extension guidance.
- `.gitignore` to keep old intelligence artifacts out of public git publication.
- `scripts/serve-static.js` and `tests/static-assets.test.js` for a narrow local-server robustness fix.

Files not to change:

- No backend, Dockerfile, environment file, cloud-key UI, or framework migration.
- No changes to `docs/archive/script_fixed.legacy.js`.

Verification commands:

```powershell
npm run check:syntax
npm test
npm run test:e2e
npm audit --audit-level=high
```
