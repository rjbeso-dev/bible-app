import { useCallback, useEffect, useState } from 'react'
import type { RecentChapter } from '../types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'

/** Cap on how many recent chapters we remember (most-recent-first). */
export const RECENT_CAP = 12

/** Canonical key for a read chapter, e.g. "john.1". */
export function chapterKey(book: string, chapter: number): string {
  return `${book}.${chapter}`
}

interface ProgressState {
  read: string[]
  recent: RecentChapter[]
}

function loadRead(): string[] {
  const raw = readJSON<string[]>(STORAGE_KEYS.readChapters, [])
  return Array.isArray(raw) ? raw.filter((k): k is string => typeof k === 'string') : []
}

function loadRecent(): RecentChapter[] {
  const raw = readJSON<RecentChapter[]>(STORAGE_KEYS.recentChapters, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (r): r is RecentChapter =>
      !!r &&
      typeof r.book === 'string' &&
      typeof r.chapter === 'number' &&
      typeof r.translationId === 'string',
  )
}

// Cross-instance broadcast (mirrors useNotes) so every mounted hook stays synced.
type Listener = (state: ProgressState) => void
const listeners = new Set<Listener>()
let current: ProgressState | null = null

function getState(): ProgressState {
  if (current === null) current = { read: loadRead(), recent: loadRecent() }
  return current
}

function setState(next: ProgressState): void {
  current = next
  writeJSON(STORAGE_KEYS.readChapters, next.read)
  writeJSON(STORAGE_KEYS.recentChapters, next.recent)
  listeners.forEach((l) => l(next))
}

export interface UseReadingProgressResult {
  /** Distinct chapter keys ever opened. */
  readChapters: string[]
  /** Recent chapters, most-recent-first (capped at RECENT_CAP). */
  recentChapters: RecentChapter[]
  /** Number of distinct chapters read. */
  chaptersReadCount: number
  /** Record that a chapter was opened. */
  recordRead: (book: string, chapter: number, translationId: string) => void
  /** True if a chapter has been opened before. */
  hasRead: (book: string, chapter: number) => boolean
}

export function useReadingProgress(): UseReadingProgressResult {
  const [state, setLocal] = useState<ProgressState>(getState)

  useEffect(() => {
    const listener: Listener = (next) => setLocal(next)
    listeners.add(listener)
    setLocal(getState())
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const recordRead = useCallback(
    (book: string, chapter: number, translationId: string) => {
      const prev = getState()
      const key = chapterKey(book, chapter)
      const read = prev.read.includes(key) ? prev.read : [...prev.read, key]
      const entry: RecentChapter = {
        book,
        chapter,
        translationId,
        updatedAt: Date.now(),
      }
      const recent = [
        entry,
        ...prev.recent.filter((r) => chapterKey(r.book, r.chapter) !== key),
      ].slice(0, RECENT_CAP)
      // Skip a write when nothing meaningfully changed (same head chapter).
      const headUnchanged =
        prev.recent[0] &&
        chapterKey(prev.recent[0].book, prev.recent[0].chapter) === key &&
        read.length === prev.read.length
      if (headUnchanged) return
      setState({ read, recent })
    },
    [],
  )

  const hasRead = useCallback(
    (book: string, chapter: number) => state.read.includes(chapterKey(book, chapter)),
    [state.read],
  )

  return {
    readChapters: state.read,
    recentChapters: state.recent,
    chaptersReadCount: state.read.length,
    recordRead,
    hasRead,
  }
}
