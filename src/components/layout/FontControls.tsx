import { useState } from 'react'
import type { FontFamily } from '../../types'
import { useSettings } from '../../context/useSettings'
import { FONT_SCALE_STEPS } from '../../context/settingsContext'
import { Icon } from '../ui/Icon'

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'mono', label: 'Mono' },
]

export function FontControls() {
  const {
    settings,
    setFontFamily,
    incrementFontScale,
    decrementFontScale,
  } = useSettings()
  const [open, setOpen] = useState(false)

  return (
    <div className="font-controls">
      <button
        type="button"
        className="icon-button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        title="Reading options"
        aria-label="Reading options"
      >
        <Icon name="type" />
      </button>

      {open && (
        <>
          <div
            className="popover-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="font-controls-panel" role="dialog" aria-label="Reading options">
            <div className="font-controls-section">
              <span className="font-controls-label">Typeface</span>
              <div className="segmented">
                {FONT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={
                      'segmented-item' +
                      (settings.fontFamily === opt.value ? ' is-active' : '')
                    }
                    onClick={() => setFontFamily(opt.value)}
                    aria-pressed={settings.fontFamily === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-controls-section">
              <span className="font-controls-label">Text size</span>
              <div className="stepper">
                <button
                  type="button"
                  className="icon-button"
                  onClick={decrementFontScale}
                  disabled={settings.fontScale <= 0}
                  aria-label="Decrease text size"
                >
                  A−
                </button>
                <span className="stepper-value" aria-live="polite">
                  {settings.fontScale + 1}/{FONT_SCALE_STEPS}
                </span>
                <button
                  type="button"
                  className="icon-button"
                  onClick={incrementFontScale}
                  disabled={settings.fontScale >= FONT_SCALE_STEPS - 1}
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
