# Deployment

LocalDoc RAG is deployable as a static site, but only for environments where the user's browser can safely reach Ollama and Qdrant.

## Static Hosting

Serve these files together:

- `index.html`
- `style.css`
- `script.js`
- `src/rag-core.js`

The runtime also depends on jsDelivr-hosted browser bundles for Mammoth and PDF.js. There is no vendored offline fallback in this repository.

The local development server is:

```powershell
npm run serve
```

Then open:

```text
http://127.0.0.1:8000/
```

## Public Internet Boundary

Do not publish this as a public multi-user RAG service without adding:

- Authentication and authorization.
- A backend proxy for Ollama, Qdrant, and any hosted model provider.
- Server-side secret storage.
- Request validation and rate limiting.
- Qdrant access control and collection isolation.
- Upload scanning and persistence rules.

## Suitable Targets

- Local static server for development and demos.
- GitHub Pages, Netlify, Vercel, or any static host for controlled demos where users configure trusted local services.

## Unsuitable Targets Without More Architecture

- Public multi-user chat service.
- Hosted cloud LLM product.
- Shared Qdrant-backed document platform.

Those require a backend-proxy feature and a new product-shape decision.

## Deployment Metadata

Do not set a GitHub repository website/homepage URL until a real hosted demo exists and has been smoke-tested. A source repository URL is accurate; a live product URL is not currently configured.
