# Architecture

LocalDoc RAG is a static browser-only RAG app.

## Runtime Flow

1. `index.html` loads `style.css`, Mammoth `1.12.0`, and `script.js`.
2. `script.js` binds the chat UI, loads local settings, and checks Ollama/Qdrant health.
3. Uploaded files are size-checked, parsed in the browser, chunked through `src/rag-core.js`, embedded through Ollama, and written to Qdrant.
4. Questions are embedded through Ollama, searched in Qdrant, scoped to the active document when available, and answered by the configured local Ollama chat model.

## Data Boundaries

- Browser localStorage stores non-secret settings.
- Browser memory stores the current file, active document id, and conversation turns.
- Qdrant stores vectors plus payload metadata.
- No backend or server-side secrets exist.

## Legacy Source

The pre-production runtime file is preserved at `docs/archive/script_fixed.legacy.js`. It is retained for traceability and is not loaded by the app.

## Feature Ownership

Feature-level behavior is documented in `docs/features/`. Runtime files stay intentionally small:

- Browser orchestration and service calls stay in `script.js`.
- Pure helpers with deterministic behavior stay in `src/rag-core.js`.
- User-facing structure and metadata stay in `index.html`.
- Responsive presentation stays in `style.css`.

When a future contribution changes behavior, update the owning feature document and the smallest matching test.
