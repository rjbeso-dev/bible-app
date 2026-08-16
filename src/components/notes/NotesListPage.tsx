import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../../hooks/useNotes'
import { BOOKS, getBook } from '../../data/books'
import { parseVerseKey } from '../../lib/references'
import type { Note } from '../../types'
import { Icon } from '../ui/Icon'

const BOOK_ORDER: Record<string, number> = BOOKS.reduce(
  (acc, b, i) => {
    acc[b.id] = i
    return acc
  },
  {} as Record<string, number>,
)

/** Note bodies can run long (sermon prep); keep the list scannable. */
const PREVIEW_CHARS = 240

function preview(body: string): string {
  return body.length > PREVIEW_CHARS ? body.slice(0, PREVIEW_CHARS).trimEnd() + '…' : body
}

interface BookGroup {
  book: string
  bookName: string
  notes: Array<{ note: Note; chapter: number; verse: number }>
}

export function NotesListPage() {
  const { notes, deleteNote } = useNotes()

  const { groups, general } = useMemo(() => {
    const byBook = new Map<string, BookGroup>()
    const standalone: Note[] = []
    for (const note of notes) {
      const parsed = note.verseKey ? parseVerseKey(note.verseKey) : null
      if (!parsed) {
        standalone.push(note)
        continue
      }
      const meta = getBook(parsed.book)
      const bookName = meta ? meta.name : parsed.book
      let group = byBook.get(parsed.book)
      if (!group) {
        group = { book: parsed.book, bookName, notes: [] }
        byBook.set(parsed.book, group)
      }
      group.notes.push({ note, chapter: parsed.chapter, verse: parsed.verse })
    }
    const out = Array.from(byBook.values())
    out.sort((a, b) => (BOOK_ORDER[a.book] ?? 999) - (BOOK_ORDER[b.book] ?? 999))
    for (const g of out) {
      g.notes.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse)
    }
    standalone.sort((a, b) => b.updatedAt - a.updatedAt)
    return { groups: out, general: standalone }
  }, [notes])

  if (notes.length === 0) {
    return (
      <div className="notes-page">
        <div className="notes-page-header">
          <h1 className="page-title">Notes</h1>
          <Link to="/notes/new" className="button primary">
            <Icon name="plus" size={16} /> New note
          </Link>
        </div>
        <div className="empty-state">
          <p className="empty-state-lead">No notes yet.</p>
          <p className="muted">
            Write a sermon outline or study note with the Bible open beside you, or
            open a chapter and tap a verse to add a quick note as you read.
          </p>
          <Link to="/notes/new" className="button primary">
            Write a note
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-page">
      <div className="notes-page-header">
        <h1 className="page-title">Notes</h1>
        <div className="notes-page-header-actions">
          <span className="muted">{notes.length} note{notes.length === 1 ? '' : 's'}</span>
          <Link to="/notes/new" className="button primary">
            <Icon name="plus" size={16} /> New note
          </Link>
        </div>
      </div>

      {general.length > 0 && (
        <section className="notes-group">
          <h2 className="notes-group-title">General</h2>
          <ul className="notes-items">
            {general.map((note) => (
              <StandaloneNoteCard
                key={note.id}
                note={note}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
          </ul>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.book} className="notes-group">
          <h2 className="notes-group-title">{group.bookName}</h2>
          <ul className="notes-items">
            {group.notes.map(({ note, chapter, verse }) => (
              <VerseNoteCard
                key={note.id}
                note={note}
                book={group.book}
                chapter={chapter}
                verse={verse}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function DeleteControl({ onDelete, label }: { onDelete: () => void; label: string }) {
  const [confirming, setConfirming] = useState(false)
  if (confirming) {
    return (
      <span className="note-card-confirm">
        <button type="button" className="button danger small" onClick={onDelete}>
          Delete
        </button>
        <button type="button" className="button ghost small" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    )
  }
  return (
    <button
      type="button"
      className="icon-button danger"
      onClick={() => setConfirming(true)}
      aria-label={label}
      title="Delete note"
    >
      <Icon name="trash" size={16} />
    </button>
  )
}

interface VerseNoteCardProps {
  note: Note
  book: string
  chapter: number
  verse: number
  onDelete: () => void
}

function VerseNoteCard({ note, book, chapter, verse, onDelete }: VerseNoteCardProps) {
  return (
    <li className="note-card">
      <div className="note-card-head">
        <div className="note-card-titles">
          <Link
            to={`/read/${encodeURIComponent(book)}/${chapter}#v-${verse}`}
            className="note-card-ref"
          >
            {note.reference}
          </Link>
          <Link to={`/notes/${note.id}`} className="icon-button" aria-label="Edit note" title="Edit note">
            <Icon name="edit" size={16} />
          </Link>
        </div>
        <DeleteControl onDelete={onDelete} label={`Delete note on ${note.reference}`} />
      </div>
      <Link to={`/notes/${note.id}`} className="note-card-body-link">
        <p className="note-card-body">{preview(note.body)}</p>
      </Link>
    </li>
  )
}

function StandaloneNoteCard({ note, onDelete }: { note: Note; onDelete: () => void }) {
  return (
    <li className="note-card">
      <div className="note-card-head">
        <Link to={`/notes/${note.id}`} className="note-card-ref">
          {note.title || note.reference || 'Untitled note'}
        </Link>
        <DeleteControl onDelete={onDelete} label={`Delete note ${note.title ?? ''}`} />
      </div>
      <Link to={`/notes/${note.id}`} className="note-card-body-link">
        <p className="note-card-body">{preview(note.body)}</p>
      </Link>
    </li>
  )
}
