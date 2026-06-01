# Local RAG Chat

## User Behavior

After a document is indexed, users ask a question in the composer. The app embeds the question with Ollama, searches Qdrant, builds a compact cited context, and asks the configured local Ollama chat model for an answer.

## Owning Files

- `script.js`: question handling, Qdrant search, context assembly, conversation memory, and Ollama chat call.
- `src/rag-core.js`: active-document filter construction and user-safe error formatting.
- `tests/app.spec.js`: mocked RAG workflow across Ollama and Qdrant.

## Current Guardrails

- Retrieval is scoped to the active uploaded document when an active document exists.
- Conversation memory is bounded by the Settings value.
- Cloud provider keys are intentionally unsupported in the static UI.
- Provider failures are formatted for users without exposing stack traces.

## Tests

- `tests/core.test.js` covers document filters and error formatting.
- `tests/app.spec.js` verifies the prompt receives retrieved document context and returns a visible answer.

## Extension Points

- Add reranking or citation UI only after adding deterministic tests around result ordering and display.
- Add cloud LLMs only behind a backend proxy with server-side secret handling.
- Keep prompt and retrieval changes visible in this document so future contributors can review behavior quickly.
