import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.min.mjs';
import {
  CURRENT_SCHEMA_VERSION,
  DEFAULTS as CORE_DEFAULTS,
  assertFileWithinLimit,
  buildCompletedFileFilter,
  buildDocFilter,
  clampFloat as clampFloatCore,
  clampNumber as clampNumberCore,
  formatError as formatErrorCore,
  guessMimeFromName as guessMimeFromNameCore,
  normalizeServiceUrl,
  splitText as splitTextCore,
} from './src/rag-core.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';

const DEFAULTS = CORE_DEFAULTS;
const STORAGE_KEY = 'ross-static-rag-settings';

const state = {
  settings: { ...DEFAULTS },
  pendingFile: null,
  activeDocId: null,
  conversation: [],
  isBusy: false,
  embeddingDimension: null,
  lastHealthCheck: null,
};

const ui = {};

document.addEventListener('DOMContentLoaded', () => {
  bindUi();
  loadSettings();
  populateSettingsModal();
  applyModeBadge();
  wireEvents();
  ensureProtocolNotice();
  openPanelWithWelcome();
  healthCheck().catch(() => undefined);
});

function bindUi() {
  ui.chatToggle = document.getElementById('chatToggle');
  ui.chatPanel = document.getElementById('chatPanel');
  ui.closePanel = document.getElementById('closePanel');
  ui.settingsButton = document.getElementById('settingsButton');
  ui.clearChatButton = document.getElementById('clearChatButton');
  ui.messages = document.getElementById('messages');
  ui.typingIndicator = document.getElementById('typingIndicator');
  ui.attachButton = document.getElementById('attachButton');
  ui.fileInput = document.getElementById('fileInput');
  ui.messageInput = document.getElementById('messageInput');
  ui.sendButton = document.getElementById('sendButton');
  ui.selectedFileBar = document.getElementById('selectedFileBar');
  ui.selectedFileName = document.getElementById('selectedFileName');
  ui.removeFileButton = document.getElementById('removeFileButton');
  ui.runtimeStatus = document.getElementById('runtimeStatus');
  ui.protocolWarning = document.getElementById('protocolWarning');
  ui.settingsModal = document.getElementById('settingsModal');
  ui.closeSettings = document.getElementById('closeSettings');
  ui.saveSettingsButton = document.getElementById('saveSettingsButton');
  ui.healthCheckButton = document.getElementById('healthCheckButton');
  ui.modeBadge = document.getElementById('modeBadge');
  ui.ollamaStatus = document.getElementById('ollamaStatus');
  ui.qdrantStatus = document.getElementById('qdrantStatus');

  ui.ollamaUrlInput = document.getElementById('ollamaUrlInput');
  ui.qdrantUrlInput = document.getElementById('qdrantUrlInput');
  ui.collectionInput = document.getElementById('collectionInput');
  ui.embeddingModelInput = document.getElementById('embeddingModelInput');
  ui.localChatModelInput = document.getElementById('localChatModelInput');
  ui.chunkSizeInput = document.getElementById('chunkSizeInput');
  ui.chunkOverlapInput = document.getElementById('chunkOverlapInput');
  ui.topKInput = document.getElementById('topKInput');
  ui.scoreThresholdInput = document.getElementById('scoreThresholdInput');
  ui.memoryTurnsInput = document.getElementById('memoryTurnsInput');
}

