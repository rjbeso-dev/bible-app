import { useState } from 'react'
import { getBook } from '../../data/books'
import { BIBLE_PROJECT_VIDEOS } from '../../data/bibleProjectVideos'
import { BibleProjectPlayer } from './BibleProjectPlayer'
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
  const videos = BIBLE_PROJECT_VIDEOS[book]
  const [playing, setPlaying] = useState<{ slug: string; title: string } | null>(null)
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
      {videos && (
        <div className="book-intro-watch">
          <span className="book-intro-watch-label">Watch</span>
          <div className="book-intro-watch-links">
            {videos.map((v) => {
              const title = v.label ? `${meta.name} — ${v.label}` : meta.name
              return (
                <button
                  key={v.slug}
                  type="button"
                  className="button ghost small"
                  onClick={() => setPlaying({ slug: v.slug, title })}
                >
                  <Icon name="play" size={14} />
                  {v.label ? `BibleProject — ${v.label}` : 'Watch on BibleProject'}
                </button>
              )
            })}
          </div>
        </div>
      )}
      {playing && (
        <BibleProjectPlayer
          slug={playing.slug}
          title={playing.title}
          onClose={() => setPlaying(null)}
        />
      )}
    </aside>
  )
}
