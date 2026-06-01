# Naming And SEO Strategy

Generated: 2026-06-01

This report is a source-grounded identity and discoverability pass for `rag-only`. It recommends presentation and metadata changes only. It does not authorize renaming the GitHub repository; a repository rename still needs explicit owner approval because it changes URLs, clones, and downstream references.

## Current Identity Audit

| Area | Current state | Evidence |
| --- | --- | --- |
| Repository | `RossDmello2/rag-only` | `gh repo view RossDmello2/rag-only` reported a public repo with default branch `main`. |
| README title | `rag-only: Local Browser RAG Assistant` before this pass | `README.md` before this update. |
| Package name | `rag-only` | `package.json` declares `"name": "rag-only"`. |
| GitHub description before this pass | `Static local-first document RAG assistant for Ollama, Qdrant, and browser-only PDF/TXT/DOCX/CSV chat.` | `gh repo view RossDmello2/rag-only`. |
| Topics before this pass | `browser`, `document-chat`, `local-first`, `ollama`, `pdf-chat`, `qdrant`, `rag`, `retrieval-augmented-generation`, `static-site`, `vector-search` | `gh repo view RossDmello2/rag-only --json repositoryTopics`. |
| First-paragraph clarity | Accurate but a little dense for non-technical visitors | The original opening led with static/local-first/RAG/Ollama/Qdrant in one sentence. |
| Visual quality | Real screenshots are truthful and sanitized; supporting brand visual was missing | `docs/assets/screenshots/` and `docs/SCREENSHOTS.md`. |

What is working:

- The current slug is short and distinctive.
- The README already states the real stack and limitations.
- Screenshots are real product captures with sanitized mocked data.
- Community files, CI, CodeQL, Dependabot, and feature docs are already present.

What is weak:

- `rag-only` is memorable but not self-explanatory in search results without a strong description.
- Exact phrases such as `browser-only RAG` and `static browser RAG` appear less common than `document chat`, `PDF chat`, `Ollama`, `Qdrant`, and `local RAG`.
- The README needed a clearer first five seconds for non-technical visitors.
- GitHub social preview needs manual upload; storing an image in the repo does not automatically set the repository preview.

## Source-Backed Project Identity

`rag-only` is a static browser document RAG assistant. The runtime is `index.html`, `style.css`, `script.js`, and `src/rag-core.js`; Node is used for local serving and tests, not as an app backend.

Strongest differentiators:

- Browser-only runtime: the product UI is loaded from static files and calls local services directly.
- Local AI boundary: default Ollama URL is `http://localhost:11434`, and default Qdrant URL is `http://localhost:6333`.
- Supported document types: PDF, TXT, DOCX, and CSV.
- No browser-side cloud model key fields in the supported UI.
- Small architecture that is easier to inspect than framework-heavy RAG apps.

Strongest use cases:

- Learning the RAG flow from document parsing to chunking, embedding, vector storage, retrieval, and answer generation.
- Local demo of Ollama + Qdrant document chat on a trusted machine.
- Starting point for a future backend-proxy architecture.
- Source reference for static-app boundaries, browser settings, and local-service caveats.

Target users:

- Beginner developers learning RAG.
- Intermediate developers comparing local AI app shapes.
- Local AI users already running Ollama.
- Engineers evaluating browser-only tradeoffs.
- Maintainers who want a compact open-source example with tests and docs.

Boundaries and limitations:

- It is not a public multi-user RAG platform.
- It has no backend API, authentication, authorization, migrations, queue, scheduler, payment, or email workflow.
- It does not include OCR for scanned PDFs.
- It depends on jsDelivr-hosted PDF.js and Mammoth bundles at runtime.
- It is local-first, not fully offline.
- Real Ollama and Qdrant service verification depends on the user running those services locally.

## Search Intent Matrix

| Persona | Likely search query | Relevant keywords | What they need to see | Topic candidates |
| --- | --- | --- | --- | --- |
| Beginner RAG learner | `local RAG example Ollama Qdrant` | local RAG, Ollama, Qdrant, retrieval augmented generation | Plain explanation, architecture diagram, quick start | `rag`, `retrieval-augmented-generation`, `ollama`, `qdrant` |
| Local AI builder | `chat with documents ollama qdrant` | document chat, local LLM, PDF chat, vector search | Real screenshots, service defaults, model names | `document-chat`, `pdf-chat`, `local-llm`, `vector-search` |
| Static web developer | `browser only RAG JavaScript` | browser-only, static site, JavaScript, client-side | No-backend boundary, file structure, limitations | `browser`, `static-site`, `javascript`, `client-side` |
| Engineer evaluating safety | `browser RAG no cloud API keys` | no backend, no cloud keys, local-first | Security notes and what not to deploy publicly | `local-first`, `document-search`, `semantic-search` |
| Recruiter or non-technical visitor | `document AI local assistant` | document assistant, local AI, document QA | What it does, visual proof, who it is for | `document-qa`, `local-ai`, `ai-assistant` |