function wireEvents() {
  ui.chatToggle.addEventListener('click', () => togglePanel(true));
  ui.closePanel.addEventListener('click', () => togglePanel(false));
  ui.settingsButton.addEventListener('click', openSettings);
  ui.closeSettings.addEventListener('click', closeSettings);
  ui.clearChatButton.addEventListener('click', clearChat);
  ui.attachButton.addEventListener('click', () => ui.fileInput.click());
  ui.fileInput.addEventListener('change', onFileSelected);
  ui.removeFileButton.addEventListener('click', clearPendingFile);
  ui.sendButton.addEventListener('click', onSend);
  ui.saveSettingsButton.addEventListener('click', saveSettingsFromModal);
  ui.healthCheckButton.addEventListener('click', async () => {
    await healthCheck();
  });

  ui.messageInput.addEventListener('input', autoGrow);
  ui.messageInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  });

  ui.settingsModal.addEventListener('click', event => {
    if (event.target === ui.settingsModal) {
      closeSettings();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !ui.settingsModal.classList.contains('hidden')) {
      closeSettings();
    }
    if (event.key === 'Tab' && !ui.settingsModal.classList.contains('hidden')) {
      trapModalFocus(event);
    }
  });
}

function togglePanel(open) {
  ui.chatPanel.classList.toggle('hidden', !open);
  if (open) {
    ui.messageInput.focus();
  }
}

function openSettings() {
  state.lastFocusedElement = document.activeElement;
  ui.settingsModal.classList.remove('hidden');
  ui.ollamaUrlInput.focus();
}

function closeSettings() {
  ui.settingsModal.classList.add('hidden');
  if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
    state.lastFocusedElement.focus();
  }
}

function trapModalFocus(event) {
  const focusable = Array.from(ui.settingsModal.querySelectorAll(
    'button, input, textarea, select, [href], [tabindex]:not([tabindex="-1"])'
  )).filter(element => !element.disabled && element.offsetParent !== null);

  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openPanelWithWelcome() {
  togglePanel(true);
  appendMessage('assistant', [
    'Hello. This is the static replacement for your n8n document RAG workflow.',
    '',
    'Supported uploads: PDF, TXT, DOCX, CSV.',
    'Flow: ingest locally -> embed with Ollama -> store in Qdrant -> retrieve -> answer with your local chat model.',
    'Browser runs on the host, so localhost endpoints are correct here.'
  ].join('\n'));
}

function ensureProtocolNotice() {
  if (window.location.protocol === 'file:') {
    ui.protocolWarning.classList.remove('hidden');
    setRuntimeStatus('Serve this app with localhost. Direct file:// mode is not reliable for fetch requests.', true);
  }
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state.settings = { ...DEFAULTS, ...saved };
  } catch {
    state.settings = { ...DEFAULTS };
  }
}

function populateSettingsModal() {
  ui.ollamaUrlInput.value = state.settings.ollamaBaseUrl;
  ui.qdrantUrlInput.value = state.settings.qdrantBaseUrl;
  ui.collectionInput.value = state.settings.collectionName;
  ui.embeddingModelInput.value = state.settings.embeddingModel;
  ui.localChatModelInput.value = state.settings.localChatModel;
  ui.chunkSizeInput.value = String(state.settings.chunkSize);
  ui.chunkOverlapInput.value = String(state.settings.chunkOverlap);
  ui.topKInput.value = String(state.settings.topK);
  ui.scoreThresholdInput.value = String(state.settings.scoreThreshold);
  ui.memoryTurnsInput.value = String(state.settings.memoryTurns);
}

function applyModeBadge() {
  ui.modeBadge.textContent = 'Local';
}

function saveSettingsFromModal() {
  let newSettings;
  try {
    newSettings = {
      ollamaBaseUrl: normalizeUrl(ui.ollamaUrlInput.value, 'Ollama URL'),
      qdrantBaseUrl: normalizeUrl(ui.qdrantUrlInput.value, 'Qdrant URL'),
      collectionName: ui.collectionInput.value.trim() || DEFAULTS.collectionName,
      embeddingModel: ui.embeddingModelInput.value.trim() || DEFAULTS.embeddingModel,
      localChatModel: ui.localChatModelInput.value.trim() || DEFAULTS.localChatModel,
      chunkSize: clampNumber(ui.chunkSizeInput.value, 200, 3000, DEFAULTS.chunkSize),
      chunkOverlap: clampNumber(ui.chunkOverlapInput.value, 0, 1000, DEFAULTS.chunkOverlap),
      topK: clampNumber(ui.topKInput.value, 1, 20, DEFAULTS.topK),
      scoreThreshold: clampFloat(ui.scoreThresholdInput.value, 0, 1, DEFAULTS.scoreThreshold),
      memoryTurns: clampNumber(ui.memoryTurnsInput.value, 0, 12, DEFAULTS.memoryTurns),
    };
  } catch (error) {
    setRuntimeStatus(formatError(error), true);
    return;
  }

  if (newSettings.chunkOverlap >= newSettings.chunkSize) {
    setRuntimeStatus('Chunk overlap must be smaller than chunk size.', true);
    return;
  }

  state.settings = newSettings;
  state.embeddingDimension = null;
  state.activeDocId = null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

  applyModeBadge();
  closeSettings();
  setRuntimeStatus('Settings saved. Re-checking services...', false);
  healthCheck().catch(() => undefined);
}

