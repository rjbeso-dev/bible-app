import { useEffect, useRef, useState } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { formatReference, parseVerseKey } from '../../lib/references'
import { Icon } from '../ui/Icon'

interface NotePopoverProps {
  verseKey: string
  onClose: () => void
}

/** Modal for creating/editing/deleting notes attached to a single verse. */
export function NotePopover({ verseKey, onClose }: NotePopoverProps) {
  const { notesFor, addNote, updateNote, deleteNote } = useNotes()
  const existing = notesFor(verseKey)
  const parsed = parseVerseKey(verseKey)
  const reference = parsed
    ? formatReference(parsed.book, parsed.chapter, parsed.verse)
    : verseKey

  // Editing the first existing note, or composing a new one.
  const [editingId, setEditingId] = useState<string | null>(
    existing.length > 0 ? existing[0].id : null,
  )
  const [draft, setDraft] = useState(existing.length > 0 ? existing[0].body : '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = () => {
    const body = draft.trim()
    if (!body) return
    if (editingId) {
      updateNote(editingId, body)
    } else {
      addNote(verseKey, reference, body)
    }
    onClose()
  }

  const startNew = () => {
    setEditingId(null)
    setDraft('')
    textareaRef.current?.focus()
  }

  const editNote = (id: string, body: string) => {
    setEditingId(id)
    setDraft(body)
    textareaRef.current?.focus()
  }

  const remove = (id: string) => {
    deleteNote(id)
    const remaining = notesFor(verseKey).filter((n) => n.id !== id)
    if (remaining.length > 0) {
      editNote(remaining[0].id, remaining[0].body)
    } else {
      setEditingId(null)
      setDraft('')
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal note-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Notes on ${reference}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{reference}</h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close notes"
          >
            <Icon name="close" />
          </button>
        </header>

        {existing.length > 0 && (
          <ul className="note-list">
            {existing.map((n) => (
              <li
                key={n.id}
                className={'note-list-item' + (n.id === editingId ? ' is-editing' : '')}
              >
                <button
                  type="button"
                  className="note-list-body"
                  onClick={() => editNote(n.id, n.body)}
                >
                  {n.body}
                </button>
                <button
                  type="button"
                  className="icon-button danger"
                  onClick={() => remove(n.id)}
                  aria-label="Delete note"
                  title="Delete note"
                >
                  <Icon name="trash" size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <textarea
          ref={textareaRef}
          className="note-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={editingId ? 'Edit your note…' : 'Write a note…'}
          rows={4}
        />

        <footer className="modal-footer">
          {existing.length > 0 && editingId && (
            <button type="button" className="button ghost" onClick={startNew}>
              <Icon name="plus" size={16} /> New note
            </button>
          )}
          <span className="modal-footer-spacer" />
          <button type="button" className="button ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="button primary"
            onClick={save}
            disabled={!draft.trim()}
          >
            {editingId ? 'Save' : 'Add note'}
          </button>
        </footer>
      </div>
    </div>
  )
}
