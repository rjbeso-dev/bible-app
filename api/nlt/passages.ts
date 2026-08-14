// Vercel serverless function: authenticated reverse-proxy for the NLT passages endpoint.
//
// The browser calls `/api/nlt/passages?ref=...` with no key. This function
// appends `key=${NLT_API_KEY}` (a Vercel Project env var) and forwards to
// api.nlt.to/api/passages, so the key never reaches the client. Locally this
// role is played by the Vite dev proxy in vite.config.ts.
//
// Fixed, single-segment route rather than a `[...path]` catch-all — see
// api/esv/text.ts for why.
//
// Configure the key once in the Vercel dashboard: Settings → Environment
// Variables → NLT_API_KEY. Get a free key at https://api.nlt.to/.
import type { VercelRequest, VercelResponse } from '@vercel/node'

const UPSTREAM = 'https://api.nlt.to/api/passages'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.NLT_API_KEY?.trim()
  if (!key) {
    res.status(503).json({ error: 'NLT_API_KEY is not configured on this deployment.' })
    return
  }

  const incoming = new URL(req.url ?? '/', 'http://internal')
  const target = new URL(UPSTREAM)
  target.search = incoming.search
  target.searchParams.set('key', key)

  let upstream: Response
  try {
    upstream = await fetch(target)
  } catch {
    res.status(502).json({ error: 'Could not reach the NLT service.' })
    return
  }

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('content-type', upstream.headers.get('content-type') ?? 'text/html; charset=utf-8')
  res.setHeader('cache-control', upstream.ok ? 'public, max-age=86400' : 'no-store')
  res.send(body)
}
