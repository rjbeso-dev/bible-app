import { useMemo } from 'react'
import type { Chapter, HighlightColor, Verse } from '../../types'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { useHighlights } from '../../hooks/useHighlights'
import { useNotes } from '../../hooks/useNotes'
import { verseKey as makeKey } from '../../lib/references'
import { bibleSource } from '../../api'
import { TranslationSelect } from './TranslationSelect'
import { ChapterAttribution } from './ChapterAttribution'
import { HighlightMenu } from '../study/HighlightMenu'

interface ParallelViewProps {
  book: string
  chapter: number
  primaryChapter: Chapter | null
  selectedVerse: number | null
  onSelectVerse: (verse: number | null) => void
  onOpenNote: (verse: number) => void
  onOpenContext: (verse: number) => void
}

function translationName(id: string): string {
  return bibleSource.listTranslations().find((t) => t.id === id)?.name ?? id
}

/** Two-column parallel reader, verse-aligned by verse number. */
export function ParallelView({
  book,
  chapter,
  primaryChapter,
  selectedVerse,
  onSelectVerse,
  onOpenNote,
  onOpenContext,
}: ParallelViewProps) {
  const { settings, setPrimaryTranslation, setSecondaryTranslation } = useSettings()
  const secondary = useChapter(book, chapter, settings.secondaryTranslation)
  const { colorFor, setHighlight, removeHighlight } = useHighlights()
  const { hasNote } = useNotes()

  const primaryMap = useMemo(() => indexByVerse(primaryChapter?.verses), [primaryChapter])
  const secondaryMap = useMemo(() => indexByVerse(secondary.chapter?.verses), [secondary.chapter])

  const verseNumbers = useMemo(() => {
    const set = new Set<number>()
    primaryMap.forEach((_v, n) => set.add(n))
    secondaryMap.forEach((_v, n) => set.add(n))
    return Array.from(set).sort((a, b) => a - b)
  }, [primaryMap, secondaryMap])

  return (
    <div className="parallel-view">
      <div className="parallel-header">
        <TranslationSelect
          value={settings.primaryTranslation}
          onChange={setPrimaryTranslation}
          label="Left"
          compact
        />
        <TranslationSelect
          value={settings.secondaryTranslation}
          onChange={setSecondaryTranslation}
          label="Right"
          compact
        />
      </div>

      {secondary.status === 'loading' && !secondary.chapter && (
        <p className="muted parallel-note">
          Loading {translationName(settings.secondaryTranslation)}…
        </p>
      )}
      {(secondary.status === 'error' || secondary.status === 'offline') && (
        <p className="banner-inline warning">
          Could not load {translationName(settings.secondaryTranslation)}.
        </p>
      )}

      <div className="parallel-rows">
        {verseNumbers.map((num) => {
          const key = makeKey(book, chapter, num)
          const primaryVerse = primaryMap.get(num)
          const secondaryVerse = secondaryMap.get(num)
          return (
            <ParallelRow
              key={num}
              num={num}
              primaryVerse={primaryVerse}
              secondaryVerse={secondaryVerse}
              highlightColor={colorFor(key)}
              hasNote={hasNote(key)}
              selected={selectedVerse === num}
              onSelect={() => onSelectVerse(selectedVerse === num ? null : num)}
              onSetHighlight={(color) => setHighlight(key, color)}
              onClearHighlight={() => removeHighlight(key)}
              onOpenNote={() => onOpenNote(num)}
              onOpenContext={() => onOpenContext(num)}
            />
          )
        })}
      </div>

      {secondary.chapter && (
        <ChapterAttribution translationId={secondary.chapter.translationId} />
      )}
    </div>
  )
}

function indexByVerse(verses: Verse[] | undefined): Map<number, Verse> {
  const map = new Map<number, Verse>()
  verses?.forEach((v) => map.set(v.verse, v))
  return map
}

interface ParallelRowProps {
  num: number
  primaryVerse: Verse | undefined
  secondaryVerse: Verse | undefined
  highlightColor: HighlightColor | null
  hasNote: boolean
  selected: boolean
  onSelect: () => void
  onSetHighlight: (color: HighlightColor) => void
  onClearHighlight: () => void
  onOpenNote: () => void
  onOpenContext: () => void
}

function ParallelRow({
  num,
  primaryVerse,
  secondaryVerse,
  highlightColor,
  hasNote,
  selected,
  onSelect,
  onSetHighlight,
  onClearHighlight,
  onOpenNote,
  onOpenContext,
}: ParallelRowProps) {
  return (
    <div
      id={`v-${num}`}
      className={'parallel-row' + (selected ? ' is-selected' : '')}
      data-highlight={highlightColor ?? undefined}
    >
      <div className="parallel-grid">
        <button
          type="button"
          className="verse-body"
          onClick={onSelect}
          aria-expanded={selected}
          aria-label={`Verse ${num}`}
        >
          <sup className="verse-num">{num}</sup>
          <span className="verse-text">
            {primaryVerse ? primaryVerse.text : <span className="muted">—</span>}
          </span>
          {hasNote && <span className="note-dot" aria-label="has note" title="Has a note" />}
        </button>
        <div className="verse-body secondary" aria-hidden={false}>
          <sup className="verse-num">{num}</sup>
          <span className="verse-text">
            {secondaryVerse ? secondaryVerse.text : <span className="muted">—</span>}
          </span>
        </div>
      </div>

      {selected && (
        <div className="verse-actions" role="toolbar" aria-label={`Actions for verse ${num}`}>
          <HighlightMenu current={highlightColor} onPick={onSetHighlight} onClear={onClearHighlight} />
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
