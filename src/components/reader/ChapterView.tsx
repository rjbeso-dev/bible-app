import type { Verse } from '../../types'
import { useHighlights } from '../../hooks/useHighlights'
import { useNotes } from '../../hooks/useNotes'
import { verseKey as makeKey } from '../../lib/references'
import { VerseRow } from './VerseRow'

interface ChapterViewProps {
  book: string
  chapter: number
  verses: Verse[]
  selectedVerse: number | null
  /** When false, suppress the inline verse action bar (the study panel owns it). */
  inlineActions?: boolean
  onSelectVerse: (verse: number | null) => void
  onOpenNote: (verse: number) => void
  onOpenContext: (verse: number) => void
}

/** Interactive single-column chapter reader. */
export function ChapterView({
  book,
  chapter,
  verses,
  selectedVerse,
  inlineActions = true,
  onSelectVerse,
  onOpenNote,
  onOpenContext,
}: ChapterViewProps) {
  const { colorFor, setHighlight, removeHighlight } = useHighlights()
  const { hasNote } = useNotes()

  return (
    <div className="chapter-view">
      {verses.map((v, i) => {
        const key = makeKey(book, chapter, v.verse)
        return (
          <VerseRow
            key={v.verse}
            verse={v}
            dropCap={i === 0}
            inlineActions={inlineActions}
            highlightColor={colorFor(key)}
            hasNote={hasNote(key)}
            selected={selectedVerse === v.verse}
            onSelect={() =>
              onSelectVerse(selectedVerse === v.verse ? null : v.verse)
            }
            onSetHighlight={(color) => setHighlight(key, color)}
            onClearHighlight={() => removeHighlight(key)}
            onOpenNote={() => onOpenNote(v.verse)}
            onOpenContext={() => onOpenContext(v.verse)}
          />
        )
      })}
    </div>
  )
}
