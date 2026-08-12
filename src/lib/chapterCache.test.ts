import { describe, it, expect } from 'vitest'
import type { Chapter } from '../types'
import {
  CACHE_CAP,
  cacheKey,
  readChapterCache,
  writeChapterCache,
  clearChapterCache,
} from './chapterCache'
import { STORAGE_KEYS } from './storage'

function makeChapter(
  translationId: string,
  book: string,
  chapter: number,
): Chapter {
  return {
    reference: `${book} ${chapter}`,
    translationId,
    translationName: translationId.toUpperCase(),
    book,
    chapter,
    verses: [
      { book_id: book, book_name: book, chapter, verse: 1, text: 'text one' },
    ],
  }
}

function indexLength(): number {
  const raw = localStorage.getItem(STORAGE_KEYS.cacheIndex)
  return raw ? (JSON.parse(raw) as string[]).length : 0
}

describe('chapterCache: set / get', () => {
  it('writes a chapter and reads it back', () => {
    writeChapterCache(makeChapter('web', 'john', 3))
    const hit = readChapterCache('web', 'john', 3)
    expect(hit?.data.verses[0].text).toBe('text one')
    expect(typeof hit?.fetchedAt).toBe('number')
  })

  it('misses for an uncached chapter', () => {
    expect(readChapterCache('web', 'john', 99)).toBeNull()
  })

  it('is keyed per translation (F2 cache isolation)', () => {
    writeChapterCache(makeChapter('web', 'john', 1))
    expect(readChapterCache('web', 'john', 1)).not.toBeNull()
    // Different translation is a separate cache entry.
    expect(readChapterCache('kjv', 'john', 1)).toBeNull()
    expect(cacheKey('web', 'john', 1)).not.toBe(cacheKey('kjv', 'john', 1))
  })

  it('returns null (no throw) on corrupted cache payloads', () => {
    localStorage.setItem(cacheKey('web', 'mark', 1), '{broken')
    expect(readChapterCache('web', 'mark', 1)).toBeNull()
  })
})

describe('chapterCache: LRU eviction at cap', () => {
  it('never exceeds CACHE_CAP and evicts the oldest', () => {
    clearChapterCache()
    // Write one over the cap.
    for (let i = 1; i <= CACHE_CAP + 1; i++) {
      writeChapterCache(makeChapter('web', 'genesis', i))
    }
    expect(indexLength()).toBe(CACHE_CAP)
    // The very first write (chapter 1) should have been evicted.
    expect(readChapterCache('web', 'genesis', 1)).toBeNull()
    // The most-recent write survives.
    expect(readChapterCache('web', 'genesis', CACHE_CAP + 1)).not.toBeNull()
  })

  it('treats a read as a recency touch, protecting it from eviction', () => {
    clearChapterCache()
    // Fill exactly to cap.
    for (let i = 1; i <= CACHE_CAP; i++) {
      writeChapterCache(makeChapter('web', 'psalms', i))
    }
    // Touch the oldest (chapter 1) so it becomes most-recent.
    expect(readChapterCache('web', 'psalms', 1)).not.toBeNull()
    // One more write pushes the cache over cap; the now-oldest (chapter 2) goes.
    writeChapterCache(makeChapter('web', 'psalms', CACHE_CAP + 1))
    expect(readChapterCache('web', 'psalms', 1)).not.toBeNull()
    expect(readChapterCache('web', 'psalms', 2)).toBeNull()
  })
})

describe('chapterCache: clear', () => {
  it('clears all cached chapters and the index', () => {
    writeChapterCache(makeChapter('web', 'acts', 2))
    clearChapterCache()
    expect(readChapterCache('web', 'acts', 2)).toBeNull()
    expect(indexLength()).toBe(0)
  })
})