function normalizeUrl(value, label) {
  return normalizeServiceUrl(value, label);
}

function clampNumber(value, min, max, fallback) {
  return clampNumberCore(value, min, max, fallback);
}

function clampFloat(value, min, max, fallback) {
  return clampFloatCore(value, min, max, fallback);
}

function autoGrow() {
  ui.messageInput.style.height = '44px';
  ui.messageInput.style.height = `${Math.min(ui.messageInput.scrollHeight, 120)}px`;
}

function onFileSelected(event) {
  const [file] = event.target.files || [];
  if (!file) return;

  try {
    assertFileWithinLimit(file);
  } catch (error) {
    ui.fileInput.value = '';
    setRuntimeStatus(formatError(error), true);
    return;
  }

  state.pendingFile = file;
  ui.selectedFileName.textContent = `${file.name} (${formatBytes(file.size)})`;
  ui.selectedFileBar.classList.remove('hidden');
  setRuntimeStatus(`Selected ${file.name}.`, false);
}

function clearPendingFile() {
  state.pendingFile = null;
  ui.fileInput.value = '';
  ui.selectedFileBar.classList.add('hidden');
  ui.selectedFileName.textContent = '';
}

function clearChat() {
  state.conversation = [];
  ui.messages.innerHTML = '';
  appendMessage('assistant', 'Chat cleared. Your vectors remain in Qdrant.');
}

async function onSend() {
  if (state.isBusy) return;

  const text = ui.messageInput.value.trim();
  const file = state.pendingFile;

  if (!text && !file) return;

  state.isBusy = true;
  setUiBusy(true);

  try {
    const userDisplay = text || 'File upload';
    appendMessage('user', userDisplay, file ? file.name : '');
    ui.messageInput.value = '';
    autoGrow();

    let ingestionResult = null;
    if (file) {
      showTyping(true);
      setRuntimeStatus(`Processing ${file.name}...`, false);
      ingestionResult = await ingestFile(file);
      clearPendingFile();
    }

    if (file && !text) {
      const message = ingestionResult?.deduped
        ? 'This file was already embedded in the current collection, so ingestion was skipped.'
        : `[OK] ${file.name} was processed and stored successfully. You can now ask questions about it.`;
      appendMessage('assistant', message);
      setRuntimeStatus('Ready.', false);
      return;
    }

    if (text) {
      showTyping(true);
      setRuntimeStatus('Retrieving context and generating answer...', false);
      const answer = await answerQuestion(text, ingestionResult);
      appendMessage('assistant', answer);
      pushConversation(text, answer);
      setRuntimeStatus('Ready.', false);
    }
  } catch (error) {
    console.error(error);
    appendMessage('assistant', formatError(error));
    setRuntimeStatus(formatError(error), true);
  } finally {
    showTyping(false);
    state.isBusy = false;
    setUiBusy(false);
  }
}

function setUiBusy(busy) {
  ui.sendButton.disabled = busy;
  ui.attachButton.disabled = busy;
  ui.messageInput.disabled = busy;
  ui.fileInput.disabled = busy;
}

