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
      <dl className="book-intro-meta">
        <div className="book-intro-meta-row">
          <dt>Author</dt>
          <dd>{meta.author}</dd>
        </div>
        <div className="book-intro-meta-row">
          <dt>Written</dt>
          <dd>{meta.written}</dd>
        </div>
        <div className="book-intro-meta-row">
          <dt>Where</dt>
          <dd>{meta.place}</dd>
        </div>
        <div className="book-intro-meta-row">
          <dt>Audience</dt>
          <dd>{meta.audience}</dd>
        </div>
        <div className="book-intro-meta-row">
          <dt>Genre</dt>
          <dd>{meta.genre}</dd>
        </div>
        <div className="book-intro-meta-row">
          <dt>Themes</dt>
          <dd>{meta.themes}</dd>
        </div>
      </dl>
    </aside>
  )
}
