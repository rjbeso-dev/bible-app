import { useEffect } from 'react'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import type { CrossRef } from '../../data/xrefs'
import { Icon } from '../ui/Icon'

interface VersePopupProps {
  xref: CrossRef
  onClose: () => void
}

/** Shows a cross-referenced verse in place, without navigating away from the current chapter. */
export function VersePopup({ xref, onClose }: VersePopupProps) {
  const { settings } = useSettings()
  const { chapter, status } = useChapter(xref.id, xref.chapter, settings.primaryTranslation)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const end = xref.endVerse ?? xref.verse
  const verses = chapter?.verses.filter((v) => v.verse >= xref.verse && v.verse <= end) ?? []

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={xref.label}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{xref.label}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        {status === 'loading' ? (
          <p className="study-panel-note-empty muted">Loading…</p>
        ) : verses.length > 0 ? (
          <p className="study-panel-parallel-text">
            {verses.map((v) => (
              <span key={v.verse}>
                {verses.length > 1 && <sup>{v.verse} </sup>}
                {v.text}{' '}
              </span>
            ))}
          </p>
        ) : (
          <p className="study-panel-note-empty muted">Couldn’t load this verse.</p>
        )}
      </div>
    </div>
  )
}
