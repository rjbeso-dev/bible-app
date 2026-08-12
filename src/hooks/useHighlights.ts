import { useCallback, useEffect, useState } from 'react'
import type { Highlight, HighlightColor } from '../types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'

type HighlightMap = Record<string, Highlight>

function loadHighlights(): HighlightMap {
  const raw = readJSON<HighlightMap>(STORAGE_KEYS.highlights, {})
  if (!raw || typeof raw !== 'object') return {}
  const out: HighlightMap = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value && typeof value.color === 'string') {
      out[key] = {
        verseKey: value.verseKey ?? key,
        color: value.color as HighlightColor,
        updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : Date.now(),
      }
    }
  }
  return out
}

// Cross-hook broadcast (mirrors useNotes) so all instances stay in sync.
type Listener = (map: HighlightMap) => void
const listeners = new Set<Listener>()
let current: HighlightMap | null = null

function getMap(): HighlightMap {
  if (current === null) current = loadHighlights()
  return current
}

function setMap(next: HighlightMap): void {
  current = next
  writeJSON(STORAGE_KEYS.highlights, next)
  listeners.forEach((l) => l(next))
}

export interface UseHighlightsResult {
  highlights: HighlightMap
  colorFor: (verseKey: string) => HighlightColor | null
  setHighlight: (verseKey: string, color: HighlightColor) => void
  removeHighlight: (verseKey: string) => void
  toggleHighlight: (verseKey: string, color: HighlightColor) => void
}

export function useHighlights(): UseHighlightsResult {
  const [highlights, setState] = useState<HighlightMap>(getMap)

  useEffect(() => {
    const listener: Listener = (next) => setState(next)
    listeners.add(listener)
    setState(getMap())
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const setHighlight = useCallback((verseKey: string, color: HighlightColor) => {
    setMap({
      ...getMap(),
      [verseKey]: { verseKey, color, updatedAt: Date.now() },
    })
  }, [])

  const removeHighlight = useCallback((verseKey: string) => {
    const next = { ...getMap() }
    delete next[verseKey]
    setMap(next)
  }, [])

  const toggleHighlight = useCallback((verseKey: string, color: HighlightColor) => {
    const existing = getMap()[verseKey]
    if (existing && existing.color === color) {
      const next = { ...getMap() }
      delete next[verseKey]
      setMap(next)
    } else {
      setMap({ ...getMap(), [verseKey]: { verseKey, color, updatedAt: Date.now() } })
    }
  }, [])

  const colorFor = useCallback(
    (verseKey: string): HighlightColor | null => highlights[verseKey]?.color ?? null,
    [highlights],
  )

  return { highlights, colorFor, setHighlight, removeHighlight, toggleHighlight }
}
