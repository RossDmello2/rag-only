# Open Source Landscape

Date: 2026-05-17

## Applied Patterns

- Keep static browser tools free of server assumptions.
- Provide exact local run and test commands in README.
- Document credential boundaries clearly for client-only apps.
- Add CI and dependency update automation even for small static projects.
- Preserve historical source in an archive path instead of deleting it.

## Security Sources Checked

- OSV `GHSA-rmjr-87wv-gf87`: Mammoth versions before `1.11.0` are affected by a DOCX directory traversal issue.
- npm registry: `npm view mammoth version` returned `1.12.0`.

## What Was Not Copied

- Full-stack RAG templates were not copied because this project intentionally remains static.
- Hosted cloud-key patterns were not copied because client-side API keys are not acceptable for production.

## 2026-06-01 Source Refresh

Primary sources inspected for the continuation pass:

- GitHub Docs, "Creating a default community health file": community health files include contribution, conduct, security, issue, and pull request guidance.
- GitHub Docs, "Classifying your repository with topics": topics help people find and contribute to repositories; topic names should be lowercase, hyphenated when needed, 50 characters or less, and no more than 20 topics.
- Google Search Central, "SEO Starter Guide": title links and snippets are influenced by clear page titles, visible content, and concise page-specific descriptions.
- Google Search Central, "How to write meta descriptions": quality meta descriptions should summarize the page clearly instead of listing keywords.
- GitHub CodeQL Action repository/docs: `github/codeql-action/*@v4` is the current major tag for CodeQL workflows.

Applied decisions:

- Added repository metadata, keywords, and Node engine metadata to `package.json`.
- Added focused HTML title, description, Open Graph, and Twitter card metadata to `index.html`.
- Added GitHub topic recommendations to `README.md` and `docs/seo-discoverability.md`.
- Added CodeQL workflow as a lightweight JavaScript code-scanning baseline.
- Kept all SEO copy truthful: local-first, browser-only, Ollama/Qdrant required, no cloud keys.
