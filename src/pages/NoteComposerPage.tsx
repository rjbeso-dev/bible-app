import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { useAuth } from '../context/useAuth'
import { useAuthGate } from '../context/useAuthGate'
import { NoteBiblePanel } from '../components/notes/NoteBiblePanel'
import { RichTextEditor, type RichTextEditorHandle } from '../components/notes/RichTextEditor'
import { plainTextToHtml, sanitizeNoteHtml } from '../lib/sanitizeNoteHtml'
import { parseNoteHtml, noteFileName } from '../lib/noteDocument'
import { exportNoteToPdf } from '../lib/exportNoteToPdf'
import { exportNoteToDocx } from '../lib/exportNoteToDocx'
import { Icon } from '../components/ui/Icon'

type ExportFormat = 'pdf' | 'docx'

/** Full-page note composer: write a long-form note (sermon prep, study
 * outline) with a formatting toolbar and an optional side panel to browse
 * the Bible and quote verses in, without leaving the page. Also used to
 * edit an existing note. */
export function NoteComposerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes, addStandaloneNote, updateNoteFields, deleteNote } = useNotes()
  const { user, enabled } = useAuth()
  const { promptSignIn } = useAuthGate()
  const existing = id ? notes.find((n) => n.id === id) : undefined
  const blockedForSignIn = !existing && enabled && !user

  const [title, setTitle] = useState(existing?.title ?? '')
  const [reference, setReference] = useState(existing?.reference ?? '')
  const bodyRef = useRef({ html: existing?.bodyHtml ?? '', text: existing?.body ?? '' })
  const [hasBody, setHasBody] = useState(!!existing?.body.trim())
  const [bibleOpen, setBibleOpen] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportBusy, setExportBusy] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const editorRef = useRef<RichTextEditorHandle>(null)

  useEffect(() => {
    if (!exportOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExportOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exportOpen])

  // Direct navigation to /notes/new (or a refresh mid-draft) bypasses the
  // gate on the "New note" buttons that link here — catch it at the route
  // itself too, same as the "note doesn't exist" bounce below.
  useEffect(() => {
    if (blockedForSignIn) promptSignIn('Sign in to write and save notes.')
  }, [blockedForSignIn, promptSignIn])

  // Editing a note that doesn't exist (bad id, or it was deleted elsewhere).
  if (id && !existing) {
    return <Navigate to="/notes" replace />
  }

  if (blockedForSignIn) {
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

  const runExport = async (format: ExportFormat) => {
    setExportOpen(false)
    const { html, text } = bodyRef.current
    if (!text.trim()) return
    setExportError(null)
    setExportBusy(true)
    try {
      const blocks = await parseNoteHtml(sanitizeNoteHtml(html))
      const fileName = noteFileName(title || reference || 'Note')
      if (format === 'pdf') {
        exportNoteToPdf(blocks, fileName, title.trim() || undefined)
      } else {
        await exportNoteToDocx(blocks, fileName, title.trim() || undefined)
      }
    } catch {
      setExportError('Couldn’t export this note. Try again.')
    } finally {
      setExportBusy(false)
    }
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
            <div className="note-export-menu">
              <button
                type="button"
                className="button ghost"
                aria-haspopup="menu"
                aria-expanded={exportOpen}
                disabled={!hasBody || exportBusy}
                onClick={() => setExportOpen((o) => !o)}
              >
                <Icon name="download" size={16} /> {exportBusy ? 'Exporting…' : 'Export'}
              </button>
              {exportOpen && (
                <>
                  <div className="popover-backdrop" onClick={() => setExportOpen(false)} aria-hidden="true" />
                  <div className="note-export-panel" role="menu" aria-label="Export note">
                    <button
                      type="button"
                      role="menuitem"
                      className="note-export-item"
                      onClick={() => runExport('pdf')}
                    >
                      <Icon name="file-text" size={16} /> Export as PDF
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="note-export-item"
                      onClick={() => runExport('docx')}
                    >
                      <Icon name="file-text" size={16} /> Export as Word (.docx)
                    </button>
                  </div>
                </>
              )}
            </div>
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

          {exportError && (
            <p className="rich-editor-error" role="alert">
              {exportError}
              <button
                type="button"
                className="icon-button"
                onClick={() => setExportError(null)}
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
