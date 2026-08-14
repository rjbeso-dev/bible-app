// Vercel serverless function: authenticated reverse-proxy for the NLT API.
//
// The browser calls `/api/nlt/api/passages?ref=...` with no key. This function
// appends `key=${NLT_API_KEY}` (a Vercel Project env var) and forwards to
// api.nlt.to, so the key never reaches the client. Locally this role is played
// by the Vite dev proxy in vite.config.ts.
//
// Configure the key once in the Vercel dashboard: Settings → Environment
// Variables → NLT_API_KEY. Get a free key at https://api.nlt.to/.

const UPSTREAM = 'https://api.nlt.to'

// This handler uses the Web Fetch API signature (Request → Response), which
// only Vercel's Edge Runtime understands — the default Node.js runtime expects
// a (req, res) callback instead and crashes (FUNCTION_INVOCATION_FAILED) if it
// receives a returned Response object. This config line is required.
export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const key = process.env.NLT_API_KEY?.trim()
  if (!key) {
    return json({ error: 'NLT_API_KEY is not configured on this deployment.' }, 503)
  }

  const incoming = new URL(req.url)
  const path = incoming.pathname.replace(/^\/api\/nlt\/?/, '')
  const target = new URL(`${UPSTREAM}/${path}`)
  target.search = incoming.search
  target.searchParams.set('key', key)

  let upstream: Response
  try {
    upstream = await fetch(target)
  } catch {
    return json({ error: 'Could not reach the NLT service.' }, 502)
  }

  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'text/html; charset=utf-8',
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
