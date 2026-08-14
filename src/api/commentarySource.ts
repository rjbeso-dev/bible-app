// Public-domain (and one CC BY-SA) Bible commentaries via the HelloAO Free Use
// Bible API (bible.helloao.org, MIT-licensed API, CORS-open — no proxy needed).
// Verified live: https://bible.helloao.org/api/available_commentaries.json and
// https://bible.helloao.org/api/c/matthew-henry/books.json.

import { USFM_CODES } from '../data/usfmCodes'

export interface CommentaryOption {
  id: string
  name: string
  /** Short license/attribution line shown under the commentary text. */
  license: string
}

/** Curated, in a sensible reading order. All confirmed available on the API. */
export const COMMENTARIES: CommentaryOption[] = [
  { id: 'matthew-henry', name: 'Matthew Henry', license: 'Public domain' },
  { id: 'jamieson-fausset-brown', name: 'Jamieson-Fausset-Brown', license: 'Public domain' },
  { id: 'john-gill', name: 'John Gill', license: 'Public domain' },
  { id: 'adam-clarke', name: 'Adam Clarke', license: 'Public domain' },
  { id: 'keil-delitzsch', name: 'Keil-Delitzsch (OT only)', license: 'Public domain' },
  { id: 'john-calvin', name: "John Calvin's Commentaries", license: 'Public domain' },
  { id: 'tyndale', name: 'Tyndale Open Study Notes', license: 'CC BY-SA 4.0' },
]

export interface CommentaryVerse {
  verse: number
  text: string
}

/**
 * Fetch one chapter's commentary, keyed by verse. Returns `null` when this
 * commentary doesn't cover the book/chapter (not every commentary covers all
 * 66 books) rather than throwing — that's an expected, common case here, not
 * an error.
 */
export async function getCommentaryChapter(
  commentaryId: string,
  bookId: string,
  chapter: number,
  opts?: { signal?: AbortSignal },
): Promise<CommentaryVerse[] | null> {
  const usfm = USFM_CODES[bookId]
  if (!usfm) return null

  const url = `https://bible.helloao.org/api/c/${commentaryId}/${usfm}/${chapter}.json`
  let res: Response
  try {
    res = await fetch(url, { signal: opts?.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    return null
  }
  if (!res.ok) return null

  let json: unknown
  try {
    json = await res.json()
  } catch {
    return null
  }

  const content = (json as { chapter?: { content?: unknown[] } })?.chapter?.content
  if (!Array.isArray(content)) return null

  const verses: CommentaryVerse[] = []
  for (const entry of content) {
    const e = entry as { type?: string; number?: number; content?: unknown[] }
    if (e?.type !== 'verse' || typeof e.number !== 'number' || !Array.isArray(e.content)) continue
    const text = e.content.filter((p): p is string => typeof p === 'string').join(' ').trim()
    if (text) verses.push({ verse: e.number, text })
  }
  return verses.length > 0 ? verses : null
}
