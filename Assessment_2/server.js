const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILES_DIR = path.join(__dirname, 'files');

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(res, status, data) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new HttpError(413, 'Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new HttpError(400, 'Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function resolveFilePath(rawName) {
  if (typeof rawName !== 'string' || rawName.trim() === '') {
    throw new HttpError(400, 'A valid filename is required');
  }
  let name = rawName.trim();
  if (name !== path.basename(name) || name.startsWith('.')) {
    throw new HttpError(400, 'Invalid filename');
  }
  if (!name.endsWith('.txt')) {
    name += '.txt';
  }
  return { name, fullPath: path.join(FILES_DIR, name) };
}

function mapFsError(err) {
  if (err.code === 'ENOENT') return new HttpError(404, 'File not found');
  if (err.code === 'EEXIST') return new HttpError(409, 'File already exists');
  return err;
}

async function listFiles(res) {
  const entries = await fs.promises.readdir(FILES_DIR);
  const files = entries.filter((f) => f.endsWith('.txt'));
  sendJson(res, 200, { files });
}

async function createFile(req, res) {
  const body = await readBody(req);
  const { name, fullPath } = resolveFilePath(body.filename);
  const content = typeof body.content === 'string' ? body.content : '';
  try {
    await fs.promises.writeFile(fullPath, content, { flag: 'wx' });
  } catch (err) {
    throw mapFsError(err);
  }
  sendJson(res, 201, { message: 'File created', filename: name });
}

async function readFile(name, fullPath, res) {
  try {
    const content = await fs.promises.readFile(fullPath, 'utf8');
    sendJson(res, 200, { filename: name, content });
  } catch (err) {
    throw mapFsError(err);
  }
}

async function updateFile(req, name, fullPath, res) {
  const body = await readBody(req);
  if (typeof body.content !== 'string') {
    throw new HttpError(400, 'content must be a string');
  }
  try {
    await fs.promises.access(fullPath);
    await fs.promises.writeFile(fullPath, body.content);
  } catch (err) {
    throw mapFsError(err);
  }
  sendJson(res, 200, { message: 'File updated', filename: name });
}

async function deleteFile(name, fullPath, res) {
  try {
    await fs.promises.unlink(fullPath);
  } catch (err) {
    throw mapFsError(err);
  }
  sendJson(res, 200, { message: 'File deleted', filename: name });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts[0] !== 'files' || parts.length > 2) {
      throw new HttpError(404, 'Route not found');
    }

    if (parts.length === 1) {
      if (req.method === 'GET') return await listFiles(res);
      if (req.method === 'POST') return await createFile(req, res);
      throw new HttpError(405, 'Method not allowed');
    }

    const { name, fullPath } = resolveFilePath(decodeURIComponent(parts[1]));

    if (req.method === 'GET') return await readFile(name, fullPath, res);
    if (req.method === 'PUT') return await updateFile(req, name, fullPath, res);
    if (req.method === 'DELETE') return await deleteFile(name, fullPath, res);
    throw new HttpError(405, 'Method not allowed');
  } catch (err) {
    const status = err.status || 500;
    sendJson(res, status, { error: status === 500 ? 'Internal server error' : err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});