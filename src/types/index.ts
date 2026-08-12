// Shared type definitions for the Bible Study App.

export type Testament = 'OT' | 'NT'

export interface BookMeta {
  /** API slug / URL id, e.g. "john", "1 corinthians". Also used in route params. */
  id: string
  /** Display name, e.g. "John", "1 Corinthians". */
  name: string
  testament: Testament
  chapterCount: number
  /** Short 1-2 sentence introduction. */
  intro: string
  /** Traditional/most-accepted author, honest about disputed attribution. */
  author: string
  /** Approximate date of writing, e.g. "c. 1446–1406 BC". */
  written: string
  /** Where it was written or its origin/setting. */
  place: string
  /** Original recipients/audience. */
  audience: string
  /** Category, e.g. "Law / Torah", "Gospel", "Pauline Epistle". */
  genre: string
  /** Short phrase of key themes. */
  themes: string
}

export interface Verse {
  book_id: string
  book_name: string
  chapter: number
  verse: number
  text: string
}

export interface Chapter {
  reference: string
  translationId: string
  translationName: string
  /** Book id (slug) this chapter belongs to. */
  book: string
  chapter: number
  verses: Verse[]
}

export type ThemeMode = 'light' | 'dark'

export type FontFamily = 'serif' | 'sans' | 'comfort' | 'mono'

export interface Settings {
  theme: ThemeMode
  primaryTranslation: string
  secondaryTranslation: string
  parallelEnabled: boolean
  fontFamily: FontFamily
  /** Index 0..6 into the font-size scale. */
  fontScale: number
}

export interface LastRead {
  book: string
  chapter: number
  verse?: number
  updatedAt: number
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange'

export interface Highlight {
  verseKey: string
  color: HighlightColor
  updatedAt: number
}

export interface Note {
  id: string
  verseKey: string
  reference: string
  body: string
  createdAt: number
  updatedAt: number
}

export interface CachedChapter {
  data: Chapter
  fetchedAt: number
}

/** A chapter the reader has opened, most-recent-first in the recent list. */
export interface RecentChapter {
  book: string
  chapter: number
  translationId: string
  updatedAt: number
}

/** A bundled, public-domain verse used by the "Verse of the day" module. */
export interface DailyVerse {
  ref: string
  book: string
  chapter: number
  verse: number
  text: string
}

/** Loading/fetch status for a chapter request. */
export type ChapterStatus = 'idle' | 'loading' | 'ready' | 'error' | 'offline'
