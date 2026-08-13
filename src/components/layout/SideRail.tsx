import { Link, useLocation } from 'react-router-dom'
import { readLastRead } from '../../hooks/useLastRead'
import { ThemeToggle } from './ThemeToggle'
import { FontControls } from './FontControls'
import { MusicControls } from '../audio/MusicControls'
import { Icon } from '../ui/Icon'

/**
 * Left navigation rail. Icon-only by default; expands to reveal labels on hover
 * (Instagram-style). Becomes a fixed bottom bar on narrow screens.
 */
export function SideRail() {
  const location = useLocation()
  const last = readLastRead()
  const readTarget = `/read/${encodeURIComponent(last.book)}/${last.chapter}`
  const path = location.pathname
  const onHome = path === '/'
  const onReader = path.startsWith('/read')
  const onNotes = path.startsWith('/notes')

  return (
    <nav className="rail" aria-label="Primary">
      <div className="rail-top">
        <Link to="/" className="rail-brand" aria-label="Home">
          <span className="rail-brand-mark" aria-hidden="true">
            <Icon name="cross" size={24} />
          </span>
        </Link>
      </div>

      <div className="rail-spacer" aria-hidden="true" />

      {/* One centered stack: primary nav + the reading controls, Instagram-style. */}
      <div className="rail-nav">
        <Link
          to="/"
          className={'rail-item' + (onHome ? ' is-active' : '')}
          aria-current={onHome ? 'page' : undefined}
        >
          <Icon name="home" size={24} />
          <span className="rail-item-label">Home</span>
        </Link>
        <Link
          to={readTarget}
          className={'rail-item' + (onReader ? ' is-active' : '')}
          aria-current={onReader ? 'page' : undefined}
        >
          <Icon name="book" size={24} />
          <span className="rail-item-label">Read</span>
        </Link>
        <Link
          to="/notes"
          className={'rail-item' + (onNotes ? ' is-active' : '')}
          aria-current={onNotes ? 'page' : undefined}
        >
          <Icon name="note" size={24} />
          <span className="rail-item-label">Notes</span>
        </Link>

        <MusicControls variant="rail" />
        <FontControls variant="rail" />
        <ThemeToggle variant="rail" />
      </div>

      <div className="rail-spacer" aria-hidden="true" />
    </nav>
  )
}
