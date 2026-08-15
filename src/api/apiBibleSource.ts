// NIV, Amplified, and NASB — all served through API.Bible (rest.api.bible),
// via a server-side proxy that injects the API_BIBLE_KEY (a Vite dev-proxy
// header in `npm run dev`, a Vercel serverless function in production). The
// browser never sees or supplies a key.
//
// Endpoint:
//   GET /api/bible/chapter?bibleId={id}&usfm={book}.{chapter}
// Response: API.Bible's chapter JSON; `data.content` carries `[n]` verse
// markers plus stray `[Book c:v]` cross-reference brackets we strip out.
//
// Each of these three is a free-tier "additional Bible" pick on API.Bible's
// Starter plan — verified live against the account's own `/bibles` catalog,
// not guessed. Every view is reported via their required Fair Use
// Management System (src/lib/fums.ts) per their terms.

import type { Chapter, Verse } from '../types'
import type { GetChapterOptions, Translation } from './bibleSource'
import { NetworkError, NotConfiguredError, NotFoundError, ParseError } from './bibleSource'
import { getBook } from '../data/books'
import { USFM_CODES } from '../data/usfmCodes'
import { reportFumsView } from '../lib/fums'

interface ApiBibleTranslation extends Translation {
  bibleId: string
}

export const API_BIBLE_TRANSLATIONS: ApiBibleTranslation[] = [
  {
    id: 'niv',
    name: 'New International Version',
    language: 'English',
    group: 'licensed',
    readingLevel: 'Modern',
    note: 'NIV®, © Biblica. Served via the site’s configured API.Bible key.',
    licensed: true,
    bibleId: '78a9f6124f344018-01',
  },
  {
    id: 'amp',
    name: 'Amplified Bible',
    language: 'English',
    group: 'licensed',
    readingLevel: 'Expanded',
    note: 'AMP®, © The Lockman Foundation. Served via the site’s configured API.Bible key.',
    licensed: true,
    bibleId: 'a81b73293d3080c9-01',
  },
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    language: 'English',
    group: 'licensed',
    readingLevel: 'Modern (literal)',
    note: 'NASB®, © The Lockman Foundation. Served via the site’s configured API.Bible key.',
    licensed: true,
    bibleId: 'a761ca71e0b3ddcf-01',
  },
]

const BIBLE_ID_BY_TRANSLATION: Record<string, string> = Object.fromEntries(
  API_BIBLE_TRANSLATIONS.map((t) => [t.id, t.bibleId]),
)

interface ApiBibleChapterResponse {
  data?: { content?: string }
  meta?: { fumsToken?: string }
  message?: string
}

/** Strip stray cross-reference brackets like "[Heb 11:3]" — these start with
 * a letter, unlike verse-number markers which are always pure digits. */
function stripCrossRefBrackets(text: string): string {
  return text.replace(/\[[A-Za-z][^\]]*\]/g, '')
}

function parseVerses(content: string, book: string, chapter: number): Verse[] {
  const meta = getBook(book)
  const cleaned = stripCrossRefBrackets(content)
  const parts = cleaned.split(/\[(\d+)\]/)
  const verses: Verse[] = []
  for (let i = 1; i < parts.length; i += 2) {
    const verseNum = Number(parts[i])
    const text = (parts[i + 1] ?? '').replace(/\s+/g, ' ').trim()
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

export async function getApiBibleChapter(
  book: string,
  chapter: number,
  translationId: string,
  opts?: GetChapterOptions,
): Promise<Chapter> {
  const bibleId = BIBLE_ID_BY_TRANSLATION[translationId]
  const translation = API_BIBLE_TRANSLATIONS.find((t) => t.id === translationId)
  const usfmBook = USFM_CODES[book]
  if (!bibleId || !translation || !usfmBook) {
    throw new NotFoundError(`No ${translationId} passage found for ${book} ${chapter}`)
  }

  const params = new URLSearchParams({ bibleId, usfm: `${usfmBook}.${chapter}` })
  const url = `/api/bible/chapter?${params.toString()}`

  let res: Response
  try {
    res = await fetch(url, { signal: opts?.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new NetworkError('Could not reach API.Bible.')
  }

  if (res.status === 401 || res.status === 403 || res.status === 503) {
    throw new NotConfiguredError(
      translationId,
      `The ${translation.name} isn’t set up for this site. It needs an API_BIBLE_KEY on the server.`,
    )
  }
  if (res.status === 404) {
    throw new NotFoundError(`No ${translation.name} passage found for ${book} ${chapter}`)
  }
  if (!res.ok) {
    throw new NetworkError(`${translation.name} request failed with status ${res.status}`)
  }

  let json: ApiBibleChapterResponse
  try {
    json = (await res.json()) as ApiBibleChapterResponse
  } catch {
    throw new ParseError(`${translation.name} response was not valid JSON`)
  }

  const content = json.data?.content
  if (!content) {
    throw new ParseError(`${translation.name} response had no content`)
  }

  const verses = parseVerses(content, book, chapter)
  if (verses.length === 0) {
    throw new ParseError(`${translation.name} response contained no verses`)
  }

  reportFumsView(json.meta?.fumsToken)

  return {
    reference: `${getBook(book)?.name ?? book} ${chapter}`,
    translationId,
    translationName: translation.name,
    book,
    chapter,
    verses,
  }
}