function showTyping(show) {
  ui.typingIndicator.classList.toggle('hidden', !show);
  scrollMessages();
}

function appendMessage(role, content, fileName = '') {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  if (fileName) {
    const fileTag = document.createElement('div');
    fileTag.className = 'meta-file';
    fileTag.textContent = fileName;
    wrapper.appendChild(fileTag);
  }

  const body = document.createElement('div');
  body.textContent = content;
  wrapper.appendChild(body);

  ui.messages.appendChild(wrapper);
  scrollMessages();
}

function scrollMessages() {
  ui.messages.scrollTop = ui.messages.scrollHeight;
}

function setRuntimeStatus(message, isError = false) {
  ui.runtimeStatus.textContent = message;
  ui.runtimeStatus.style.color = isError ? '#ffb3bc' : 'var(--muted)';
}

async function healthCheck() {
  updateServicePill(ui.ollamaStatus, 'Ollama', 'unknown');
  updateServicePill(ui.qdrantStatus, 'Qdrant', 'unknown');

  const [ollamaOk, qdrantOk] = await Promise.all([
    pingOllama().catch(() => false),
    pingQdrant().catch(() => false)
  ]);

  updateServicePill(ui.ollamaStatus, 'Ollama', ollamaOk ? 'ok' : 'error');
  updateServicePill(ui.qdrantStatus, 'Qdrant', qdrantOk ? 'ok' : 'error');

  if (ollamaOk && qdrantOk) {
    setRuntimeStatus('Ollama and Qdrant are reachable.', false);
  } else {
    setRuntimeStatus('One or more local services are unreachable. Check CORS and service startup.', true);
  }

  state.lastHealthCheck = { ollamaOk, qdrantOk, at: new Date().toISOString() };
}

function updateServicePill(element, label, stateLabel) {
  element.textContent = label;
  element.className = 'status-pill';
  if (stateLabel === 'ok') element.classList.add('status-ok');
  else if (stateLabel === 'error') element.classList.add('status-error');
  else element.classList.add('status-unknown');
}

async function pingOllama() {
  const response = await fetchWithTimeout(`${state.settings.ollamaBaseUrl}/api/tags`, { method: 'GET' }, 5000);
  return response.ok;
}

async function pingQdrant() {
  const response = await fetchWithTimeout(`${state.settings.qdrantBaseUrl}/collections`, { method: 'GET' }, 5000);
  return response.ok;
}

async function ingestFile(file) {
  assertFileWithinLimit(file);
  await ensureCollectionReady();
  const arrayBuffer = await file.arrayBuffer();
  const fileHash = await sha256(arrayBuffer);

  const extracted = await extractTextFromFile(file, arrayBuffer);
  if (!extracted.text.trim()) {
    throw new Error('No usable text was extracted. Scanned PDFs need OCR, which this static build does not include.');
  }

  const chunks = splitText(extracted.text, state.settings.chunkSize, state.settings.chunkOverlap);
  if (!chunks.length) {
    throw new Error('Text extraction succeeded but chunking produced no content.');
  }

  const existing = await fileAlreadyIndexed(fileHash, chunks.length);
  if (existing) {
    state.activeDocId = existing.doc_id || null;
    return {
      deduped: true,
      docId: existing.doc_id || null,
      fileHash,
      fileName: file.name,
      chunkCount: chunks.length,
    };
  }

  const docId = crypto.randomUUID();
  const points = [];
  const batchSize = 3;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    setRuntimeStatus(`Embedding chunks ${i + 1}-${Math.min(i + batch.length, chunks.length)} of ${chunks.length}...`, false);

    const embedded = await Promise.all(batch.map(async (chunk, index) => {
      const vector = await generateEmbedding(chunk);
      return {
        id: crypto.randomUUID(),
        vector,
        payload: {
          text: chunk,
          source: file.name,
          source_type: file.type || guessMimeFromName(file.name),
          file_hash: fileHash,
          doc_id: docId,
          chunk_index: i + index,
          chunk_count: chunks.length,
          chunk_size: Number(state.settings.chunkSize),
          chunk_overlap: Number(state.settings.chunkOverlap),
          embedding_model: state.settings.embeddingModel,
          schema_version: CURRENT_SCHEMA_VERSION,
          ingestion_status: 'complete',
          uploaded_at: new Date().toISOString(),
          byte_size: file.size,
        }
      };
    }));

    points.push(...embedded);
  }

  for (let i = 0; i < points.length; i += 32) {
    const batch = points.slice(i, i + 32);
    await qdrantRequest(`/collections/${encodeURIComponent(state.settings.collectionName)}/points?wait=true`, {
      method: 'PUT',
      body: JSON.stringify({ points: batch })
    });
  }

  state.activeDocId = docId;
  return {
    deduped: false,
    docId,
    fileHash,
    fileName: file.name,
    chunkCount: points.length,
  };
}

