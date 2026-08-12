import { useCallback, useEffect, useRef } from 'react'
import type { LastRead } from '../types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'

/** Default landing passage when nothing has been read yet. */
export const DEFAULT_LAST_READ: LastRead = {
  book: 'john',
  chapter: 1,
  updatedAt: 0,
}

/** Read the persisted last-read location (or the default). */
export function readLastRead(): LastRead {
  const stored = readJSON<LastRead | null>(STORAGE_KEYS.lastRead, null)
  if (
    stored &&
    typeof stored.book === 'string' &&
    typeof stored.chapter === 'number' &&
    stored.chapter > 0
  ) {
    return {
      book: stored.book,
      chapter: stored.chapter,
      verse: typeof stored.verse === 'number' ? stored.verse : undefined,
      updatedAt: typeof stored.updatedAt === 'number' ? stored.updatedAt : 0,
    }
  }
  return DEFAULT_LAST_READ
}

const DEBOUNCE_MS = 400

/**
 * Persist the current reading location, debounced. Call `record` on chapter
 * change or verse focus; the latest wins within the debounce window.
 */
export function useLastRead() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<LastRead | null>(null)

  const flush = useCallback(() => {
    if (pendingRef.current) {
      writeJSON(STORAGE_KEYS.lastRead, pendingRef.current)
      pendingRef.current = null
    }
  }, [])

  const record = useCallback(
    (book: string, chapter: number, verse?: number) => {
      pendingRef.current = { book, chapter, verse, updatedAt: Date.now() }
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flush, DEBOUNCE_MS)
    },
    [flush],
  )

  // Flush any pending write on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      flush()
    }
  }, [flush])

  return { record, readLastRead }
}
