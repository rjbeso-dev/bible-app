// Vercel serverless function: authenticated reverse-proxy for the ESV passage-text endpoint.
//
// The browser calls `/api/esv/text?q=...` with no key. This function injects
// `Authorization: Token ${ESV_API_KEY}` (a Vercel Project env var) and forwards
// to api.esv.org/v3/passage/text/, so the key never reaches the client.
// Locally this role is played by the Vite dev proxy in vite.config.ts.
//
// Fixed, single-segment route rather than a `[...path]` catch-all: Vercel's
// Vite-preset build step compiles catch-all API routes to a regex that only
// matches one path segment (`[^/]+`), confirmed directly in the generated
// `.vercel/output/config.json` — so a genuine multi-segment catch-all silently
// 404s on deeper paths in production. This proxy only ever needs one upstream
// endpoint, so hardcoding it here sidesteps that bug entirely.
//
// Configure the key once in the Vercel dashboard: Settings → Environment
// Variables → ESV_API_KEY. Get a free key at https://api.esv.org/.
import type { VercelRequest, VercelResponse } from '@vercel/node'

const UPSTREAM = 'https://api.esv.org/v3/passage/text/'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.ESV_API_KEY?.trim()
  if (!key) {
    res.status(503).json({ error: 'ESV_API_KEY is not configured on this deployment.' })
    return
  }

  const incoming = new URL(req.url ?? '/', 'http://internal')
  const target = new URL(UPSTREAM)
  target.search = incoming.search

  let upstream: Response
  try {
    upstream = await fetch(target, {
      headers: { Authorization: `Token ${key}` },
    })
  } catch {
    res.status(502).json({ error: 'Could not reach the ESV service.' })
    return
  }

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json')
  // Cache successful passages at the edge for a day; they never change.
  res.setHeader('cache-control', upstream.ok ? 'public, max-age=86400' : 'no-store')
  res.send(body)
}
