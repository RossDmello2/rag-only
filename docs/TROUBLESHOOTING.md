# Troubleshooting

## The App Opens But Ollama Or Qdrant Is Red

Check that the service is running and reachable from the browser:

```powershell
curl http://localhost:11434/api/tags
curl http://localhost:6333/collections
```

If the command works but the browser fails, inspect the browser console for CORS or network errors.

## The Browser Warns About `file://`

Serve the project through the local static server:

```powershell
npm run serve
```

Then open:

```text
http://127.0.0.1:8000/
```

## PDF Upload Extracts No Text

The app uses PDF.js text extraction. Scanned image-only PDFs need OCR, which this static build does not include.

## DOCX Upload Fails

DOCX parsing depends on the pinned Mammoth browser bundle loaded from jsDelivr. Confirm the browser can reach that CDN URL and reload the page.

## Qdrant Reports An Embedding Dimension Mismatch

The existing collection was created with a different embedding model dimension. Use a fresh collection name in Settings or switch back to the model used when the collection was created.

## Tests Fail Because Playwright Cannot Find Chromium

Install the browser dependency:

```powershell
npx playwright install chromium
```

Then rerun:

```powershell
npm run test:e2e
```

## `npm audit` Reports A High Severity Advisory

Do not hide it in the README or release notes. Update the affected dependency if possible, rerun:

```powershell
npm audit --audit-level=high
```

If the fix requires a runtime behavior change, update the matching feature document and test.
