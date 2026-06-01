# Document Ingestion

## User Behavior

Users can attach PDF, TXT, DOCX, or CSV files from the chat composer. The app reads the file in the browser, extracts text, chunks it, embeds each chunk with Ollama, and writes vectors plus payload metadata to Qdrant.

## Owning Files

- `index.html`: file input and composer controls.
- `script.js`: file selection, extraction, hashing, batching, Ollama embeddings, and Qdrant writes.
- `src/rag-core.js`: upload limit, MIME guessing, chunking, and dedupe filter helpers.

## Current Guardrails

- Files larger than 25 MB are rejected before reading.
- The app preserves a browser-only trust boundary.
- The active document id is stored in browser state so retrieval can stay scoped.
- The legacy runtime is archived in `docs/archive/script_fixed.legacy.js` and is not loaded.

## Tests

- `tests/core.test.js` covers upload limit, MIME guessing, chunking, and dedupe filters.
- `tests/static-assets.test.js` verifies local runtime asset wiring.
- `tests/app.spec.js` covers a mocked TXT ingestion and answer flow.

## Extension Points

- Add new file types by extending extraction in `script.js` and MIME mapping in `src/rag-core.js`.
- Add a test fixture for each new file type.
- Do not add cloud parsing services without a backend proxy and a security decision record.
