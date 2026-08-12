import { useSettings } from '../../context/useSettings'
import { Icon } from '../ui/Icon'

interface ThemeToggleProps {
  /** 'rail' renders as a full-width rail item (icon + label) instead of a bare icon button. */
  variant?: 'header' | 'rail'
}

export function ThemeToggle({ variant = 'header' }: ThemeToggleProps = {}) {
  const { settings, toggleTheme } = useSettings()
  const isDark = settings.theme === 'dark'
  const isRail = variant === 'rail'
  return (
    <button
      type="button"
      className={isRail ? 'rail-item' : 'icon-button'}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
      {isRail && <span className="rail-item-label">Theme</span>}
    </button>
  )
}
