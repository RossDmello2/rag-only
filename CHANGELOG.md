# Changelog

All notable changes to this project are documented here.

## Unreleased

### Added

- Real app screenshots under `docs/assets/screenshots/`.
- Beginner setup, configuration, architecture, troubleshooting, and screenshot documentation.
- Contributor-facing feature map under `docs/features/`.
- Repository discoverability and static deployment guidance.
- Browser metadata for clearer title, snippets, and social previews.

### Changed

- Expanded README for public GitHub presentation with preview images, tech stack, status, and verified commands.
- Expanded `.gitignore` to exclude local service data, traces, videos, private analysis notes, and common generated artifacts.
- Documented feature-change expectations in contributor and agent guidance.

### Fixed

- Hardened the local static dev server against malformed encoded request paths.

## 0.1.0 - 2026-05-17

### Added

- Canonical `script.js` runtime for the static RAG app.
- Shared `src/rag-core.js` helper module with unit coverage.
- Playwright browser smoke tests and mocked TXT RAG workflow test.
- Open-source repository files, CI workflow, Dependabot config, and operation docs.

### Changed

- Upgraded Mammoth CDN dependency from `1.8.0` to `1.12.0`.
- Removed cloud API key fields from the supported UI.
- Scoped retrieval to the active uploaded document when available.
- Archived the legacy `script_fixed.js` implementation under `docs/archive/`.

### Fixed

- Missing root `script.js` runtime.
- Zero-overlap chunking behavior.
- Blank or invalid service URL handling.
- Upload size validation before browser file reads.
