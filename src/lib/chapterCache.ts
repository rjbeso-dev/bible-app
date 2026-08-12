// Chapter cache backed by localStorage with a bounded LRU index.
//
// Each chapter is stored under its own key so reads/writes touch only the
// requested chapter. A separate ordered index tracks recency for eviction.

import type { CachedChapter, Chapter } from '../types'
import {
  STORAGE_PREFIX,
  STORAGE_KEYS,
  readJSON,
  writeJSON,
  removeKey,
} from './storage'

/** Maximum number of chapters kept in the cache. */
export const CACHE_CAP = 150

/**
 * Cache-format version. Bump this whenever the parsed Chapter shape or a source
 * parser changes, so previously cached (now-stale) chapters are ignored and
 * refetched instead of served from an old format. Orphaned older-version entries
 * are evicted naturally as new chapters push them out of the LRU index.
 */
export const CACHE_VERSION = 2

/** Build the storage key for a cached chapter. */
export function cacheKey(
  translationId: string,
  book: string,
  chapter: number,
): string {
  return `${STORAGE_PREFIX}cache.v${CACHE_VERSION}.chapter.${translationId}.${book}.${chapter}`
}

function readIndex(): string[] {
  const idx = readJSON<string[]>(STORAGE_KEYS.cacheIndex, [])
  return Array.isArray(idx) ? idx : []
}

function writeIndex(index: string[]): void {
  writeJSON(STORAGE_KEYS.cacheIndex, index)
}

/** Read a cached chapter, or null on miss/corruption. Marks it most-recent. */
export function readChapterCache(
  translationId: string,
  book: string,
  chapter: number,
): CachedChapter | null {
  const key = cacheKey(translationId, book, chapter)
  const cached = readJSON<CachedChapter | null>(key, null)
  if (!cached || !cached.data || !Array.isArray(cached.data.verses)) {
    return null
  }
  touch(key)
  return cached
}

/**
 * Write a chapter to the cache, updating the LRU index and evicting the
 * least-recently-used entries when over capacity. Retries once after evicting
 * if a quota error occurs.
 */
export function writeChapterCache(chapter: Chapter): void {
  const key = cacheKey(chapter.translationId, chapter.book, chapter.chapter)
  const payload: CachedChapter = { data: chapter, fetchedAt: Date.now() }

  const ok = writeJSON(key, payload, () => evictOldest(20))
  if (!ok) return

  // Move/insert key at the most-recent end.
  let index = readIndex().filter((k) => k !== key)
  index.push(key)

  // Evict from the front (oldest) if over cap.
  while (index.length > CACHE_CAP) {
    const oldest = index.shift()
    if (oldest) removeKey(oldest)
  }
  writeIndex(index)
}

/** Move a key to the most-recent position in the index. */
function touch(key: string): void {
  const index = readIndex()
  const pos = index.indexOf(key)
  if (pos === index.length - 1) return // already newest
  const next = index.filter((k) => k !== key)
  next.push(key)
  writeIndex(next)
}

/** Remove the N oldest cached chapters. Used to recover from quota errors. */
function evictOldest(count: number): void {
  const index = readIndex()
  const removed = index.splice(0, count)
  for (const key of removed) removeKey(key)
  writeIndex(index)
}

/** Clear the entire chapter cache and its index. */
export function clearChapterCache(): void {
  const index = readIndex()
  for (const key of index) removeKey(key)
  writeIndex([])
}
