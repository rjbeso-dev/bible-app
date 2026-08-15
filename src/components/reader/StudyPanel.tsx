import { useEffect, useMemo, useState } from 'react'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { useHighlights } from '../../hooks/useHighlights'
import { useNotes } from '../../hooks/useNotes'
import { formatReference, verseKey as makeKey } from '../../lib/references'
import { getCrossRefs, type CrossRef } from '../../data/xrefs'
import { COMMENTARIES } from '../../api/commentarySource'
import { HighlightMenu } from '../study/HighlightMenu'
import { VersePopup } from '../study/VersePopup'
import { CommentaryPopup } from '../study/CommentaryPopup'
import { TranslationSelect } from './TranslationSelect'
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
  const { settings, setSecondaryTranslation } = useSettings()
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

  const [crossRefs, setCrossRefs] = useState<CrossRef[]>([])
  useEffect(() => {
    if (verse == null) {
      setCrossRefs([])
      return
    }
    let active = true
    void getCrossRefs(book, chapter, verse).then((refs) => {
      if (active) setCrossRefs(refs)
    })
    return () => {
      active = false
    }
  }, [book, chapter, verse])

  const [openXref, setOpenXref] = useState<CrossRef | null>(null)
  const [openCommentaryId, setOpenCommentaryId] = useState<string | null>(null)

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
        <div className="study-panel-commentary-head">
          <h3 id="study-parallel-h" className="study-panel-label">
            Parallel
          </h3>
          <TranslationSelect
            compact
            label="Compare with"
            value={settings.secondaryTranslation}
            onChange={setSecondaryTranslation}
          />
        </div>
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

      <section className="study-panel-section" aria-labelledby="study-xref-h">
        <h3 id="study-xref-h" className="study-panel-label">
          Cross-references
        </h3>
        {crossRefs.length > 0 ? (
          <>
            <ul className="study-panel-xrefs">
              {crossRefs.map((ref) => (
                <li key={ref.href}>
                  <button type="button" className="study-panel-list-item" onClick={() => setOpenXref(ref)}>
                    {ref.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="study-panel-xref-credit">Cross-references: OpenBible.info (CC BY)</p>
          </>
        ) : (
          <p className="study-panel-note-empty muted">No cross-references for this verse.</p>
        )}
      </section>

      <section className="study-panel-section" aria-labelledby="study-commentary-h">
        <h3 id="study-commentary-h" className="study-panel-label">
          Commentary
        </h3>
        <ul className="study-panel-xrefs">
          {COMMENTARIES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="study-panel-list-item"
                onClick={() => setOpenCommentaryId(c.id)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {openXref && <VersePopup xref={openXref} onClose={() => setOpenXref(null)} />}
      {openCommentaryId && (
        <CommentaryPopup
          commentaryId={openCommentaryId}
          book={book}
          chapter={chapter}
          verse={verse}
          reference={reference}
          onClose={() => setOpenCommentaryId(null)}
        />
      )}
    </aside>
  )
}
