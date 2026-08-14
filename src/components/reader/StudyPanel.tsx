import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { useHighlights } from '../../hooks/useHighlights'
import { useNotes } from '../../hooks/useNotes'
import { useCommentary } from '../../hooks/useCommentary'
import { formatReference, verseKey as makeKey } from '../../lib/references'
import { getCrossRefs, type CrossRef } from '../../data/xrefs'
import { COMMENTARIES } from '../../api/commentarySource'
import { HighlightMenu } from '../study/HighlightMenu'
import { Icon } from '../ui/Icon'

/** Commentary text is often long; collapse past this and offer to expand. */
const COMMENTARY_PREVIEW_CHARS = 420

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

  const [commentaryId, setCommentaryId] = useState(COMMENTARIES[0].id)
  const [commentaryExpanded, setCommentaryExpanded] = useState(false)
  const commentary = useCommentary(commentaryId, book, chapter)
  const commentaryVerse = useMemo(
    () => (verse != null ? (commentary.verses?.find((v) => v.verse === verse) ?? null) : null),
    [commentary.verses, verse],
  )
  const commentaryMeta = COMMENTARIES.find((c) => c.id === commentaryId)
  useEffect(() => {
    setCommentaryExpanded(false)
  }, [verse, commentaryId])

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

      <section className="study-panel-section" aria-labelledby="study-xref-h">
        <h3 id="study-xref-h" className="study-panel-label">
          Cross-references
        </h3>
        {crossRefs.length > 0 ? (
          <>
            <ul className="study-panel-xrefs">
              {crossRefs.map((ref) => (
                <li key={ref.href}>
                  <Link to={ref.href}>{ref.label}</Link>
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
        <div className="study-panel-commentary-head">
          <h3 id="study-commentary-h" className="study-panel-label">
            Commentary
          </h3>
          <select
            className="study-panel-commentary-select"
            value={commentaryId}
            onChange={(e) => setCommentaryId(e.target.value)}
            aria-label="Choose a commentary"
          >
            {COMMENTARIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {commentary.status === 'loading' ? (
          <p className="study-panel-note-empty muted">Loading…</p>
        ) : commentaryVerse ? (
          <>
            <p className="study-panel-commentary-text">
              {commentaryExpanded || commentaryVerse.text.length <= COMMENTARY_PREVIEW_CHARS
                ? commentaryVerse.text
                : commentaryVerse.text.slice(0, COMMENTARY_PREVIEW_CHARS).trimEnd() + '…'}
            </p>
            {commentaryVerse.text.length > COMMENTARY_PREVIEW_CHARS && (
              <button
                type="button"
                className="button ghost small"
                onClick={() => setCommentaryExpanded((e) => !e)}
              >
                {commentaryExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
            {commentaryMeta && (
              <p className="study-panel-xref-credit">
                {commentaryMeta.name} — {commentaryMeta.license}
              </p>
            )}
          </>
        ) : (
          <p className="study-panel-note-empty muted">
            {commentaryMeta?.name} doesn’t cover this passage.
          </p>
        )}
      </section>
    </aside>
  )
}
