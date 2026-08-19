import { useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { NoteBiblePanel } from '../components/notes/NoteBiblePanel'
import { RichTextEditor, type RichTextEditorHandle } from '../components/notes/RichTextEditor'
import { plainTextToHtml } from '../lib/sanitizeNoteHtml'
import { Icon } from '../components/ui/Icon'

/** Full-page note composer: write a long-form note (sermon prep, study
 * outline) with a formatting toolbar and an optional side panel to browse
 * the Bible and quote verses in, without leaving the page. Also used to
 * edit an existing note. */
export function NoteComposerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes, addStandaloneNote, updateNoteFields, deleteNote } = useNotes()
  const existing = id ? notes.find((n) => n.id === id) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [reference, setReference] = useState(existing?.reference ?? '')
  const bodyRef = useRef({ html: existing?.bodyHtml ?? '', text: existing?.body ?? '' })
  const [hasBody, setHasBody] = useState(!!existing?.body.trim())
  const [bibleOpen, setBibleOpen] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const editorRef = useRef<RichTextEditorHandle>(null)

  // Editing a note that doesn't exist (bad id, or it was deleted elsewhere).
  if (id && !existing) {
    return <Navigate to="/notes" replace />
  }

  const isVerseTied = !!existing?.verseKey
  const initialHtml = existing?.bodyHtml ?? (existing?.body ? plainTextToHtml(existing.body) : '')

  const save = () => {
    const { html, text } = bodyRef.current
    const trimmed = text.trim()
    if (!trimmed) return
    setSaveError(null)
    const result = existing
      ? updateNoteFields(existing.id, { title, reference, body: trimmed, bodyHtml: html })
      : addStandaloneNote({ title, reference, body: trimmed, bodyHtml: html })
    if (!result.ok) {
      // Most likely cause: an attached image (or several) pushed this note
      // past localStorage's quota. Stay on the page — the draft (including
      // any images) is still intact in the editor — so the user can shrink
      // it and retry instead of silently losing the note.
      setSaveError(
        'Couldn’t save this note — your browser’s storage is full. Try removing an image, or shortening the note, then save again.',
      )
      return
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
          <RichTextEditor
            ref={editorRef}
            initialHtml={initialHtml}
            placeholder="Write your note. Open the Bible to quote a verse in as you go…"
            onChange={(html, text) => {
              bodyRef.current = { html, text }
              setHasBody(!!text.trim())
            }}
          />

          {saveError && (
            <p className="rich-editor-error" role="alert">
              {saveError}
              <button
                type="button"
                className="icon-button"
                onClick={() => setSaveError(null)}
                aria-label="Dismiss"
              >
                <Icon name="close" size={14} />
              </button>
            </p>
          )}

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
            <button type="button" className="button primary" onClick={save} disabled={!hasBody}>
              Save note
            </button>
          </footer>
        </div>

        {bibleOpen && (
          <NoteBiblePanel
            onInsert={(html) => editorRef.current?.insertHtml(html)}
            onClose={() => setBibleOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
