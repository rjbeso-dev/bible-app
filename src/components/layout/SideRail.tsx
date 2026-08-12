import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { readLastRead } from '../../hooks/useLastRead'
import { STORAGE_KEYS, readJSON, writeJSON } from '../../lib/storage'
import { ThemeToggle } from './ThemeToggle'
import { FontControls } from './FontControls'
import { MusicControls } from '../audio/MusicControls'
import { Icon } from '../ui/Icon'

/** Collapsible left navigation rail (a fixed bottom bar on narrow screens). */
export function SideRail() {
  const location = useLocation()
  const last = readLastRead()
  const readTarget = `/read/${encodeURIComponent(last.book)}/${last.chapter}`
  const path = location.pathname
  const onHome = path === '/'
  const onReader = path.startsWith('/read')
  const onNotes = path.startsWith('/notes')

  const [expanded, setExpanded] = useState(() =>
    readJSON<boolean>(STORAGE_KEYS.railExpanded, false),
  )

  useEffect(() => {
    writeJSON(STORAGE_KEYS.railExpanded, expanded)
  }, [expanded])

  return (
    <nav
      className={'rail' + (expanded ? ' is-expanded' : ' is-collapsed')}
      aria-label="Primary"
    >
      <div className="rail-top">
        <Link to="/" className="rail-brand" aria-label="Bible Study home">
          <span className="rail-brand-mark" aria-hidden="true">
            <Icon name="sparkle" size={22} />
          </span>
          <span className="rail-item-label rail-brand-text">Bible Study</span>
        </Link>
      </div>

      <div className="rail-spacer" aria-hidden="true" />

      {/* Primary nav, vertically centered in the rail. */}
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
      </div>

      <div className="rail-spacer" aria-hidden="true" />

      <div className="rail-bottom">
        <MusicControls variant="rail" />
        <FontControls variant="rail" />
        <ThemeToggle variant="rail" />
        <button
          type="button"
          className="rail-item rail-toggle-item"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={expanded}
        >
          <Icon name="menu" size={24} />
          <span className="rail-item-label">{expanded ? 'Collapse' : 'Menu'}</span>
        </button>
      </div>
    </nav>
  )
}
