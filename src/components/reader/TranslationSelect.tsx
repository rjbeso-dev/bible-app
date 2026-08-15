import { useEffect, useMemo, useState } from 'react'
import { bibleSource } from '../../api'
import type { Translation, TranslationGroup } from '../../api'
import { Icon } from '../ui/Icon'

interface TranslationSelectProps {
  value: string
  onChange: (id: string) => void
  label?: string
  compact?: boolean
}

const GROUP_ORDER: TranslationGroup[] = ['easy', 'modern', 'classic', 'licensed']

const GROUP_LABELS: Record<TranslationGroup, string> = {
  easy: 'Easy to read',
  modern: 'Modern English',
  classic: 'Classic',
  licensed: 'Study translations',
}

/** Custom-styled translation picker — a native <select>'s open dropdown can't
 * be themed (it renders as an unstyled OS popup), so this is a button +
 * listbox instead, following the same pattern as BookChapterPicker. */
export function TranslationSelect({
  value,
  onChange,
  label = 'Translation',
  compact,
}: TranslationSelectProps) {
  const [open, setOpen] = useState(false)
  const translations = bibleSource.listTranslations()
  const current = translations.find((t) => t.id === value)

  const grouped = useMemo(() => {
    const byGroup = new Map<TranslationGroup, Translation[]>()
    for (const t of translations) {
      const list = byGroup.get(t.group) ?? []
      list.push(t)
      byGroup.set(t.group, list)
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
      group: g,
      label: GROUP_LABELS[g],
      items: byGroup.get(g)!,
    }))
  }, [translations])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const pick = (id: string) => {
    setOpen(false)
    onChange(id)
  }

  return (
    <div className={'translation-picker' + (compact ? ' is-compact' : '')}>
      {!compact && <span className="translation-select-label">{label}</span>}
      <button
        type="button"
        className="translation-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={compact ? label : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="translation-picker-trigger-label">{current?.name ?? value}</span>
        <Icon name="chevron-down" size={14} className="translation-picker-caret" />
      </button>

      {open && (
        <>
          <div className="popover-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="translation-picker-panel" role="listbox" aria-label={label}>
            {grouped.map((section) => (
              <div
                key={section.group}
                className="translation-picker-group"
                role="group"
                aria-label={section.label}
              >
                <div className="translation-picker-group-title" aria-hidden="true">
                  {section.label}
                </div>
                {section.items.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="option"
                    aria-selected={t.id === value}
                    className={'translation-picker-item' + (t.id === value ? ' is-current' : '')}
                    onClick={() => pick(t.id)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
