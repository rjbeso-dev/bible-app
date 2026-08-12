import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Verse } from '../../types'
import { useChapter } from '../../hooks/useChapter'
import { nextChapter, prevChapter, formatReference } from '../../lib/references'
import { Icon } from '../ui/Icon'

const CONTEXT = 2 // verses to show before and after the focus verse

interface VerseContextPanelProps {
  book: string
  chapter: number
  verse: number
  translationId: string
  verses: Verse[]
  onClose: () => void
}

interface ContextRow {
  ref: string
  verseText: string
  verseNum: number
  isFocus: boolean
  chapterBook: string
  chapterNum: number
}

/**
 * Show a focus verse with a couple of verses on either side, pulling from
 * adjacent chapters when the window crosses a chapter boundary.
 */
export function VerseContextPanel({
  book,
  chapter,
  verse,
  translationId,
  verses,
  onClose,
}: VerseContextPanelProps) {
  const navigate = useNavigate()

  const idx = verses.findIndex((v) => v.verse === verse)
  const needPrev = idx !== -1 && idx - CONTEXT < 0
  const needNext = idx !== -1 && idx + CONTEXT > verses.length - 1

  const prevRef = needPrev ? prevChapter(book, chapter) : null
  const nextRef = needNext ? nextChapter(book, chapter) : null

  const prevChap = useChapter(prevRef?.book, prevRef?.chapter, translationId)
  const nextChap = useChapter(nextRef?.book, nextRef?.chapter, translationId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = useMemo<ContextRow[]>(() => {
    if (idx === -1) return []
    const out: ContextRow[] = []

    // Preceding context, dipping into previous chapter if needed.
    const beforeNeeded = CONTEXT
    const beforeAvailable = verses.slice(Math.max(0, idx - beforeNeeded), idx)
    const missingBefore = beforeNeeded - beforeAvailable.length
    if (missingBefore > 0 && prevRef && prevChap.chapter) {
      const pv = prevChap.chapter.verses
      pv.slice(Math.max(0, pv.length - missingBefore)).forEach((v) =>
        out.push({
          ref: formatReference(prevRef.book, prevRef.chapter, v.verse),
          verseText: v.text,
          verseNum: v.verse,
          isFocus: false,
          chapterBook: prevRef.book,
          chapterNum: prevRef.chapter,
        }),
      )
    }
    beforeAvailable.forEach((v) =>
      out.push({
        ref: formatReference(book, chapter, v.verse),
        verseText: v.text,
        verseNum: v.verse,
        isFocus: false,
        chapterBook: book,
        chapterNum: chapter,
      }),
    )

    // Focus verse.
    const focus = verses[idx]
    out.push({
      ref: formatReference(book, chapter, focus.verse),
      verseText: focus.text,
      verseNum: focus.verse,
      isFocus: true,
      chapterBook: book,
      chapterNum: chapter,
    })

    // Following context, dipping into next chapter if needed.
    const afterNeeded = CONTEXT
    const afterAvailable = verses.slice(idx + 1, idx + 1 + afterNeeded)
    afterAvailable.forEach((v) =>
      out.push({
        ref: formatReference(book, chapter, v.verse),
        verseText: v.text,
        verseNum: v.verse,
        isFocus: false,
        chapterBook: book,
        chapterNum: chapter,
      }),
    )
    const missingAfter = afterNeeded - afterAvailable.length
    if (missingAfter > 0 && nextRef && nextChap.chapter) {
      const nv = nextChap.chapter.verses
      nv.slice(0, missingAfter).forEach((v) =>
        out.push({
          ref: formatReference(nextRef.book, nextRef.chapter, v.verse),
          verseText: v.text,
          verseNum: v.verse,
          isFocus: false,
          chapterBook: nextRef.book,
          chapterNum: nextRef.chapter,
        }),
      )
    }

    return out
  }, [idx, verses, book, chapter, prevRef, nextRef, prevChap.chapter, nextChap.chapter])

  const focusRef = formatReference(book, chapter, verse)

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal context-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Context for ${focusRef}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{focusRef}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close context">
            <Icon name="close" />
          </button>
        </header>

        <div className="context-body">
          {rows.map((row) => (
            <p
              key={`${row.chapterBook}.${row.chapterNum}.${row.verseNum}`}
              className={'context-row' + (row.isFocus ? ' is-focus' : '')}
            >
              <span className="context-verse-num">{row.verseNum}</span>
              <span className="context-verse-text">{row.verseText}</span>
            </p>
          ))}
          {rows.length === 0 && <p className="muted">Verse not found in this chapter.</p>}
        </div>

        <footer className="modal-footer">
          <span className="modal-footer-spacer" />
          <button
            type="button"
            className="button primary"
            onClick={() => {
              onClose()
              navigate(`/read/${encodeURIComponent(book)}/${chapter}#v-${verse}`)
            }}
          >
            View whole chapter
          </button>
        </footer>
      </div>
    </div>
  )
}
