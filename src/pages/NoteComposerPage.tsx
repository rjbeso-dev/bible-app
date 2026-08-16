import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { NoteBiblePanel } from '../components/notes/NoteBiblePanel'
import { Icon } from '../components/ui/Icon'

/** Full-page note composer: write a long-form note (sermon prep, study
 * outline) with an optional side panel to browse the Bible and quote verses
 * in, without leaving the page. Also used to edit an existing note. */
export function NoteComposerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes, addStandaloneNote, updateNoteFields, deleteNote } = useNotes()
  const existing = id ? notes.find((n) => n.id === id) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [reference, setReference] = useState(existing?.reference ?? '')
  const [body, setBody] = useState(existing?.body ?? '')
  const [bibleOpen, setBibleOpen] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!existing) textareaRef.current?.focus()
  }, [existing])

  // Editing a note that doesn't exist (bad id, or it was deleted elsewhere).
  if (id && !existing) {
    return <Navigate to="/notes" replace />
  }

  const isVerseTied = !!existing?.verseKey

  const insertQuote = (text: string) => {
    const el = textareaRef.current
    if (!el) {
      setBody((b) => b + (b && !b.endsWith('\n') ? '\n\n' : '') + text)
      return
    }
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const next = el.value.slice(0, start) + text + el.value.slice(end)
    setBody(next)
    requestAnimationFrame(() => {
      el.focus()
      const caret = start + text.length
      el.setSelectionRange(caret, caret)
    })
  }

  const save = () => {
    const trimmed = body.trim()
    if (!trimmed) return
    if (existing) {
      updateNoteFields(existing.id, { title, reference, body: trimmed })
    } else {
      addStandaloneNote({ title, reference, body: trimmed })
    }
    navigate('/notes')
  }

  const remove = () => {
    if (!existing) return
    deleteNote(existing.id)
    navigate('/notes')
  }

  return (
    <div className="note-composer-page">
      <div className="note-composer-layout">
        <div className="note-composer-main">
          <header className="note-composer-header">
            <button
              type="button"
              className="icon-button"
              onClick={() => navigate('/notes')}
              aria-label="Back to notes"
            >
              <Icon name="chevron-left" />
            </button>
            <h1 className="page-title">{existing ? 'Edit note' : 'New note'}</h1>
            <button
              type="button"
              className={'button ghost' + (bibleOpen ? ' is-active' : '')}
              onClick={() => setBibleOpen((o) => !o)}
              aria-pressed={bibleOpen}
            >
              <Icon name="book" size={16} /> {bibleOpen ? 'Hide Bible' : 'Open Bible'}
            </button>
          </header>

          {isVerseTied && existing?.reference && (
            <p className="note-composer-verse-tag muted">
              Originally added on <strong>{existing.reference}</strong> while reading.
            </p>
          )}

          <input
            type="text"
            className="note-composer-title"
            placeholder="Title (optional) — e.g. “Sunday sermon: Romans 8”"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="note-composer-reference"
            placeholder="Reference or topic (optional) — e.g. “Romans 8:1-17”"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <textarea
            ref={textareaRef}
            className="note-composer-body"
            placeholder="Write your note. Open the Bible to quote a verse in as you go…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <footer className="note-composer-footer">
            {existing &&
              (confirmingDelete ? (
                <span className="note-card-confirm">
                  <button type="button" className="button danger small" onClick={remove}>
                    Delete note
                  </button>
                  <button
                    type="button"
                    className="button ghost small"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="button ghost danger"
                  onClick={() => setConfirmingDelete(true)}
                >
                  <Icon name="trash" size={16} /> Delete
                </button>
              ))}
            <span className="modal-footer-spacer" />
            <button type="button" className="button ghost" onClick={() => navigate('/notes')}>
              Cancel
            </button>
            <button type="button" className="button primary" onClick={save} disabled={!body.trim()}>
              Save note
            </button>
          </footer>
        </div>

        {bibleOpen && (
          <NoteBiblePanel onInsert={insertQuote} onClose={() => setBibleOpen(false)} />
        )}
      </div>
    </div>
  )
}
