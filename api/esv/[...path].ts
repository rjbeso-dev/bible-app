// Vercel serverless function: authenticated reverse-proxy for the ESV API.
//
// The browser calls `/api/esv/v3/passage/text/?q=...` with no key. This function
// injects `Authorization: Token ${ESV_API_KEY}` (a Vercel Project env var) and
// forwards to api.esv.org, so the key never reaches the client. Locally this
// role is played by the Vite dev proxy in vite.config.ts.
//
// Configure the key once in the Vercel dashboard: Settings → Environment
// Variables → ESV_API_KEY. Get a free key at https://api.esv.org/.
//
// Runs on the standard Node.js runtime rather than Edge: Edge's catch-all
// route matching ([...path].ts) only reliably invoked for single-segment
// paths in production, silently 404ing on the multi-segment passage paths
// this proxy actually needs (verified via Vercel function logs — deeper
// paths never appeared as invocations at all). The Node runtime's catch-all
// matching is the older, more mature mechanism and doesn't share that gap.
import type { VercelRequest, VercelResponse } from '@vercel/node'

const UPSTREAM = 'https://api.esv.org'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.ESV_API_KEY?.trim()
  if (!key) {
    res.status(503).json({ error: 'ESV_API_KEY is not configured on this deployment.' })
    return
  }

  const incoming = new URL(req.url ?? '/', 'http://internal')
  const path = incoming.pathname.replace(/^\/api\/esv\/?/, '')
  const target = new URL(`${UPSTREAM}/${path}`)
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
