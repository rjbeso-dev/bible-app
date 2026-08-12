import type { HighlightColor } from '../../types'
import { Icon } from '../ui/Icon'

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  'yellow',
  'green',
  'blue',
  'pink',
  'orange',
]

interface HighlightMenuProps {
  current: HighlightColor | null
  onPick: (color: HighlightColor) => void
  onClear: () => void
}

export function HighlightMenu({ current, onPick, onClear }: HighlightMenuProps) {
  return (
    <div className="highlight-menu" role="group" aria-label="Highlight colors">
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={'swatch swatch-' + color + (current === color ? ' is-active' : '')}
          onClick={() => onPick(color)}
          aria-pressed={current === color}
          aria-label={`Highlight ${color}`}
          title={`Highlight ${color}`}
        />
      ))}
      <button
        type="button"
        className="swatch swatch-clear"
        onClick={onClear}
        disabled={!current}
        aria-label="Clear highlight"
        title="Clear highlight"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}
