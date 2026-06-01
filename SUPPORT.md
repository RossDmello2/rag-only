# Support

LocalDoc RAG is a local-first static browser app. Most setup problems come from the browser being unable to reach Ollama, Qdrant, or the static file server.

## Before Opening An Issue

Run:

```powershell
npm run check:syntax
npm test
npm run test:e2e
npm audit --audit-level=high
```

Also confirm:

- The app is opened through `http://127.0.0.1:8000/`, not `file://`.
- Ollama is reachable at the URL configured in Settings.
- Qdrant is reachable at the URL configured in Settings.
- The required Ollama embedding and chat models are installed locally.

Use synthetic or redacted examples in public issues. Do not upload private documents, real customer data, local database exports, API keys, browser cookies, or screenshots that expose sensitive file contents.

## Where To Ask

- Reproducible bugs: open a bug report with browser, Node, Ollama, and Qdrant versions.
- Focused feature proposals: open a feature request and explain whether it preserves the static-app boundary.
- Security issues: follow `SECURITY.md`; do not open a public issue for suspected vulnerabilities.
