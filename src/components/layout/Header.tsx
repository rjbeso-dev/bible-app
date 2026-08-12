import { Link, useLocation } from 'react-router-dom'
import { readLastRead } from '../../hooks/useLastRead'
import { ThemeToggle } from './ThemeToggle'
import { FontControls } from './FontControls'
import { Icon } from '../ui/Icon'

export function Header() {
  const location = useLocation()
  const last = readLastRead()
  const readTarget = `/read/${encodeURIComponent(last.book)}/${last.chapter}`
  const path = location.pathname
  const onHome = path === '/'
  const onReader = path.startsWith('/read')
  const onNotes = path.startsWith('/notes')

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="brand" aria-label="Bible Study home">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="sparkle" size={20} />
          </span>
          <span className="brand-text">Bible Study</span>
        </Link>

        <nav className="app-nav" aria-label="Primary">
          <Link
            to="/"
            className={'nav-link' + (onHome ? ' is-active' : '')}
            aria-current={onHome ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            to={readTarget}
            className={'nav-link' + (onReader ? ' is-active' : '')}
            aria-current={onReader ? 'page' : undefined}
          >
            Read
          </Link>
          <Link
            to="/notes"
            className={'nav-link' + (onNotes ? ' is-active' : '')}
            aria-current={onNotes ? 'page' : undefined}
          >
            Notes
          </Link>
        </nav>

        <div className="app-header-actions">
          <FontControls />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
