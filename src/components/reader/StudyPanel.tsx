import { useMemo } from 'react'
import type { Verse } from '../../types'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { useHighlights } from '../../hooks/useHighlights'
import { useNotes } from '../../hooks/useNotes'
import { formatReference, verseKey as makeKey } from '../../lib/references'
import { HighlightMenu } from '../study/HighlightMenu'
import { Icon } from '../ui/Icon'
import { ChapterAttribution } from './ChapterAttribution'

/** Verses of context shown before/after the focus verse. */
const CONTEXT = 2

interface StudyPanelProps {
  book: string
  chapter: number
  /** The verse currently selected in the reader, or null for the empty state. */
  verse: number | null
  /** The already-loaded primary chapter's verses, for the context slice. */
  verses: Verse[]
  onOpenNote: (verse: number) => void
  onClose: () => void
}

/** Right-hand study panel: highlight, note, parallel text, and context for the selected verse. */
export function StudyPanel({ book, chapter, verse, verses, onOpenNote, onClose }: StudyPanelProps) {
  const { settings } = useSettings()
  const { colorFor, setHighlight, removeHighlight } = useHighlights()
  const { notesFor } = useNotes()
  const secondary = useChapter(
    verse != null ? book : undefined,
    verse != null ? chapter : undefined,
    settings.secondaryTranslation,
  )

  const key = verse != null ? makeKey(book, chapter, verse) : null
  const reference = verse != null ? formatReference(book, chapter, verse) : null
  const note = key ? (notesFor(key)[0] ?? null) : null
  const highlightColor = key ? colorFor(key) : null

  const secondaryVerse = useMemo(
    () => (verse != null ? (secondary.chapter?.verses.find((v) => v.verse === verse) ?? null) : null),
    [secondary.chapter, verse],
  )

  const contextRows = useMemo(() => {
    if (verse == null) return []
    const idx = verses.findIndex((v) => v.verse === verse)
    if (idx === -1) return []
    return verses.slice(Math.max(0, idx - CONTEXT), Math.min(verses.length, idx + CONTEXT + 1))
  }, [verses, verse])

  if (verse == null || !key || !reference) {
    return (
      <aside className="study-panel" aria-label="Study panel">
        <p className="study-panel-hint muted">Select a verse to study it.</p>
      </aside>
    )
  }

  return (
    <aside className="study-panel" aria-label="Study panel">
      <header className="study-panel-header">
        <h2 className="study-panel-ref">{reference}</h2>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close study panel"
        >
          <Icon name="close" />
        </button>
      </header>

      <section className="study-panel-section" aria-labelledby="study-highlight-h">
        <h3 id="study-highlight-h" className="study-panel-label">
          Highlight
        </h3>
        <HighlightMenu
          current={highlightColor}
          onPick={(color) => setHighlight(key, color)}
          onClear={() => removeHighlight(key)}
        />
      </section>

      <section className="study-panel-section" aria-labelledby="study-note-h">
        <h3 id="study-note-h" className="study-panel-label">
          Note
        </h3>
        {note ? (
          <p className="study-panel-note-body">{note.body}</p>
        ) : (
          <p className="study-panel-note-empty muted">No note yet.</p>
        )}
        <button type="button" className="button ghost small" onClick={() => onOpenNote(verse)}>
          {note ? 'Edit note' : 'Add note'}
        </button>
      </section>

      <section className="study-panel-section" aria-labelledby="study-parallel-h">
        <h3 id="study-parallel-h" className="study-panel-label">
          Parallel
        </h3>
        {secondaryVerse ? (
          <>
            <p className="study-panel-parallel-text">{secondaryVerse.text}</p>
            <span className="study-panel-parallel-label">{secondary.chapter?.translationName}</span>
            {secondary.chapter && (
              <ChapterAttribution translationId={secondary.chapter.translationId} />
            )}
          </>
        ) : secondary.status === 'loading' ? (
          <p className="study-panel-note-empty muted">Loading…</p>
        ) : (
          <p className="study-panel-note-empty muted">Not available in this translation.</p>
        )}
      </section>

      <section className="study-panel-section" aria-labelledby="study-context-h">
        <h3 id="study-context-h" className="study-panel-label">
          Context
        </h3>
        <div className="study-panel-context">
          {contextRows.map((v) => (
            <p
              key={v.verse}
              className={'study-panel-context-row' + (v.verse === verse ? ' is-focus' : '')}
            >
              <span className="context-verse-num">{v.verse}</span>{' '}
              <span className="context-verse-text">{v.text}</span>
            </p>
          ))}
        </div>
      </section>
    </aside>
  )
}
