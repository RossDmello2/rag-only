import { test, expect } from '@playwright/test';

test('renders the static RAG chat on desktop without startup console errors', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Document Assistant' })).toBeVisible();
  await expect(page.getByLabel('Document assistant')).toBeVisible();
  await expect(page.getByText('Supported uploads: PDF, TXT, DOCX, CSV.')).toBeVisible();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Assistant settings' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Assistant settings' })).toBeHidden();

  expect(consoleErrors).toEqual([]);
});

test('uses the mobile full-screen chat layout without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const panel = page.getByLabel('Document assistant');
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(Math.round(box.width)).toBe(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('ingests a TXT file and answers through mocked Ollama and Qdrant', async ({ page }) => {
  const qdrantPoints = [];
  const searchRequests = [];
  const chatRequests = [];

  await page.route('https://cdn.jsdelivr.net/npm/mammoth@1.12.0/mammoth.browser.min.js', route => route.fulfill({
    contentType: 'text/javascript',
    body: 'window.mammoth = { extractRawText: async () => ({ value: "" }) };',
  }));

  await page.route('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.min.mjs', route => route.fulfill({
    contentType: 'text/javascript',
    body: 'export const GlobalWorkerOptions = {}; export function getDocument() { throw new Error("PDF parsing is not used in this test."); }',
  }));

  await page.route('**/api/tags', route => route.fulfill({ json: { models: [] } }));
  await page.route('**/api/embeddings', async route => {
    const request = route.request().postDataJSON();
    const seed = String(request.prompt || '').length / 100;
    await route.fulfill({ json: { embedding: [seed, seed + 0.1, seed + 0.2] } });
  });
  await page.route('**/api/chat', async route => {
    chatRequests.push(route.request().postDataJSON());
    await route.fulfill({ json: { message: { content: 'The project name is Apollo.' } } });
  });

  await page.route('**/collections', route => route.fulfill({ json: { result: { collections: [] } } }));
  await page.route('**/collections/rag_documents', route => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 404, json: { status: { error: 'Not found' } } });
    }
    return route.fulfill({ json: { result: true } });
  });
  await page.route('**/collections/rag_documents/points/scroll', route => route.fulfill({
    json: { result: { points: [] } },
  }));
  await page.route('**/collections/rag_documents/points?wait=true', async route => {
    qdrantPoints.push(...route.request().postDataJSON().points);
    await route.fulfill({ json: { result: { operation_id: 1, status: 'completed' } } });
  });
  await page.route('**/collections/rag_documents/points/search', async route => {
    searchRequests.push(route.request().postDataJSON());
    const firstPoint = qdrantPoints[0];
    await route.fulfill({
      json: {
        result: [{
          score: 0.99,
          payload: firstPoint.payload,
        }],
      },
    });
  });

  await page.goto('/');
  await page.setInputFiles('#fileInput', {
    name: 'sample.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('The local project name is Apollo. This text is enough to embed.'),
  });
  await page.getByPlaceholder('Upload a file, ask a question, or do both.').fill('What is the project name?');
  await page.getByLabel('Send').click();

  await expect(page.getByText('The project name is Apollo.')).toBeVisible();
  expect(qdrantPoints).toHaveLength(1);
  expect(qdrantPoints[0].payload).toMatchObject({
    source: 'sample.txt',
    embedding_model: 'mxbai-embed-large:latest',
    chunk_count: 1,
    ingestion_status: 'complete',
  });
  expect(searchRequests[0].filter.must[0]).toEqual({
    key: 'doc_id',
    match: { value: qdrantPoints[0].payload.doc_id },
  });
  expect(chatRequests[0].messages.at(-1).content).toContain('The local project name is Apollo.');
});
