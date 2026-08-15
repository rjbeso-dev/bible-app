// Vercel serverless function: authenticated reverse-proxy for API.Bible's
// chapter endpoint, used for NIV, Amplified, and NASB.
//
// The browser calls `/api/bible/chapter?bibleId=...&usfm=GEN.1` with no key.
// This function injects the `api-key` header (a Vercel Project env var) and
// forwards to rest.api.bible, so the key never reaches the client. Locally
// this role is played by the Vite dev proxy in vite.config.ts.
//
// Fixed, single-segment route rather than a `[...path]` catch-all — see
// api/esv/text.ts for why.
//
// Configure the key once in the Vercel dashboard: Settings → Environment
// Variables → API_BIBLE_KEY. Get a free key at https://api.bible/.
import type { VercelRequest, VercelResponse } from '@vercel/node'

const UPSTREAM = 'https://rest.api.bible/v1/bibles'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.API_BIBLE_KEY?.trim()
  if (!key) {
    res.status(503).json({ error: 'API_BIBLE_KEY is not configured on this deployment.' })
    return
  }

  const incoming = new URL(req.url ?? '/', 'http://internal')
  const bibleId = incoming.searchParams.get('bibleId')
  const usfm = incoming.searchParams.get('usfm')
  if (!bibleId || !usfm) {
    res.status(400).json({ error: 'Missing bibleId or usfm query param.' })
    return
  }

  const target = new URL(`${UPSTREAM}/${encodeURIComponent(bibleId)}/chapters/${encodeURIComponent(usfm)}`)
  target.searchParams.set('content-type', 'text')
  target.searchParams.set('include-verse-numbers', 'true')
  target.searchParams.set('include-titles', 'false')
  target.searchParams.set('include-notes', 'false')
  target.searchParams.set('include-chapter-numbers', 'false')
  target.searchParams.set('fums-version', '3')

  let upstream: Response
  try {
    upstream = await fetch(target, { headers: { 'api-key': key } })
  } catch {
    res.status(502).json({ error: 'Could not reach API.Bible.' })
    return
  }

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json')
  res.setHeader('cache-control', upstream.ok ? 'public, max-age=86400' : 'no-store')
  res.send(body)
}
