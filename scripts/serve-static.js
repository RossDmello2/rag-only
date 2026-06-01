import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number.parseInt(process.argv[3] || '8000', 10);

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveRequestPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const requested = decoded === '/' ? '/index.html' : decoded;
  const target = resolve(join(root, requested));
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    return null;
  }
  return target;
}

const server = createServer((request, response) => {
  const target = resolveRequestPath(request.url || '/');
  if (!target || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': types[extname(target)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(target).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
});
