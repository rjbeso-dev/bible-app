// NLT (New Living Translation) source. Copyrighted — served through a
// server-side proxy at `/api/nlt` that injects the NLT_API_KEY (a Vite dev-proxy
// query param in `npm run dev`, a Vercel serverless function in production). The
// browser never sees or supplies a key.
//
// Endpoint:
//   GET /api/nlt/api/passages?ref={ref}&version=NLT
// Response: HTML containing <verse_export data-vn="n"> elements.

import type { Chapter, Verse } from '../types'
import type { GetChapterOptions, Translation } from './bibleSource'
import { NetworkError, NotConfiguredError, NotFoundError, ParseError } from './bibleSource'
import { getBook } from '../data/books'

export const NLT_TRANSLATION: Translation = {
  id: 'nlt',
  name: 'New Living Translation',
  language: 'English',
  group: 'licensed',
  readingLevel: 'Modern (thought-for-thought)',
  note: 'NLT, © Tyndale House Foundation. Served via the site’s configured NLT API key.',
  licensed: true,
}

function referenceQuery(book: string, chapter: number): string {
  const name = getBook(book)?.name ?? book
  return `${name} ${chapter}`
}

/**
 * Parse the NLT HTML payload into Verse[].
 *
 * The payload nests verses in malformed <p> markup (stray unclosed <p> tags,
 * inconsistent wrappers), which makes the HTML parser re-parent a verse's text
 * into a neighbouring <verse_export>. Reading each element's text therefore
 * drops or merges verses. Instead we walk the document in order: every
 * `<span class="vn">` marks the start of a verse, and the text that follows
 * (until the next marker) is that verse's body. Document order is preserved by
 * the parser regardless of how the tags re-nest, so this is robust.
 */
function parseVerses(html: string, book: string, chapter: number): Verse[] {
  const meta = getBook(book)
  const doc = new DOMParser().parseFromString(html, 'text/html')

  // Drop footnotes, cross-references and headings before reading text.
  doc
    .querySelectorAll('a.a-tn, .tn, .sn, .subhead, .chapter-number, h1, h2, h3, h4, h5, h6')
    .forEach((el) => el.remove())

  const byVerse = new Map<number, string>()
  const order: number[] = []
  let current = 0

  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  )
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      if (el.classList.contains('vn')) {
        const n = Number((el.textContent ?? '').trim())
        if (Number.isFinite(n) && n > 0 && !byVerse.has(n)) {
          byVerse.set(n, '')
          order.push(n)
        }
        if (Number.isFinite(n) && n > 0) current = n
      }
      continue
    }
    // Text node: skip the verse-number digits inside a .vn span; append the rest
    // to the verse currently in scope.
    if ((node.parentElement as Element | null)?.classList.contains('vn')) continue
    if (current > 0) byVerse.set(current, (byVerse.get(current) ?? '') + node.nodeValue)
  }

  const verses: Verse[] = []
  for (const n of order) {
    const text = (byVerse.get(n) ?? '').replace(/\s+/g, ' ').trim()
    if (!text) continue
    verses.push({
      book_id: book,
      book_name: meta?.name ?? book,
      chapter,
      verse: n,
      text,
    })
  }
  return verses
}

export async function getNltChapter(
  book: string,
  chapter: number,
  opts?: GetChapterOptions,
): Promise<Chapter> {
  const params = new URLSearchParams({
    ref: referenceQuery(book, chapter),
    version: 'NLT',
  })
  const url = `/api/nlt/api/passages?${params.toString()}`

  let res: Response
  try {
    res = await fetch(url, { signal: opts?.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new NetworkError('Could not reach the NLT service.')
  }

  // 503: proxy has no NLT_API_KEY configured. 401/403: the configured key was
  // rejected. Either way, the NLT isn't usable in this deployment.
  if (res.status === 401 || res.status === 403 || res.status === 503) {
    throw new NotConfiguredError(
      'nlt',
      'The NLT isn’t set up for this site. It needs an NLT_API_KEY on the server.',
    )
  }
  if (res.status === 404) {
    throw new NotFoundError(`No NLT passage found for ${book} ${chapter}`)
  }
  if (!res.ok) {
    throw new NetworkError(`NLT request failed with status ${res.status}`)
  }

  let html: string
  try {
    html = await res.text()
  } catch {
    throw new ParseError('NLT response could not be read')
  }

  const verses = parseVerses(html, book, chapter)
  if (verses.length === 0) {
    throw new ParseError('NLT response contained no verses')
  }

  return {
    reference: `${getBook(book)?.name ?? book} ${chapter}`,
    translationId: 'nlt',
    translationName: 'New Living Translation',
    book,
    chapter,
    verses,
  }
}
