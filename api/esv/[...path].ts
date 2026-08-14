// Vercel serverless function: authenticated reverse-proxy for the ESV API.
//
// The browser calls `/api/esv/v3/passage/text/?q=...` with no key. This function
// injects `Authorization: Token ${ESV_API_KEY}` (a Vercel Project env var) and
// forwards to api.esv.org, so the key never reaches the client. Locally this
// role is played by the Vite dev proxy in vite.config.ts.
//
// Configure the key once in the Vercel dashboard: Settings → Environment
// Variables → ESV_API_KEY. Get a free key at https://api.esv.org/.

const UPSTREAM = 'https://api.esv.org'

// This handler uses the Web Fetch API signature (Request → Response), which
// only Vercel's Edge Runtime understands — the default Node.js runtime expects
// a (req, res) callback instead and crashes (FUNCTION_INVOCATION_FAILED) if it
// receives a returned Response object. This config line is required.
export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const key = process.env.ESV_API_KEY?.trim()
  if (!key) {
    return json({ error: 'ESV_API_KEY is not configured on this deployment.' }, 503)
  }

  const incoming = new URL(req.url)
  const path = incoming.pathname.replace(/^\/api\/esv\/?/, '')
  const target = new URL(`${UPSTREAM}/${path}`)
  target.search = incoming.search

  let upstream: Response
  try {
    upstream = await fetch(target, {
      headers: { Authorization: `Token ${key}` },
    })
  } catch {
    return json({ error: 'Could not reach the ESV service.' }, 502)
  }

  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      // Cache successful passages at the edge for a day; they never change.
      'cache-control': upstream.ok ? 'public, max-age=86400' : 'no-store',
    },
  })
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
