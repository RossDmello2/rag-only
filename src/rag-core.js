export const CURRENT_SCHEMA_VERSION = 1;
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const DEFAULTS = {
  ollamaBaseUrl: 'http://localhost:11434',
  qdrantBaseUrl: 'http://localhost:6333',
  collectionName: 'rag_documents',
  embeddingModel: 'mxbai-embed-large:latest',
  localChatModel: 'llama3.1:8b-instruct-q4_K_M',
  chunkSize: 700,
  chunkOverlap: 150,
  topK: 6,
  scoreThreshold: 0.2,
  memoryTurns: 4,
};

export function normalizeServiceUrl(value, label) {
  const raw = String(value || '').trim();
  if (!raw) {
    throw new Error(`${label} is required.`);
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${label} must start with http:// or https://.`);
  }

  if (!url.hostname) {
    throw new Error(`${label} must include a host.`);
  }

  const path = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
  return `${url.protocol}//${url.host}${path}`;
}

export function clampNumber(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function clampFloat(value, min, max, fallback) {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function assertFileWithinLimit(file) {
  if (!file || !Number.isFinite(file.size)) return;
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name || 'Selected file'} is larger than 25 MB. Choose a smaller file or split it before uploading.`);
  }
}

export function splitText(text, chunkSize, chunkOverlap) {
  const cleaned = String(text || '').replace(/\r/g, '').trim();
  if (!cleaned) return [];

  const safeChunkSize = Math.max(1, Number(chunkSize) || DEFAULTS.chunkSize);
  const safeOverlap = Math.max(0, Math.min(Number(chunkOverlap) || 0, safeChunkSize - 1));
  const segments = cleaned.split(/\n\n+/).map(segment => segment.trim()).filter(Boolean);
  const chunks = [];
  let current = '';

  const flush = () => {
    const output = current.trim();
    if (output) chunks.push(output);
    current = '';
  };

  for (const segment of segments) {
    if (segment.length <= safeChunkSize) {
      const candidate = current ? `${current}\n\n${segment}` : segment;
      if (candidate.length <= safeChunkSize) {
        current = candidate;
      } else {
        flush();
        current = segment;
      }
      continue;
    }

    if (current) flush();

    const words = segment.split(/\s+/);
    let buffer = '';
    for (const word of words) {
      const candidate = buffer ? `${buffer} ${word}` : word;
      if (candidate.length <= safeChunkSize) {
        buffer = candidate;
      } else {
        if (buffer) chunks.push(buffer.trim());
        const overlap = safeOverlap > 0 ? buffer.slice(-safeOverlap).trim() : '';
        buffer = overlap ? `${overlap} ${word}` : word;
      }
    }
    if (buffer.trim()) chunks.push(buffer.trim());
  }

  if (current) flush();
  if (safeOverlap === 0) {
    return chunks.map(value => value.trim()).filter(Boolean);
  }

  const withOverlap = [];
  chunks.forEach((chunk, index) => {
    if (index === 0) {
      withOverlap.push(chunk);
      return;
    }
    const previousTail = withOverlap[index - 1].slice(-safeOverlap).trim();
    const merged = previousTail && !chunk.startsWith(previousTail)
      ? `${previousTail} ${chunk}`.slice(0, safeChunkSize + safeOverlap)
      : chunk;
    withOverlap.push(merged);
  });

  return withOverlap.map(value => value.trim()).filter(Boolean);
}

export function buildCompletedFileFilter(fileHash, settings, chunkCount) {
  return {
    must: [
      { key: 'file_hash', match: { value: fileHash } },
      { key: 'schema_version', match: { value: CURRENT_SCHEMA_VERSION } },
      { key: 'embedding_model', match: { value: settings.embeddingModel } },
      { key: 'chunk_size', match: { value: Number(settings.chunkSize) } },
      { key: 'chunk_overlap', match: { value: Number(settings.chunkOverlap) } },
      { key: 'chunk_count', match: { value: Number(chunkCount) } },
      { key: 'ingestion_status', match: { value: 'complete' } },
    ],
  };
}

export function buildDocFilter(docId) {
  if (!docId) return undefined;
  return {
    must: [
      { key: 'doc_id', match: { value: docId } },
    ],
  };
}

export function guessMimeFromName(name) {
  const lower = String(name || '').toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.txt')) return 'text/plain';
  return 'application/octet-stream';
}

export function formatError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/401/.test(message)) return 'Authentication failed. Check your provider API key.';
  if (/429/.test(message)) return 'Rate limit reached. Slow down requests or lower concurrency.';
  return message;
}
