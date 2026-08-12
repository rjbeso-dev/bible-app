import { useSettings } from '../../context/useSettings'
import { Icon } from '../ui/Icon'

export function ThemeToggle() {
  const { settings, toggleTheme } = useSettings()
  const isDark = settings.theme === 'dark'
  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  )
}
