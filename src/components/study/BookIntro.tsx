import { getBook } from '../../data/books'
import { Icon } from '../ui/Icon'

interface BookIntroProps {
  book: string
  /** When false, render nothing (used to collapse via an info toggle). */
  open: boolean
  onClose?: () => void
}

/** Renders the static per-book introduction from books.ts. */
export function BookIntro({ book, open, onClose }: BookIntroProps) {
  const meta = getBook(book)
  if (!meta || !open) return null
  return (
    <aside className="book-intro" aria-label={`About ${meta.name}`}>
      <div className="book-intro-header">
        <span className="book-intro-eyebrow">
          {meta.testament === 'OT' ? 'Old Testament' : 'New Testament'} · {meta.chapterCount} chapters
        </span>
        {onClose && (
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Hide introduction"
            title="Hide introduction"
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      <h2 className="book-intro-title">{meta.name}</h2>
      <p className="book-intro-body">{meta.intro}</p>
    </aside>
  )
}
