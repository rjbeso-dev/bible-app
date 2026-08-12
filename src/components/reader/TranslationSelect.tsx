import { useId, useMemo } from 'react'
import { bibleSource } from '../../api'
import type { Translation, TranslationGroup } from '../../api'

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

export function TranslationSelect({
  value,
  onChange,
  label = 'Translation',
  compact,
}: TranslationSelectProps) {
  const id = useId()
  const translations = bibleSource.listTranslations()

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

  return (
    <div className={'translation-select' + (compact ? ' is-compact' : '')}>
      <label htmlFor={id} className="translation-select-label">
        {label}
      </label>
      <select
        id={id}
        className="translation-select-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {grouped.map((section) => (
          <optgroup key={section.group} label={section.label}>
            {section.items.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