async function extractTextFromFile(file, arrayBuffer) {
  const name = file.name.toLowerCase();
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      setRuntimeStatus(`Reading PDF page ${pageNumber} of ${pdf.numPages}...`, false);
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (pageText) pages.push(`[Page ${pageNumber}] ${pageText}`);
    }

    return { text: pages.join('\n\n'), pageCount: pdf.numPages };
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.docx')) {
    if (!window.mammoth?.extractRawText) {
      throw new Error('DOCX support failed to load. Check the Mammoth CDN script and reload the page.');
    }
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return { text: (result.value || '').trim(), pageCount: null };
  }

  if (file.type === 'text/plain' || file.type === 'text/csv' || name.endsWith('.txt') || name.endsWith('.csv')) {
    const text = new TextDecoder().decode(arrayBuffer);
    return { text: text.trim(), pageCount: null };
  }

  throw new Error('Unsupported file type. Allowed types are PDF, TXT, DOCX, CSV.');
}

function splitText(text, chunkSize, chunkOverlap) {
  return splitTextCore(text, chunkSize, chunkOverlap);
}

async function fileAlreadyIndexed(fileHash, chunkCount) {
  const response = await qdrantRequest(`/collections/${encodeURIComponent(state.settings.collectionName)}/points/scroll`, {
    method: 'POST',
    body: JSON.stringify({
      limit: chunkCount,
      with_payload: true,
      with_vector: false,
      filter: buildCompletedFileFilter(fileHash, state.settings, chunkCount)
    })
  });

  const points = response.result?.points || response.result || [];
  if (!Array.isArray(points) || points.length < chunkCount) {
    return null;
  }

  return points[0]?.payload || {};
}

