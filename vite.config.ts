import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createExportPng } from './server/exportPng'
import type { ExportPayload } from './server/exportPng'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const readJsonBody = async (req: any) => {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const localExportPlugin = () => ({
  name: 'local-export-plugin',
  configureServer(server: any) {
    server.middlewares.use('/api/export', async (req: any, res: any, next: any) => {
      if (req.method !== 'POST') {
        next()
        return
      }

      try {
        const payload = await readJsonBody(req) as ExportPayload
        const address = server.httpServer?.address()
        const port = typeof address === 'object' && address ? address.port : 4173
        const buffer = await createExportPng(`http://127.0.0.1:${port}`, payload)

        res.statusCode = 200
        res.setHeader('Content-Type', 'image/png')
        res.setHeader('Content-Disposition', `attachment; filename="${payload.fileName}"`)
        res.end(buffer)
      } catch (error) {
        console.error(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(error instanceof Error ? error.message : 'Export failed')
      }
    })
  }
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localExportPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        exportRender: path.resolve(__dirname, 'export-render.html'),
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
