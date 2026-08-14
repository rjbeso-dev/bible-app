// Vercel serverless function: authenticated reverse-proxy for the ESV search endpoint.
// See api/esv/text.ts for why this is a fixed, single-segment route rather
// than a `[...path]` catch-all.
import type { VercelRequest, VercelResponse } from '@vercel/node'

const UPSTREAM = 'https://api.esv.org/v3/passage/search/'

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
  res.setHeader('cache-control', upstream.ok ? 'public, max-age=86400' : 'no-store')
  res.send(body)
}
