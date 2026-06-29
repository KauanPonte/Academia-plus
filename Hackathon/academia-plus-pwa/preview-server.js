import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 4173)
const distDir = path.join(__dirname, 'dist')

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

function resolveFile(url) {
  const requested = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname)
  const normalized = path.normalize(path.join(distDir, requested))

  if (!normalized.startsWith(distDir)) return null
  if (existsSync(normalized) && !normalized.endsWith(path.sep)) return normalized
  return path.join(distDir, 'index.html')
}

const server = http.createServer(async (request, response) => {
  const file = resolveFile(request.url || '/')
  if (!file) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  try {
    const content = await readFile(file)
    response.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
    })
    response.end(content)
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Academia+ preview: http://127.0.0.1:${port}/login`)
})
