import { useMemo } from 'react'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { useHighlights } from '../../hooks/useHighlights'
import { useNotes } from '../../hooks/useNotes'
import { formatReference, verseKey as makeKey } from '../../lib/references'
import { HighlightMenu } from '../study/HighlightMenu'
import { Icon } from '../ui/Icon'

interface StudyPanelProps {
  book: string
  chapter: number
  /** The verse currently selected in the reader, or null for the empty state. */
  verse: number | null
  onOpenNote: (verse: number) => void
  onClose: () => void
}

/** Right-hand study panel: highlight, note, and parallel text for the selected verse. */
export function StudyPanel({ book, chapter, verse, onOpenNote, onClose }: StudyPanelProps) {
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
          </>
        ) : secondary.status === 'loading' ? (
          <p className="study-panel-note-empty muted">Loading…</p>
        ) : (
          <p className="study-panel-note-empty muted">Not available in this translation.</p>
        )}
      </section>
    </aside>
  )
}
