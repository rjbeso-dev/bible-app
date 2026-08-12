import { useNavigate } from 'react-router-dom'
import { nextChapter, prevChapter, formatReference } from '../../lib/references'
import { Icon } from '../ui/Icon'

interface ChapterPagerProps {
  book: string
  chapter: number
  className?: string
  /** Optional label shown between the prev/next buttons, e.g. the current chapter. */
  currentLabel?: string
}

export function ChapterPager({ book, chapter, className, currentLabel }: ChapterPagerProps) {
  const navigate = useNavigate()
  const prev = prevChapter(book, chapter)
  const next = nextChapter(book, chapter)

  const go = (target: { book: string; chapter: number } | null) => {
    if (!target) return
    navigate(`/read/${encodeURIComponent(target.book)}/${target.chapter}`)
  }

  return (
    <div className={'chapter-pager' + (className ? ' ' + className : '')}>
      <button
        type="button"
        className="pager-button"
        onClick={() => go(prev)}
        disabled={!prev}
        aria-label={prev ? `Previous: ${formatReference(prev.book, prev.chapter)}` : 'No previous chapter'}
      >
        <Icon name="chevron-left" size={16} />
        <span className="pager-label">
          {prev ? formatReference(prev.book, prev.chapter) : 'Start'}
        </span>
      </button>

      {currentLabel && <span className="pager-current">{currentLabel}</span>}

      <button
        type="button"
        className="pager-button pager-button-next"
        onClick={() => go(next)}
        disabled={!next}
        aria-label={next ? `Next: ${formatReference(next.book, next.chapter)}` : 'No next chapter'}
      >
        <span className="pager-label">
          {next ? formatReference(next.book, next.chapter) : 'End'}
        </span>
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  )
}
