import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CURRENT_SCHEMA_VERSION,
  DEFAULTS,
  MAX_UPLOAD_BYTES,
  assertFileWithinLimit,
  buildCompletedFileFilter,
  buildDocFilter,
  formatError,
  guessMimeFromName,
  normalizeServiceUrl,
  splitText,
} from '../src/rag-core.js';

test('splitText uses no previous text when chunk overlap is zero', () => {
  const text = 'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda';
  const chunks = splitText(text, 21, 0);

  assert.ok(chunks.length > 1);
  assert.deepEqual(chunks, [
    'alpha beta gamma',
    'delta epsilon zeta',
    'eta theta iota kappa',
    'lambda',
  ]);
});

test('normalizeServiceUrl trims one or more trailing slashes and rejects unsupported protocols', () => {
  assert.equal(normalizeServiceUrl(' http://localhost:11434/// ', 'Ollama URL'), 'http://localhost:11434');
  assert.equal(normalizeServiceUrl('https://qdrant.example.com/', 'Qdrant URL'), 'https://qdrant.example.com');
  assert.throws(() => normalizeServiceUrl('', 'Ollama URL'), /Ollama URL is required/);
  assert.throws(() => normalizeServiceUrl('ftp://localhost:11434', 'Ollama URL'), /must start with http/);
});

test('assertFileWithinLimit rejects files larger than 25 MB before they are read', () => {
  assert.equal(MAX_UPLOAD_BYTES, 25 * 1024 * 1024);
  assert.doesNotThrow(() => assertFileWithinLimit({ name: 'small.txt', size: MAX_UPLOAD_BYTES }));
  assert.throws(
    () => assertFileWithinLimit({ name: 'huge.pdf', size: MAX_UPLOAD_BYTES + 1 }),
    /huge\.pdf is larger than 25 MB/
  );
});

test('guessMimeFromName maps supported extensions and falls back safely', () => {
  assert.equal(guessMimeFromName('report.pdf'), 'application/pdf');
  assert.equal(guessMimeFromName('notes.DOCX'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  assert.equal(guessMimeFromName('data.csv'), 'text/csv');
  assert.equal(guessMimeFromName('readme.txt'), 'text/plain');
  assert.equal(guessMimeFromName('archive.zip'), 'application/octet-stream');
});

test('buildCompletedFileFilter includes schema, model, chunking, and chunk count metadata', () => {
  const filter = buildCompletedFileFilter('abc123', DEFAULTS, 7);

  assert.deepEqual(filter, {
    must: [
      { key: 'file_hash', match: { value: 'abc123' } },
      { key: 'schema_version', match: { value: CURRENT_SCHEMA_VERSION } },
      { key: 'embedding_model', match: { value: DEFAULTS.embeddingModel } },
      { key: 'chunk_size', match: { value: DEFAULTS.chunkSize } },
      { key: 'chunk_overlap', match: { value: DEFAULTS.chunkOverlap } },
      { key: 'chunk_count', match: { value: 7 } },
      { key: 'ingestion_status', match: { value: 'complete' } },
    ],
  });
});

test('buildDocFilter scopes retrieval only when an active document exists', () => {
  assert.equal(buildDocFilter(''), undefined);
  assert.equal(buildDocFilter(null), undefined);
  assert.deepEqual(buildDocFilter('doc-1'), {
    must: [{ key: 'doc_id', match: { value: 'doc-1' } }],
  });
});

test('formatError maps common provider failures to user-safe messages', () => {
  assert.equal(formatError(new Error('401 invalid_api_key')), 'Authentication failed. Check your provider API key.');
  assert.equal(formatError(new Error('429 rate limit')), 'Rate limit reached. Slow down requests or lower concurrency.');
  assert.equal(formatError(new Error('boom')), 'boom');
});
