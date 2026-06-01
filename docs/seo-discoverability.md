# SEO And Discoverability

This project cannot guarantee top placement in GitHub or web search. It can make the repository clearer, more specific, and easier for search systems and developers to classify.

## Applied In This Repository

- Clear project title in `README.md` and `index.html`.
- Specific meta description and social preview tags in `index.html`.
- Package metadata with repository, bug tracker, license, engine, and keyword fields.
- Feature documentation under `docs/features/` so project scope is machine-readable and contributor-readable.
- Security, support, contribution, issue, PR, CI, and Dependabot files for GitHub community health.
- A real screenshot set under `docs/assets/screenshots/`.
- A conceptual social-preview image under `docs/assets/brand/` that is not represented as a product screenshot.

## Current GitHub Topics

GitHub topics should describe the repository's actual purpose, stack, and use case:

```text
rag
retrieval-augmented-generation
document-chat
ollama
qdrant
local-first
browser
static-site
vector-search
pdf-chat
javascript
document-search
document-qa
semantic-search
local-llm
```

Use no more than 20 topics, keep them lowercase, and prefer hyphen-separated topic names.

Avoid topics such as `offline`, `langchain`, `webllm`, `chroma`, `faiss`, `agentic-rag`, `serverless`, or `production-ready` unless the source code changes to support those claims.

## Repository About Text

Recommended GitHub About description:

```text
LocalDoc RAG: browser-only local document RAG for PDF/TXT/DOCX/CSV chat with Ollama, Qdrant, and plain JavaScript.
```

Leave the website field empty until a working hosted demo exists. Do not invent a GitHub Pages, Netlify, Vercel, or other homepage URL before it has been deployed and smoke-tested.

## Naming Strategy

The repository slug was renamed from `rag-only` to `local-doc-rag` after explicit owner approval. The source package/app identifier still appears as `rag-only` in protected runtime/package files until a separate core-file edit is approved.

See [Naming And SEO Strategy](NAMING_SEO_STRATEGY.md) for the scored candidate matrix and recommendation.

## Social Preview

Prepared asset:

```text
docs/assets/brand/social-preview.jpg
```

This file is supporting artwork, not a screenshot. GitHub repository social previews are uploaded manually from repository settings; keeping the file in the repo does not automatically set the live social preview.

## Source Basis

- [GitHub Docs: Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics) - repository topics help people find and contribute to projects, and topic names should use lowercase letters, numbers, and hyphens, with no more than 20 topics.
- [GitHub Docs: Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories) - repository search can match repository name, description, topics, and README content.
- [Google Search Central: snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet) - snippets are primarily generated from page content, and Google may use a useful page-specific meta description when it better describes the page.
- [GitHub Docs: Social media preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview) - social-preview images are configured in repository settings and should be at least 1280 by 640 pixels for best display.
