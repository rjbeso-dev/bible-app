import { useEffect } from 'react'
import { Icon } from '../ui/Icon'

interface YouTubePlayerProps {
  videoId: string
  title: string
  onClose: () => void
}

/**
 * Plays a BibleProject video in-app via YouTube's embeddable player —
 * no tab switch. BibleProject's own site can't be embedded (it sends
 * x-frame-options: SAMEORIGIN), but their official YouTube uploads can.
 */
export function YouTubePlayer({ videoId, title, onClose }: YouTubePlayerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal video-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <div className="video-modal-actions">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noreferrer"
              className="icon-button"
              title="Open on YouTube"
            >
              <Icon name="arrow-right" size={16} />
            </a>
            <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
        </header>
        <div className="video-modal-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="video-modal-credit">
          From <a href="https://bibleproject.com/" target="_blank" rel="noreferrer">BibleProject</a>, via their official YouTube channel.
        </p>
      </div>
    </div>
  )
}
