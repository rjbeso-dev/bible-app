// BibleSource implementation backed by https://bible-api.com.
//
// Chapter endpoint:
//   GET https://bible-api.com/{book}+{chapter}?translation={id}
// Response shape:
//   { reference, verses: [{book_id, book_name, chapter, verse, text}],
//     text, translation_id, translation_name, translation_note }

import type { Chapter, Verse } from '../types'
import type { BibleSource, GetChapterOptions, Translation } from './bibleSource'
import { NetworkError, NotFoundError, ParseError } from './bibleSource'

const BASE_URL = 'https://bible-api.com'

/**
 * Curated free English translations exposed by this source, grouped by reading
 * level. All are public-domain / freely licensed and need no API key.
 */
const TRANSLATIONS: Translation[] = [
  {
    id: 'bbe',
    name: 'Bible in Basic English (Easy)',
    language: 'English',
    group: 'easy',
    readingLevel: 'Easy',
    note: 'A simplified vocabulary edition — the gentlest starting point.',
  },
  {
    id: 'web',
    name: 'World English Bible (Modern)',
    language: 'English',
    group: 'modern',
    readingLevel: 'Modern',
    note: 'Clear contemporary English. The default reading.',
  },
  {
    id: 'webbe',
    name: 'WEB British (Modern)',
    language: 'English',
    group: 'modern',
    readingLevel: 'Modern',
    note: 'The World English Bible with British spelling and units.',
  },
  {
    id: 'oeb-us',
    name: 'Open English Bible (Modern)',
    language: 'English',
    group: 'modern',
    readingLevel: 'Modern',
    note: 'A modern, openly licensed translation.',
  },
  {
    id: 'kjv',
    name: 'King James Version (Classic)',
    language: 'English',
    group: 'classic',
    readingLevel: 'Classic',
    note: 'The 1611 classic — stately, traditional English.',
  },
  {
    id: 'asv',
    name: 'American Standard (Classic, literal)',
    language: 'English',
    group: 'classic',
    readingLevel: 'Classic',
    note: 'A literal 1901 revision, close to the original wording.',
  },
]

interface RawVerse {
  book_id?: string
  book_name?: string
  chapter?: number
  verse?: number
  text?: string
}

interface RawChapterResponse {
  reference?: string
  verses?: RawVerse[]
  text?: string
  translation_id?: string
  translation_name?: string
  translation_note?: string
  error?: string
}

function buildUrl(book: string, chapter: number, translationId: string): string {
  const ref = encodeURIComponent(`${book} ${chapter}`)
  const tid = encodeURIComponent(translationId)
  return `${BASE_URL}/${ref}?translation=${tid}`
}

export class BibleApiSource implements BibleSource {
  listTranslations(): Translation[] {
    return TRANSLATIONS
  }

  async getChapter(
    book: string,
    chapter: number,
    translationId: string,
    opts?: GetChapterOptions,
  ): Promise<Chapter> {
    const url = buildUrl(book, chapter, translationId)

    let res: Response
    try {
      res = await fetch(url, {
        signal: opts?.signal,
        headers: { Accept: 'application/json' },
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      throw new NetworkError(
        err instanceof Error ? err.message : 'Network request failed',
      )
    }

    if (res.status === 404) {
      throw new NotFoundError(`No passage found for ${book} ${chapter}`)
    }
    if (!res.ok) {
      throw new NetworkError(`Request failed with status ${res.status}`)
    }

    let json: RawChapterResponse
    try {
      json = (await res.json()) as RawChapterResponse
    } catch {
      throw new ParseError('Response was not valid JSON')
    }

    if (json.error) {
      throw new NotFoundError(json.error)
    }
    if (!Array.isArray(json.verses) || json.verses.length === 0) {
      throw new ParseError('Response contained no verses')
    }

    const verses: Verse[] = json.verses.map((v) => ({
      book_id: String(v.book_id ?? book),
      book_name: String(v.book_name ?? book),
      chapter: Number(v.chapter ?? chapter),
      verse: Number(v.verse ?? 0),
      // bible-api.com verse text often carries trailing newlines.
      text: String(v.text ?? '').trim(),
    }))

    return {
      reference: json.reference ?? `${book} ${chapter}`,
      translationId: json.translation_id ?? translationId,
      translationName: json.translation_name ?? translationId,
      book,
      chapter,
      verses,
    }
  }
}

export const bibleApiSource = new BibleApiSource()
