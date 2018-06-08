import fs from 'fs'
import http from 'http'
import path from 'path'
import util from 'util'

const { Server } = http
const port = 5000
const src = '.'
const readFile = util.promisify(fs.readFile)
const plainHeader = { 'Content-Type': 'text/plain' }
const reExt = /\.(mjs|js|css)$/

const mimes = new Map()
  .set('.js', 'text/javascript')
  .set('.mjs', 'text/javascript')
  .set('.css', 'text/cess')
  .set('.html', 'text/html')

const internalError = (request, response) => {
  response.writeHead(500, plainHeader)
  response.end('Internal server error')
}

const pageNotFound = (request, response) => {
  response.writeHead(404, plainHeader)
  response.end('Page not found')
}

const handleRoot = async (request, response) => {
  try {
    const body = await readFile(path.join(src, '/index.html'))
    response.writeHead(200, { 'Content-Type': mimes.get('.html') })
    response.end(body)
  } catch (error) {
    return internalError(request, response)
  }
}

const handleModule = async (request, response) => {
  try {
    const ext = path.parse(request.url).ext
    const filepath = path.join(src, request.url)
    const body = await readFile(filepath)
    response.writeHead(200, { 'Content-Type': mimes.get(ext) })
    response.end(body)
  } catch (error) {
    return pageNotFound(request, response)
  }
}

const onRequest = (request, response) => {
  console.log(`[${request.method}] ${request.url}`)

  switch (true) {
    case request.url === '/': return handleRoot(request, response)
    case reExt.test(request.url): return handleModule(request, response)
    default: return pageNotFound(request, response)
  }
}

const server = new Server(onRequest)

server.listen(port, () => {
  console.log(`Server started http://localhost:${port}`)
})

fs.watch(src, { recursive: true }, (event, filename) => {
  console.log(`\n - filechanged: ${filename}`)
  server.close()
  server.listen(port, () => {
    console.log(`Restarting server http://localhost:${port}`)
  })
})
