# Getting Started

This guide takes a fresh clone to a running local `rag-only` app.

## 1. Install Node Dependencies

```powershell
git clone https://github.com/RossDmello2/rag-only.git
cd rag-only
npm install
npx playwright install chromium
```

The project requires Node.js 22 or newer. The local development machine used for this publication pass had Node `v24.8.0` and npm `11.6.0`.

## 2. Start The Static App

```powershell
npm run serve
```

Open:

```text
http://127.0.0.1:8000/
```

Use localhost serving instead of opening `index.html` directly. Direct `file://` mode can block browser requests to local services.

## 3. Start Local RAG Services

For real document chat, the browser must reach Ollama and Qdrant.

```powershell
ollama pull mxbai-embed-large:latest
ollama pull llama3.1:8b-instruct-q4_K_M
docker run --rm -p 6333:6333 qdrant/qdrant
```

The defaults in Settings are:

- Ollama URL: `http://localhost:11434`
- Qdrant URL: `http://localhost:6333`
- Collection: `rag_documents`
- Embedding model: `mxbai-embed-large:latest`
- Chat model: `llama3.1:8b-instruct-q4_K_M`

## 4. Try A Safe Local Workflow

1. Open the app.
2. Confirm the Ollama and Qdrant status pills become green.
3. Attach a small TXT, PDF, DOCX, or CSV file.
4. Ask a question about that file.
5. The app embeds chunks with Ollama, stores vectors in Qdrant, retrieves matching chunks, and asks the configured local chat model for an answer.

## 5. Run Verification

```powershell
npm run check:syntax
npm test
npm run test:e2e
npm audit --audit-level=high
```

For one command:

```powershell
npm run verify
```

The browser workflow test uses mocked Ollama and Qdrant responses so it can run safely in CI without local AI services.
