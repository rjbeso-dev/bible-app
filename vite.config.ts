/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ESV_API_KEY / NLT_API_KEY from .env.local (and the shell). These stay
  // on the dev server — they are injected into the proxied request and never
  // shipped to the browser. In production the equivalent is a Vercel serverless
  // function reading the same env vars (see /api/esv, /api/nlt).
  const env = loadEnv(mode, process.cwd(), '')
  const esvKey = env.ESV_API_KEY?.trim()
  const nltKey = env.NLT_API_KEY?.trim()

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Forward ESV requests to api.esv.org, injecting the Authorization
        // header server-side. Sidesteps browser CORS and hides the key.
        '/api/esv': {
          target: 'https://api.esv.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/esv/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (esvKey) proxyReq.setHeader('Authorization', `Token ${esvKey}`)
            })
          },
        },
        // Forward NLT requests to api.nlt.to, appending the key as a query param.
        '/api/nlt': {
          target: 'https://api.nlt.to',
          changeOrigin: true,
          rewrite: (path) => {
            const stripped = path.replace(/^\/api\/nlt/, '')
            if (!nltKey) return stripped
            const sep = stripped.includes('?') ? '&' : '?'
            return `${stripped}${sep}key=${encodeURIComponent(nltKey)}`
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
