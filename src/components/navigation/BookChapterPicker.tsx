import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT_BOOKS, OT_BOOKS, getBook } from '../../data/books'
import type { BookMeta } from '../../types'
import { Icon } from '../ui/Icon'

interface BookChapterPickerProps {
  book: string
  chapter: number
}

export function BookChapterPicker({ book, chapter }: BookChapterPickerProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const current = getBook(book)
  // Book whose chapter grid is shown; defaults to the current book.
  const [expanded, setExpanded] = useState<BookMeta | null>(current ?? null)

  useEffect(() => {
    if (open) setExpanded(getBook(book) ?? null)
  }, [open, book])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const label = current ? `${current.name} ${chapter}` : `${book} ${chapter}`

  const chapters = useMemo(
    () => (expanded ? Array.from({ length: expanded.chapterCount }, (_, i) => i + 1) : []),
    [expanded],
  )

  const pickChapter = (bookId: string, ch: number) => {
    setOpen(false)
    navigate(`/read/${encodeURIComponent(bookId)}/${ch}`)
  }

  return (
    <div className="book-picker">
      <button
        type="button"
        className="book-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="book-picker-label">{label}</span>
        <Icon name="chevron-down" size={16} className="book-picker-caret" />
      </button>

      {open && (
        <>
          <div className="popover-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="book-picker-panel" role="dialog" aria-label="Choose a book and chapter">
            <div className="book-picker-columns">
              <div className="book-list" aria-label="Books">
                <BookGroup
                  title="Old Testament"
                  books={OT_BOOKS}
                  activeId={expanded?.id}
                  currentId={book}
                  onPick={setExpanded}
                />
                <BookGroup
                  title="New Testament"
                  books={NT_BOOKS}
                  activeId={expanded?.id}
                  currentId={book}
                  onPick={setExpanded}
                />
              </div>

              <div className="chapter-grid-wrap">
                {expanded ? (
                  <>
                    <div className="chapter-grid-title">{expanded.name}</div>
                    <div className="chapter-grid" role="listbox" aria-label={`Chapters in ${expanded.name}`}>
                      {chapters.map((ch) => {
                        const isCurrent = expanded.id === book && ch === chapter
                        return (
                          <button
                            key={ch}
                            type="button"
                            className={'chapter-cell' + (isCurrent ? ' is-current' : '')}
                            onClick={() => pickChapter(expanded.id, ch)}
                            aria-current={isCurrent ? 'true' : undefined}
                          >
                            {ch}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="muted">Select a book</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface BookGroupProps {
  title: string
  books: BookMeta[]
  activeId: string | undefined
  currentId: string
  onPick: (b: BookMeta) => void
}

function BookGroup({ title, books, activeId, currentId, onPick }: BookGroupProps) {
  return (
    <div className="book-group">
      <div className="book-group-title">{title}</div>
      <ul className="book-group-list">
        {books.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              className={
                'book-item' +
                (b.id === activeId ? ' is-active' : '') +
                (b.id === currentId ? ' is-current' : '')
              }
              onClick={() => onPick(b)}
            >
              {b.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
