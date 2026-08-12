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

interface Group {
  book: string
  bookName: string
  notes: Array<{ note: Note; chapter: number; verse: number }>
}

export function NotesListPage() {
  const { notes, deleteNote } = useNotes()

  const groups = useMemo<Group[]>(() => {
    const byBook = new Map<string, Group>()
    for (const note of notes) {
      const parsed = parseVerseKey(note.verseKey)
      if (!parsed) continue
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
    return out
  }, [notes])

  if (notes.length === 0) {
    return (
      <div className="notes-page">
        <h1 className="page-title">Notes</h1>
        <div className="empty-state">
          <p className="empty-state-lead">No notes yet.</p>
          <p className="muted">
            Open a chapter, tap a verse, and choose “Add note” to start a study
            journal that lives only in your browser.
          </p>
          <Link to="/read/john/1" className="button primary">
            Start reading
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-page">
      <div className="notes-page-header">
        <h1 className="page-title">Notes</h1>
        <span className="muted">{notes.length} note{notes.length === 1 ? '' : 's'}</span>
      </div>

      {groups.map((group) => (
        <section key={group.book} className="notes-group">
          <h2 className="notes-group-title">{group.bookName}</h2>
          <ul className="notes-items">
            {group.notes.map(({ note, chapter, verse }) => (
              <NoteCard
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

interface NoteCardProps {
  note: Note
  book: string
  chapter: number
  verse: number
  onDelete: () => void
}

function NoteCard({ note, book, chapter, verse, onDelete }: NoteCardProps) {
  const [confirming, setConfirming] = useState(false)
  return (
    <li className="note-card">
      <div className="note-card-head">
        <Link
          to={`/read/${encodeURIComponent(book)}/${chapter}#v-${verse}`}
          className="note-card-ref"
        >
          {note.reference}
        </Link>
        {confirming ? (
          <span className="note-card-confirm">
            <button type="button" className="button danger small" onClick={onDelete}>
              Delete
            </button>
            <button
              type="button"
              className="button ghost small"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="icon-button danger"
            onClick={() => setConfirming(true)}
            aria-label={`Delete note on ${note.reference}`}
            title="Delete note"
          >
            <Icon name="trash" size={16} />
          </button>
        )}
      </div>
      <p className="note-card-body">{note.body}</p>
    </li>
  )
}
