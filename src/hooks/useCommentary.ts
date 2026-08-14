import { useEffect, useRef, useState } from 'react'
import { getCommentaryChapter, type CommentaryVerse } from '../api/commentarySource'

export type CommentaryStatus = 'idle' | 'loading' | 'ready' | 'unavailable'

export interface UseCommentaryResult {
  verses: CommentaryVerse[] | null
  status: CommentaryStatus
}

// In-memory only (not localStorage): commentary is supplementary and cheap to
// re-fetch, and entries can be large, so we don't want to persist them.
const cache = new Map<string, CommentaryVerse[]>()

/** Load one chapter of a commentary, keyed by verse. Not persisted to disk. */
export function useCommentary(
  commentaryId: string,
  book: string | undefined,
  chapter: number | undefined,
): UseCommentaryResult {
  const [verses, setVerses] = useState<CommentaryVerse[] | null>(null)
  const [status, setStatus] = useState<CommentaryStatus>('idle')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!book || !chapter) {
      setStatus('idle')
      setVerses(null)
      return
    }

    const key = `${commentaryId}:${book}:${chapter}`
    const cached = cache.get(key)
    if (cached) {
      setVerses(cached)
      setStatus('ready')
      return
    }

    let cancelled = false
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    setStatus('loading')
    setVerses(null)

    getCommentaryChapter(commentaryId, book, chapter, { signal: controller.signal })
      .then((result) => {
        if (cancelled) return
        if (result) {
          cache.set(key, result)
          setVerses(result)
          setStatus('ready')
        } else {
          setVerses(null)
          setStatus('unavailable')
        }
      })
      .catch(() => {
        if (cancelled) return
        setVerses(null)
        setStatus('unavailable')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [commentaryId, book, chapter])

  return { verses, status }
}
