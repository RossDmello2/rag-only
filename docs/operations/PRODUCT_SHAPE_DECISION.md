# Product Shape Decision

Date: 2026-05-17

## Decision

Primary shape: static browser-only RAG app.

Secondary shape: local AI/RAG workflow that depends on Ollama and Qdrant.

## Evidence

| Evidence | Meaning |
|---|---|
| `index.html:9` loads `script.js` as a browser module | Static browser entrypoint |
| `index.html:52` accepts `.pdf,.txt,.docx,.csv` | Document ingestion UI |
| `script.js:418` implements file ingestion | RAG ingestion is client-side |
| `script.js:559` implements question answering | Retrieval and local chat are client-side |
| `src/rag-core.js:4` defines browser settings defaults | Runtime configuration is local, not environment-driven |

## Accepted Surface

- Static HTML/CSS/JS app.
- Local browser settings.
- Dev-only Node test tooling.

## Rejected Surface

- Expo conversion: no Expo project files exist.
- Backend proxy: useful for cloud keys, but outside this static-only pass.
- `.env.example`: no environment variables are read by the app.

## Verification Gates

- `node --check script.js`
- `npm test`
- `npm run test:e2e`
- `npm audit --audit-level=high`

## 2026-06-01 Reaffirmation

The selected product shape remains a static browser-only RAG app. The continuation pass added contributor docs, metadata, CodeQL, and local-server hardening only. It did not add a backend, framework, hosted model provider, cloud-key flow, or database.
