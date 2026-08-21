import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useSettings } from '../../context/useSettings'
import { withViewTransition, setTransitionOrigin } from '../../lib/viewTransition'
import { Icon } from '../ui/Icon'

interface ThemeToggleProps {
  /** 'rail' renders as a full-width rail item (icon + label) instead of a bare icon button. */
  variant?: 'header' | 'rail'
}

export function ThemeToggle({ variant = 'header' }: ThemeToggleProps = {}) {
  const { settings, toggleTheme } = useSettings()
  const isDark = settings.theme === 'dark'
  const isRail = variant === 'rail'

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setTransitionOrigin(e.clientX, e.clientY)
    // flushSync forces the theme change to land in the DOM before the browser
    // takes its "after" snapshot, so the reveal animation shows the real thing.
    withViewTransition(() => flushSync(toggleTheme))
  }

  return (
    <button
      type="button"
      className={isRail ? 'rail-item' : 'icon-button'}
      onClick={handleClick}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={isRail ? 24 : 18} />
      {isRail && <span className="rail-item-label">Theme</span>}
    </button>
  )
}
