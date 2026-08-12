import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { FontFamily, Settings, ThemeMode } from '../types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'
import {
  DEFAULT_SETTINGS,
  FONT_SCALE_REM,
  FONT_SCALE_STEPS,
  SettingsContext,
  type SettingsContextValue,
} from './settingsContext'

type Action =
  | { type: 'setTheme'; theme: ThemeMode }
  | { type: 'toggleTheme' }
  | { type: 'setPrimaryTranslation'; id: string }
  | { type: 'setSecondaryTranslation'; id: string }
  | { type: 'setParallelEnabled'; enabled: boolean }
  | { type: 'toggleParallel' }
  | { type: 'setFontFamily'; family: FontFamily }
  | { type: 'setFontScale'; scale: number }
  | { type: 'incrementFontScale' }
  | { type: 'decrementFontScale' }

function clampScale(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_SETTINGS.fontScale
  return Math.min(FONT_SCALE_STEPS - 1, Math.max(0, Math.round(n)))
}

function reducer(state: Settings, action: Action): Settings {
  switch (action.type) {
    case 'setTheme':
      return { ...state, theme: action.theme }
    case 'toggleTheme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'setPrimaryTranslation':
      return { ...state, primaryTranslation: action.id }
    case 'setSecondaryTranslation':
      return { ...state, secondaryTranslation: action.id }
    case 'setParallelEnabled':
      return { ...state, parallelEnabled: action.enabled }
    case 'toggleParallel':
      return { ...state, parallelEnabled: !state.parallelEnabled }
    case 'setFontFamily':
      return { ...state, fontFamily: action.family }
    case 'setFontScale':
      return { ...state, fontScale: clampScale(action.scale) }
    case 'incrementFontScale':
      return { ...state, fontScale: clampScale(state.fontScale + 1) }
    case 'decrementFontScale':
      return { ...state, fontScale: clampScale(state.fontScale - 1) }
    default:
      return state
  }
}

function preferredTheme(): ThemeMode {
  try {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }
  } catch {
    // ignore
  }
  return 'light'
}

function initSettings(): Settings {
  const stored = readJSON<Partial<Settings> | null>(STORAGE_KEYS.settings, null)
  if (!stored || typeof stored !== 'object') {
    return { ...DEFAULT_SETTINGS, theme: preferredTheme() }
  }
  // Merge defensively so missing/invalid fields fall back to defaults.
  return {
    theme: stored.theme === 'dark' || stored.theme === 'light' ? stored.theme : preferredTheme(),
    primaryTranslation:
      typeof stored.primaryTranslation === 'string'
        ? stored.primaryTranslation
        : DEFAULT_SETTINGS.primaryTranslation,
    secondaryTranslation:
      typeof stored.secondaryTranslation === 'string'
        ? stored.secondaryTranslation
        : DEFAULT_SETTINGS.secondaryTranslation,
    parallelEnabled:
      typeof stored.parallelEnabled === 'boolean'
        ? stored.parallelEnabled
        : DEFAULT_SETTINGS.parallelEnabled,
    fontFamily: migrateFontFamily(stored.fontFamily),
    fontScale: clampScale(
      typeof stored.fontScale === 'number' ? stored.fontScale : DEFAULT_SETTINGS.fontScale,
    ),
  }
}

function isFontFamily(v: unknown): v is FontFamily {
  return v === 'serif' || v === 'sans' || v === 'comfort' || v === 'mono'
}

/** Coerce a stored font family, migrating the retired 'dyslexic' → 'comfort'. */
function migrateFontFamily(v: unknown): FontFamily {
  if (v === 'dyslexic') return 'comfort'
  return isFontFamily(v) ? v : DEFAULT_SETTINGS.fontFamily
}

/** Apply settings to the document root so CSS can respond. */
function applyToDocument(settings: Settings): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = settings.theme
  root.dataset.font = settings.fontFamily
  const rem = FONT_SCALE_REM[settings.fontScale] ?? FONT_SCALE_REM[DEFAULT_SETTINGS.fontScale]
  root.style.setProperty('--reader-font-scale', `${rem}rem`)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(reducer, undefined, initSettings)

  // Persist and reflect to the DOM whenever settings change.
  useEffect(() => {
    writeJSON(STORAGE_KEYS.settings, settings)
    applyToDocument(settings)
  }, [settings])

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setTheme: (theme) => dispatch({ type: 'setTheme', theme }),
      toggleTheme: () => dispatch({ type: 'toggleTheme' }),
      setPrimaryTranslation: (id) => dispatch({ type: 'setPrimaryTranslation', id }),
      setSecondaryTranslation: (id) => dispatch({ type: 'setSecondaryTranslation', id }),
      setParallelEnabled: (enabled) => dispatch({ type: 'setParallelEnabled', enabled }),
      toggleParallel: () => dispatch({ type: 'toggleParallel' }),
      setFontFamily: (family) => dispatch({ type: 'setFontFamily', family }),
      setFontScale: (scale) => dispatch({ type: 'setFontScale', scale }),
      incrementFontScale: () => dispatch({ type: 'incrementFontScale' }),
      decrementFontScale: () => dispatch({ type: 'decrementFontScale' }),
    }),
    [settings],
  )

  return <SettingsContext value={value}>{children}</SettingsContext>
}
