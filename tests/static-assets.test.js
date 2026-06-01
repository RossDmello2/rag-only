import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('index.html references existing local runtime assets', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  const localRefs = [...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g)]
    .map(match => match[1])
    .filter(ref => !/^https?:\/\//.test(ref));

  assert.ok(localRefs.includes('style.css'));
  assert.ok(localRefs.includes('script.js'));

  for (const ref of localRefs) {
    assert.equal(existsSync(resolve(root, ref)), true, `${ref} should exist`);
  }
});

test('Mammoth CDN dependency is pinned to a version fixed for GHSA-rmjr-87wv-gf87', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');

  assert.match(html, /mammoth@1\.12\.0\/mammoth\.browser\.min\.js/);
  assert.doesNotMatch(html, /mammoth@1\.8\.0/);
});

test('static dev server returns 404 for malformed encoded paths instead of crashing', async (t) => {
  const port = await getFreePort();
  const server = spawn(process.execPath, ['scripts/serve-static.js', '.', String(port)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  t.after(() => {
    if (!server.killed) server.kill();
  });

  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(([code]) => {
      throw new Error(`static server exited before test request with code ${code}`);
    }),
  ]);

  const response = await fetch(`http://127.0.0.1:${port}/%E0%A4%A`);
  assert.equal(response.status, 404);
});

async function getFreePort() {
  const probe = createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const { port } = probe.address();
  probe.close();
  await once(probe, 'close');
  return port;
}
