import { useCallback, useEffect, useRef, useState } from 'react'
import type { Chapter, ChapterStatus } from '../types'
import { bibleSource, BibleApiError } from '../api'
import { readChapterCache, writeChapterCache } from '../lib/chapterCache'

export interface UseChapterResult {
  chapter: Chapter | null
  status: ChapterStatus
  error: string | null
  /** True when showing a cached copy after a failed refresh. */
  fromCache: boolean
  refetch: () => void
}

/**
 * Load a chapter cache-first.
 *
 * On a cache hit we return immediately. On a miss we fetch; on success we write
 * through to the cache. On failure we fall back to any cached copy, else surface
 * an error. Passing a falsy `book` disables the hook (returns idle).
 */
export function useChapter(
  book: string | undefined,
  chapter: number | undefined,
  translationId: string,
): UseChapterResult {
  const [data, setData] = useState<Chapter | null>(null)
  const [status, setStatus] = useState<ChapterStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const abortRef = useRef<AbortController | null>(null)

  const refetch = useCallback(() => setReloadToken((n) => n + 1), [])

  useEffect(() => {
    if (!book || !chapter) {
      setStatus('idle')
      setData(null)
      setError(null)
      return
    }

    let cancelled = false
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    // Cache-first: serve a hit immediately.
    const cached = readChapterCache(translationId, book, chapter)
    if (cached) {
      setData(cached.data)
      setStatus('ready')
      setError(null)
      setFromCache(false)
      return () => {
        cancelled = true
        controller.abort()
      }
    }

    setStatus('loading')
    setError(null)
    setFromCache(false)

    bibleSource
      .getChapter(book, chapter, translationId, { signal: controller.signal })
      .then((result) => {
        if (cancelled) return
        writeChapterCache(result)
        setData(result)
        setStatus('ready')
        setFromCache(false)
      })
      .catch((err: unknown) => {
        if (cancelled || controller.signal.aborted) return
        // No cache existed (we already checked), so this is a hard failure.
        const message =
          err instanceof BibleApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Something went wrong'
        const offline =
          typeof navigator !== 'undefined' && navigator.onLine === false
        setStatus(offline ? 'offline' : 'error')
        setError(message)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [book, chapter, translationId, reloadToken])

  return { chapter: data, status, error, fromCache, refetch }
}
