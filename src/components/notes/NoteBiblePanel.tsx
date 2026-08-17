import { useState } from 'react'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { getBook } from '../../data/books'
import { formatReference } from '../../lib/references'
import { BookChapterPicker } from '../navigation/BookChapterPicker'
import { TranslationSelect } from '../reader/TranslationSelect'
import { Icon } from '../ui/Icon'

interface NoteBiblePanelProps {
  onInsert: (html: string) => void
  onClose: () => void
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Read-only Bible browser beside the note composer — click a verse to quote
 * it into the note, so writing a sermon or study note never means leaving
 * the page to go check a reference. */
export function NoteBiblePanel({ onInsert, onClose }: NoteBiblePanelProps) {
  const { settings } = useSettings()
  const [book, setBook] = useState('john')
  const [chapter, setChapter] = useState(1)
  const [translationId, setTranslationId] = useState(settings.primaryTranslation)
  const { chapter: data, status } = useChapter(book, chapter, translationId)
  const meta = getBook(book)

  return (
    <aside className="note-bible-panel" aria-label="Bible reference">
      <header className="note-bible-panel-header">
        <BookChapterPicker book={book} chapter={chapter} onSelect={(b, c) => { setBook(b); setChapter(c) }} />
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close Bible panel">
          <Icon name="close" />
        </button>
      </header>
      <TranslationSelect compact label="Translation" value={translationId} onChange={setTranslationId} />
      <p className="note-bible-panel-hint muted">Tap a verse to quote it into your note.</p>
      <div className="note-bible-panel-body">
        {status === 'loading' && <p className="muted">Loading…</p>}
        {status === 'error' && <p className="muted">Couldn’t load this chapter.</p>}
        {data?.verses.map((v) => (
          <button
            key={v.verse}
            type="button"
            className="note-bible-verse"
            onClick={() =>
              onInsert(
                `<div class="note-quote"><strong>${escapeHtml(formatReference(book, chapter, v.verse))}</strong> ` +
                  `<em>(${escapeHtml(data.translationId.toUpperCase())})</em><br>${escapeHtml(v.text)}</div><p><br></p>`,
              )
            }
          >
            <sup>{v.verse}</sup> {v.text}
          </button>
        ))}
      </div>
      {meta && <p className="note-bible-panel-credit muted">{meta.name} {chapter}</p>}
    </aside>
  )
}
