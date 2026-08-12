import type { HighlightColor, Verse } from '../../types'
import { HighlightMenu } from '../study/HighlightMenu'

interface VerseRowProps {
  verse: Verse
  highlightColor: HighlightColor | null
  hasNote: boolean
  selected: boolean
  /** When true, render an illuminated drop cap on the first letter. */
  dropCap?: boolean
  /** When false, selecting a verse doesn't show the inline action bar (the
      study panel handles highlight/note/context instead). Defaults to true. */
  inlineActions?: boolean
  onSelect: () => void
  onSetHighlight: (color: HighlightColor) => void
  onClearHighlight: () => void
  onOpenNote: () => void
  onOpenContext: () => void
}

/** Split leading text into a drop-cap letter and the remainder. */
function withDropCap(text: string): [string, string] {
  const match = /^(\s*["'“‘(]?\s*)(\S)([\s\S]*)$/.exec(text)
  if (!match) return ['', text]
  return [match[1] + match[2], match[3]]
}

export function VerseRow({
  verse,
  highlightColor,
  hasNote,
  selected,
  dropCap,
  inlineActions = true,
  onSelect,
  onSetHighlight,
  onClearHighlight,
  onOpenNote,
  onOpenContext,
}: VerseRowProps) {
  const [lead, rest] = dropCap ? withDropCap(verse.text) : ['', verse.text]
  return (
    <div
      id={`v-${verse.verse}`}
      className={'verse-row' + (selected ? ' is-selected' : '')}
      data-highlight={highlightColor ?? undefined}
    >
      <button
        type="button"
        className="verse-body"
        onClick={onSelect}
        aria-expanded={selected}
        aria-label={`Verse ${verse.verse}`}
      >
        <sup className="verse-num">{verse.verse}</sup>
        <span className="verse-text">
          {dropCap ? (
            <>
              <span className="dropcap">{lead}</span>
              {rest}
            </>
          ) : (
            verse.text
          )}
        </span>
        {hasNote && <span className="note-dot" aria-label="has note" title="Has a note" />}
      </button>

      {selected && inlineActions && (
        <div className="verse-actions" role="toolbar" aria-label={`Actions for verse ${verse.verse}`}>
          <HighlightMenu
            current={highlightColor}
            onPick={onSetHighlight}
            onClear={onClearHighlight}
          />
          <div className="verse-actions-buttons">
            <button type="button" className="button ghost small" onClick={onOpenNote}>
              {hasNote ? 'Edit note' : 'Add note'}
            </button>
            <button type="button" className="button ghost small" onClick={onOpenContext}>
              Context
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