async function answerQuestion(question, ingestionResult = null) {
  await ensureCollectionReady();
  const queryVector = await generateEmbedding(question);
  const activeDocId = ingestionResult?.docId || state.activeDocId;
  const filter = buildDocFilter(activeDocId);

  const searchResponse = await qdrantRequest(`/collections/${encodeURIComponent(state.settings.collectionName)}/points/search`, {
    method: 'POST',
    body: JSON.stringify({
      vector: queryVector,
      limit: state.settings.topK,
      with_payload: true,
      score_threshold: state.settings.scoreThreshold,
      ...(filter ? { filter } : {}),
    })
  });

  const results = searchResponse.result || [];
  if (!Array.isArray(results) || results.length === 0) {
    return "I couldn't find that information in the uploaded documents. Please ensure the correct file has been uploaded.";
  }

  const context = results
    .map((item, index) => {
      const payload = item.payload || {};
      return [
        `Chunk ${index + 1}`,
        `Source: ${payload.source || 'unknown'}`,
        `Score: ${typeof item.score === 'number' ? item.score.toFixed(3) : 'n/a'}`,
        `Text: ${payload.text || ''}`
      ].join('\n');
    })
    .join('\n\n---\n\n');

  const systemPrompt = [
    'You are a document assistant.',
    'Use only the supplied retrieval context.',
    'Do not use outside knowledge.',
    'If the answer is not in the context, reply exactly: "I couldn\'t find that information in the uploaded documents. Please ensure the correct file has been uploaded."',
    'Be direct and concise.',
    'Do not expose chain-of-thought.'
  ].join(' ');

  const memoryMessages = state.conversation
    .slice(-state.settings.memoryTurns * 2)
    .map(item => ({ role: item.role, content: item.content }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...memoryMessages,
    {
      role: 'user',
      content: `Context:\n${context}\n\nQuestion:\n${question}`
    }
  ];

  return ollamaChat(messages);
}

function pushConversation(question, answer) {
  state.conversation.push({ role: 'user', content: question });
  state.conversation.push({ role: 'assistant', content: answer });
  const maxMessages = state.settings.memoryTurns * 2;
  if (state.conversation.length > maxMessages) {
    state.conversation = state.conversation.slice(-maxMessages);
  }
}

async function ollamaChat(messages) {
  const response = await fetchJson(`${state.settings.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: state.settings.localChatModel,
      messages,
      stream: false,
      options: {
        temperature: 0.15,
        num_ctx: 4096,
        num_predict: 1024,
      }
    })
  }, 120000);

  const content = response.message?.content?.trim();
  if (!content) throw new Error('Ollama returned an empty answer.');
  return content;
}

async function ensureCollectionReady() {
  const dim = await getEmbeddingDimension();
  const collectionName = encodeURIComponent(state.settings.collectionName);

  const response = await fetchWithTimeout(`${state.settings.qdrantBaseUrl}/collections/${collectionName}`, {
    method: 'GET'
  }, 8000);

  if (response.status === 404) {
    await qdrantRequest(`/collections/${collectionName}`, {
      method: 'PUT',
      body: JSON.stringify({
        vectors: {
          size: dim,
          distance: 'Cosine'
        }
      })
    });
    return;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qdrant collection check failed: ${text || response.statusText}`);
  }

  const existing = await response.json();
  const size = existing.result?.config?.params?.vectors?.size
    || existing.result?.config?.params?.vectors?.default?.size
    || null;

  if (size && Number(size) !== Number(dim)) {
    throw new Error(`Embedding dimension mismatch. Collection uses ${size}, current embedding model returns ${dim}. Create a fresh collection or switch models.`);
  }
}

async function getEmbeddingDimension() {
  if (state.embeddingDimension) return state.embeddingDimension;
  const vector = await generateEmbedding('dimension probe');
  state.embeddingDimension = vector.length;
  return state.embeddingDimension;
}

async function generateEmbedding(text) {
  const response = await fetchJson(`${state.settings.ollamaBaseUrl}/api/embeddings`, {
    method: 'POST',
    body: JSON.stringify({
      model: state.settings.embeddingModel,
      prompt: text,
    })
  }, 120000);

  if (!Array.isArray(response.embedding) || response.embedding.length === 0) {
    throw new Error('Embedding generation failed or returned no vector.');
  }

  return response.embedding;
}

async function qdrantRequest(path, options) {
  return fetchJson(`${state.settings.qdrantBaseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body,
  }, 30000);
}

async function fetchJson(url, options = {}, timeoutMs = 30000) {
  const response = await fetchWithTimeout(url, options, timeoutMs);
  const rawText = await response.text();
  let payload = null;

  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    payload = { rawText };
  }

  if (!response.ok) {
    const message = payload?.status?.error
      || payload?.error
      || payload?.message
      || payload?.rawText
      || response.statusText;
    throw new Error(`${response.status} ${message}`.trim());
  }

  return payload;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out for ${url}`);
    }
    if (String(error.message || '').includes('Failed to fetch')) {
      throw new Error(`Network/CORS failure for ${url}. Check service is running and allows your browser origin.`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function sha256(arrayBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function guessMimeFromName(name) {
  return guessMimeFromNameCore(name);
}

function formatError(error) {
  return formatErrorCore(error);
}
