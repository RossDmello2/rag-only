# Configuration

LocalDoc RAG does not read `.env` files or process environment variables at runtime. Configuration lives in the browser Settings modal and is saved to browser `localStorage`.

## Settings

| Setting | Default | Notes |
| --- | --- | --- |
| Ollama URL | `http://localhost:11434` | Browser-reachable Ollama base URL |
| Qdrant URL | `http://localhost:6333` | Browser-reachable Qdrant base URL |
| Collection | `rag_documents` | Qdrant collection used for vectors |
| Embedding model | `mxbai-embed-large:latest` | Sent to Ollama `/api/embeddings` |
| Local chat model | `llama3.1:8b-instruct-q4_K_M` | Sent to Ollama `/api/chat` |
| Chunk size | `700` | Character-oriented chunk target |
| Chunk overlap | `150` | Overlap must be smaller than chunk size |
| Top K | `6` | Maximum retrieved Qdrant results |
| Score threshold | `0.2` | Minimum Qdrant score for retrieval |
| Memory turns | `4` | Number of recent turns included in prompts |

## What Not To Put In Settings

Do not store API keys, bearer tokens, passwords, cloud LLM keys, or production credentials in the browser. This static build intentionally has no cloud provider key fields.

Hosted model support should be added only behind a backend proxy with server-side secret storage.

## Local Service Assumptions

The browser must be allowed to call the configured Ollama and Qdrant URLs. If the app shows a network or CORS error, check:

- the service is running,
- the URL matches the browser-visible host and port,
- the service accepts requests from the app origin,
- the app is opened through localhost instead of `file://`.
