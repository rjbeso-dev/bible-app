// The active Bible data source: a router that dispatches by translation id.
//
// Free translations go to bible-api.com (bibleApiSource). The copyrighted ESV
// and NLT go through a server-side proxy that injects the API key. The browser
// never handles a key. `listTranslations` returns the full grouped list.

import type { Chapter } from '../types'
import type { BibleSource, GetChapterOptions, Translation } from './bibleSource'
import { bibleApiSource } from './bibleApiSource'
import { ESV_TRANSLATION, getEsvChapter } from './esvSource'
import { NLT_TRANSLATION, getNltChapter } from './nltSource'
import { API_BIBLE_TRANSLATIONS, getApiBibleChapter } from './apiBibleSource'

const API_BIBLE_IDS = new Set(API_BIBLE_TRANSLATIONS.map((t) => t.id))

class RouterSource implements BibleSource {
  listTranslations(): Translation[] {
    return [
      ...bibleApiSource.listTranslations(),
      ESV_TRANSLATION,
      NLT_TRANSLATION,
      ...API_BIBLE_TRANSLATIONS,
    ]
  }

  getChapter(
    book: string,
    chapter: number,
    translationId: string,
    opts?: GetChapterOptions,
  ): Promise<Chapter> {
    switch (translationId) {
      case 'esv':
        return getEsvChapter(book, chapter, opts)
      case 'nlt':
        return getNltChapter(book, chapter, opts)
      default:
        if (API_BIBLE_IDS.has(translationId)) {
          return getApiBibleChapter(book, chapter, translationId, opts)
        }
        return bibleApiSource.getChapter(book, chapter, translationId, opts)
    }
  }
}

export const bibleSource: BibleSource = new RouterSource()

/** Look up a translation's metadata by id, or undefined. */
export function getTranslation(id: string): Translation | undefined {
  return bibleSource.listTranslations().find((t) => t.id === id)
}

export * from './bibleSource'
