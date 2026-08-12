// Reference helpers: verse keys, chapter navigation across book boundaries.

import { BOOKS, getBook } from '../data/books'

/** Build the canonical verse key, e.g. verseKey("john", 3, 16) -> "john.3.16". */
export function verseKey(book: string, chapter: number, verse: number): string {
  return `${book}.${chapter}.${verse}`
}

export interface ParsedVerseKey {
  book: string
  chapter: number
  verse: number
}

/** Parse a verse key back into parts. Returns null if malformed. */
export function parseVerseKey(key: string): ParsedVerseKey | null {
  // Book ids may contain spaces but never dots; chapter/verse are the last two
  // dot-separated segments.
  const parts = key.split('.')
  if (parts.length < 3) return null
  const verse = Number(parts[parts.length - 1])
  const chapter = Number(parts[parts.length - 2])
  const book = parts.slice(0, parts.length - 2).join('.')
  if (!book || !Number.isFinite(chapter) || !Number.isFinite(verse)) return null
  return { book, chapter, verse }
}

export interface ChapterRef {
  book: string
  chapter: number
}

/**
 * The chapter before the given one, rolling back to the last chapter of the
 * previous book at a book boundary. Returns null before Genesis 1.
 */
export function prevChapter(book: string, chapter: number): ChapterRef | null {
  const meta = getBook(book)
  if (!meta) return null
  if (chapter > 1) return { book: meta.id, chapter: chapter - 1 }
  const idx = BOOKS.findIndex((b) => b.id === meta.id)
  if (idx <= 0) return null
  const prev = BOOKS[idx - 1]
  return { book: prev.id, chapter: prev.chapterCount }
}

/**
 * The chapter after the given one, rolling forward to chapter 1 of the next
 * book at a book boundary. Returns null after Revelation 22.
 */
export function nextChapter(book: string, chapter: number): ChapterRef | null {
  const meta = getBook(book)
  if (!meta) return null
  if (chapter < meta.chapterCount) return { book: meta.id, chapter: chapter + 1 }
  const idx = BOOKS.findIndex((b) => b.id === meta.id)
  if (idx === -1 || idx >= BOOKS.length - 1) return null
  const next = BOOKS[idx + 1]
  return { book: next.id, chapter: 1 }
}

/** Human-readable reference, e.g. "John 3" or "John 3:16". */
export function formatReference(
  book: string,
  chapter: number,
  verse?: number,
): string {
  const meta = getBook(book)
  const name = meta ? meta.name : book
  return verse ? `${name} ${chapter}:${verse}` : `${name} ${chapter}`
}

/** Clamp a chapter number into the valid range for a book. */
export function clampChapter(book: string, chapter: number): number {
  const meta = getBook(book)
  if (!meta) return chapter
  if (chapter < 1) return 1
  if (chapter > meta.chapterCount) return meta.chapterCount
  return chapter
}
