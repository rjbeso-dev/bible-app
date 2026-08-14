// ESV (English Standard Version) source. Copyrighted — served through a
// server-side proxy at `/api/esv` that injects the ESV_API_KEY (a Vite dev-proxy
// header in `npm run dev`, a Vercel serverless function in production). The
// browser never sees or supplies a key.
//
// Endpoint:
//   GET /api/esv/text?q={ref}&include-verse-numbers=true&...
// Response: { passages: [string], ... } where verse text carries `[n]` markers.

import type { Chapter, Verse } from '../types'
import type { GetChapterOptions, Translation } from './bibleSource'
import { NetworkError, NotConfiguredError, NotFoundError, ParseError } from './bibleSource'
import { getBook } from '../data/books'

export const ESV_TRANSLATION: Translation = {
  id: 'esv',
  name: 'English Standard Version',
  language: 'English',
  group: 'licensed',
  readingLevel: 'Modern (literal)',
  note: 'ESV®, © Crossway. Served via the site’s configured ESV API key.',
  licensed: true,
}

interface EsvResponse {
  passages?: string[]
  detail?: string
}

function referenceQuery(book: string, chapter: number): string {
  const name = getBook(book)?.name ?? book
  return `${name} ${chapter}`
}

/** Parse ESV plain text (with `[n]` verse markers) into Verse[]. */
function parseVerses(passage: string, book: string, chapter: number): Verse[] {
  const meta = getBook(book)
  const parts = passage.split(/\[(\d+)\]/)
  const verses: Verse[] = []
  // parts = [pre, num, text, num, text, ...]. Iterate number/text pairs.
  for (let i = 1; i < parts.length; i += 2) {
    const verseNum = Number(parts[i])
    const text = (parts[i + 1] ?? '')
      .replace(/\s+/g, ' ')
      .trim()
    if (!Number.isFinite(verseNum) || !text) continue
    verses.push({
      book_id: book,
      book_name: meta?.name ?? book,
      chapter,
      verse: verseNum,
      text,
    })
  }
  return verses
}

export async function getEsvChapter(
  book: string,
  chapter: number,
  opts?: GetChapterOptions,
): Promise<Chapter> {
  const params = new URLSearchParams({
    q: referenceQuery(book, chapter),
    'include-verse-numbers': 'true',
    'include-headings': 'false',
    'include-footnotes': 'false',
    'include-passage-references': 'false',
    'include-short-copyright': 'false',
  })
  const url = `/api/esv/text?${params.toString()}`

  let res: Response
  try {
    res = await fetch(url, { signal: opts?.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new NetworkError('Could not reach the ESV service.')
  }

  // 503: proxy has no ESV_API_KEY configured. 401/403: the configured key was
  // rejected. Either way, the ESV isn't usable in this deployment.
  if (res.status === 401 || res.status === 403 || res.status === 503) {
    throw new NotConfiguredError(
      'esv',
      'The ESV isn’t set up for this site. It needs an ESV_API_KEY on the server.',
    )
  }
  if (res.status === 404) {
    throw new NotFoundError(`No ESV passage found for ${book} ${chapter}`)
  }
  if (!res.ok) {
    throw new NetworkError(`ESV request failed with status ${res.status}`)
  }

  let json: EsvResponse
  try {
    json = (await res.json()) as EsvResponse
  } catch {
    throw new ParseError('ESV response was not valid JSON')
  }

  const passage = Array.isArray(json.passages) ? json.passages.join('\n') : ''
  const verses = parseVerses(passage, book, chapter)
  if (verses.length === 0) {
    throw new ParseError('ESV response contained no verses')
  }

  return {
    reference: `${getBook(book)?.name ?? book} ${chapter}`,
    translationId: 'esv',
    translationName: 'English Standard Version',
    book,
    chapter,
    verses,
  }
}

export interface SearchResult {
  /** Human reference from the ESV API, e.g. "John 3:16". */
  reference: string
  /** Short snippet of matching text. */
  content: string
}

/** Full-text search via the ESV search endpoint (needs the configured key). */
export async function searchEsv(
  query: string,
  opts?: GetChapterOptions,
): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q: query, 'page-size': '20' })
  const url = `/api/esv/search?${params.toString()}`

  let res: Response
  try {
    res = await fetch(url, { signal: opts?.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new NetworkError('Could not reach the search service.')
  }

  if (res.status === 401 || res.status === 403 || res.status === 503) {
    throw new NotConfiguredError(
      'esv',
      'Search needs the ESV API key configured on the server.',
    )
  }
  if (!res.ok) throw new NetworkError(`Search failed with status ${res.status}`)

  let json: { results?: SearchResult[] }
  try {
    json = (await res.json()) as { results?: SearchResult[] }
  } catch {
    throw new ParseError('Search response was not valid JSON')
  }
  return (json.results ?? []).map((r) => ({ reference: r.reference, content: r.content }))
}