## Similar Repo Pattern Scan

Observed pattern from live GitHub and web research:

- `chat with PDF` and `document chat` are common user-facing phrases.
- High-signal local RAG repos often include `ollama`, `rag`, `qdrant`, `local-ai`, `llm`, or `vector-database` topics.
- Many adjacent projects use Python, Streamlit, LangChain, or full backend stacks; this repo's static browser-only shape is the differentiator.
- Names like `local-rag`, `ragbase`, `ClientRAG`, `chatd`, and `ai-localbase` show that short names work best when the description carries the searchable stack.
- README previews work best when real screenshots come before deep setup details and generated images are clearly conceptual.

Comparable repository examples:

| Repository | Pattern observed | Relevance to `rag-only` |
| --- | --- | --- |
| [curiousily/ragbase](https://github.com/curiousily/ragbase) | Local RAG with "chat with PDF documents" language and topics such as `rag`, `retrieval-augmented-generation`, and `streamlit` | Good evidence that `local RAG`, `chat with PDF`, and `RAG` are common discovery terms; stack is different. |
| [poloclub/mememo](https://github.com/poloclub/mememo) | Browser-oriented vector search/RAG positioning | Useful adjacent pattern for `browser`, `document-search`, `rag`, and `vector-search` language. |
| [sady4850/ClientRAG](https://github.com/sady4850/ClientRAG) | Client-side PDF semantic search / local embedding framing | Useful comparison for client-side/browser-side search language; implementation details differ. |
| [b4s36t4/local-rag](https://github.com/b4s36t4/local-rag) | Local RAG naming with `pdf-chat` style positioning | Supports using `local-rag`, `pdf-chat`, and document-chat keywords. |
| [BruceMacD/chatd](https://github.com/BruceMacD/chatd) | "Chat with your documents using local AI" phrasing | Good plain-English problem framing for non-technical visitors. |
| [veyliss/ai-localbase](https://github.com/veyliss/ai-localbase) | Local-first AI knowledge base using Ollama/Qdrant/RAG topics | Confirms Ollama + Qdrant + RAG topic cluster, though it is not a static browser-only app. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) and [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | Larger local/self-hosted AI product ecosystem | Useful only as adjacent language; do not copy multi-user/platform claims. |

Useful naming patterns:

- Clear category cue: `Document`, `RAG`, `Local`, `Browser`, `Ollama`.
- Short slug plus explicit description.
- Plain problem statement: "chat with local documents".

Overused or risky patterns:

- `AI platform`, `enterprise`, `production-ready`, or `agentic` when not source-backed.
- `offline` or `100% private` when CDN dependencies and browser-to-service networking exist.
- Tool names not used in the source, such as LangChain, Chroma, WebLLM, FastAPI, or Streamlit.

## Candidate Names

Scores are 1-10. Higher is better.

| Name | Repo slug | Clarity | Memorability | Searchability | Honesty | Domain fit | Beginner appeal | Professional credibility | Uniqueness | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| rag-only | `rag-only` | 6 | 8 | 6 | 9 | 8 | 6 | 8 | 8 | Current name; concise, but needs a descriptive subtitle. |
| LocalDoc RAG | `local-doc-rag` | 9 | 7 | 9 | 9 | 9 | 9 | 8 | 6 | Best plain-English rename candidate. |
| BrowserDoc RAG | `browser-doc-rag` | 9 | 7 | 8 | 9 | 9 | 8 | 8 | 7 | Strongly signals static browser workflow. |
| Ollama Qdrant Document Chat | `ollama-qdrant-document-chat` | 10 | 5 | 10 | 10 | 10 | 8 | 8 | 5 | Searchable but long. |
| Local Document Chat | `local-document-chat` | 9 | 7 | 9 | 8 | 8 | 9 | 7 | 5 | Very clear, but broad and less distinctive. |
| StaticRAG Chat | `static-rag-chat` | 8 | 7 | 8 | 9 | 9 | 7 | 8 | 7 | Good category cue for developers. |
| ClientRAG Lite | `client-rag-lite` | 7 | 7 | 7 | 8 | 7 | 6 | 7 | 5 | Risks confusion with existing ClientRAG-style projects. |
| Qdrant Doc Chat | `qdrant-doc-chat` | 8 | 6 | 8 | 9 | 8 | 7 | 8 | 6 | Emphasizes vector store, underplays Ollama. |
| Ollama Doc Chat | `ollama-doc-chat` | 9 | 7 | 9 | 9 | 8 | 8 | 8 | 6 | Strong for Ollama users, underplays Qdrant. |
| Browser RAG Workbench | `browser-rag-workbench` | 8 | 7 | 8 | 8 | 8 | 7 | 8 | 6 | "Workbench" may imply broader controls than present. |
| Local RAG Workbench | `local-rag-workbench` | 8 | 7 | 8 | 8 | 8 | 7 | 8 | 5 | Useful but more generic. |
| DocVector Chat | `doc-vector-chat` | 7 | 7 | 7 | 8 | 7 | 7 | 7 | 7 | Descriptive but less tied to RAG search language. |
| Qdrant Ollama RAG | `qdrant-ollama-rag` | 9 | 6 | 10 | 10 | 9 | 7 | 8 | 6 | Strong search match, less product-like. |
| NoBackend RAG | `no-backend-rag` | 8 | 8 | 8 | 8 | 8 | 7 | 7 | 7 | Accurate for runtime shape but focuses on absence. |
| Browser File RAG | `browser-file-rag` | 8 | 6 | 8 | 9 | 8 | 8 | 7 | 7 | Clear but less polished. |
| PrivateDoc RAG | `private-doc-rag` | 8 | 7 | 8 | 6 | 7 | 8 | 6 | 6 | Risky because privacy depends on trusted local setup and no public exposure. |
| OfflineDoc RAG | `offline-doc-rag` | 8 | 7 | 8 | 4 | 7 | 8 | 5 | 6 | Reject: CDN dependencies mean offline is not source-backed. |
| Agentic Document RAG | `agentic-document-rag` | 6 | 6 | 7 | 3 | 4 | 5 | 5 | 5 | Reject: no agent orchestration exists. |

## Top 3 Recommended Names

### 1. Keep `rag-only` As The Repo Slug For Now

- Display name: `rag-only`
- README title: `rag-only`
- Tagline: `Browser-only document RAG for local Ollama + Qdrant.`
- GitHub description: `Browser-only local document RAG for PDF/TXT/DOCX/CSV chat with Ollama, Qdrant, and plain JavaScript.`
- Recommended topics: `rag`, `retrieval-augmented-generation`, `document-chat`, `pdf-chat`, `ollama`, `qdrant`, `local-first`, `browser`, `static-site`, `vector-search`, `javascript`, `document-search`, `document-qa`, `semantic-search`, `local-llm`
- Risk/tradeoff: the slug is less self-explanatory than `local-doc-rag`, so the README opening and GitHub description must carry the search terms.

### 2. Rename Candidate: `LocalDoc RAG`

- Display name: `LocalDoc RAG`
- Repo slug: `local-doc-rag`
- Tagline: `Local document chat with Ollama, Qdrant, and a static browser UI.`
- GitHub description: `Static local document RAG assistant for PDF/TXT/DOCX/CSV chat using Ollama, Qdrant, and browser JavaScript.`
- Recommended topics: same as above.
- Risk/tradeoff: better search clarity, but renaming breaks the existing `rag-only` URL unless redirects are relied on.

### 3. Rename Candidate: `BrowserDoc RAG`

- Display name: `BrowserDoc RAG`
- Repo slug: `browser-doc-rag`
- Tagline: `A no-backend browser workflow for local document retrieval and chat.`
- GitHub description: `Browser-only document RAG app for local Ollama and Qdrant workflows, built with plain JavaScript.`
- Recommended topics: same as above plus `client-side` if the maintainer wants that framing.
- Risk/tradeoff: strong runtime signal, but less natural than `LocalDoc RAG` for people searching by problem.

## Rejected Names

- `OfflineDoc RAG`: misleading because PDF.js and Mammoth are loaded from jsDelivr and no vendored offline fallback exists.
- `PrivateDoc RAG`: too strong unless deployment and local-service binding are controlled.
- `Agentic Document RAG`: no agent loop, tools, planner, or orchestration layer exists.
- `RAG Enterprise`: no enterprise architecture, auth, or production hardening.
- `NotebookLM Alternative`: not source-backed and invites a misleading comparison.

## Final Recommendation

Keep the actual GitHub repository slug as `rag-only` unless the owner explicitly approves a rename. The best immediate improvement is to keep the short distinctive name while making the title, first paragraph, GitHub description, topics, screenshots, and social preview explain the exact project category.

If a rename is approved later, the strongest slug is:

```text
local-doc-rag
```

Potential rename command only after explicit approval:

```powershell
gh repo rename local-doc-rag --repo RossDmello2/rag-only
```

Do not run that command without owner approval.

## Research Sources

- [GitHub Docs: Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics) - repository topics help classify projects by purpose, subject area, community, or language; topic names should use lowercase letters, numbers, and hyphens, be 50 characters or less, and use no more than 20 topics.
- [GitHub Docs: Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories) - repository search can match repository name, description, topics, and README content using qualifiers such as `in:readme` and `topic:TOPIC`.
- [Google Search Central: snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet) - snippets are primarily created from page content, and Google may use a relevant page-specific meta description when it better describes the page.
- [GitHub Docs: Customizing a repository social media preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview) - social-preview images are uploaded in repository settings; best display is at least 1280 by 640 pixels, and PNG/JPG/GIF should be under 1 MB.
