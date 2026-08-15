import { useEffect } from 'react'
import { useCommentary } from '../../hooks/useCommentary'
import { COMMENTARIES } from '../../api/commentarySource'
import { Icon } from '../ui/Icon'

interface CommentaryPopupProps {
  commentaryId: string
  book: string
  chapter: number
  verse: number
  reference: string
  onClose: () => void
}

export function CommentaryPopup({
  commentaryId,
  book,
  chapter,
  verse,
  reference,
  onClose,
}: CommentaryPopupProps) {
  const commentary = useCommentary(commentaryId, book, chapter)
  const meta = COMMENTARIES.find((c) => c.id === commentaryId)
  const verseText = commentary.verses?.find((v) => v.verse === verse)?.text ?? null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${meta?.name ?? 'Commentary'} on ${reference}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{meta?.name}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <p className="commentary-popup-ref study-panel-label">{reference}</p>
        {commentary.status === 'loading' ? (
          <p className="study-panel-note-empty muted">Loading…</p>
        ) : verseText ? (
          <>
            <p className="study-panel-commentary-text">{verseText}</p>
            {meta && <p className="study-panel-xref-credit">{meta.name} — {meta.license}</p>}
          </>
        ) : (
          <p className="study-panel-note-empty muted">
            {meta?.name} doesn’t cover this passage.
          </p>
        )}
      </div>
    </div>
  )
}
