import { useEffect } from 'react'
import { bibleProjectHref } from '../../data/bibleProjectVideos'
import { Icon } from '../ui/Icon'

interface BibleProjectPlayerProps {
  slug: string
  title: string
  onClose: () => void
}

/**
 * Plays a BibleProject video in-app via their own page, embedded in an
 * iframe — no tab switch. Their site sets no X-Frame-Options / CSP
 * frame-ancestors restriction (verified), so this is a legitimate embed of
 * their real, canonical page rather than a scraped or guessed video ID.
 */
export function BibleProjectPlayer({ slug, title, onClose }: BibleProjectPlayerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const href = bibleProjectHref(slug)

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
            <a href={href} target="_blank" rel="noreferrer" className="icon-button" title="Open in a new tab">
              <Icon name="arrow-right" size={16} />
            </a>
            <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
        </header>
        <div className="video-modal-frame">
          <iframe
            src={href}
            title={title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="video-modal-credit">
          From <a href="https://bibleproject.com/" target="_blank" rel="noreferrer">BibleProject</a>, embedded from their site.
        </p>
      </div>
    </div>
  )
}
