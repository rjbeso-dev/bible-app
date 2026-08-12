import { createContext } from 'react'
import type { FontFamily, Settings, ThemeMode } from '../types'

export interface SettingsContextValue {
  settings: Settings
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setPrimaryTranslation: (id: string) => void
  setSecondaryTranslation: (id: string) => void
  setParallelEnabled: (enabled: boolean) => void
  toggleParallel: () => void
  setFontFamily: (family: FontFamily) => void
  setFontScale: (scale: number) => void
  incrementFontScale: () => void
  decrementFontScale: () => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

/** Number of steps in the reader font-size scale (indices 0..6). */
export const FONT_SCALE_STEPS = 7

/** Reader font size in rem for each fontScale index. */
export const FONT_SCALE_REM = [0.95, 1.0625, 1.1875, 1.3125, 1.4375, 1.5625, 1.75]

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  primaryTranslation: 'web',
  secondaryTranslation: 'kjv',
  parallelEnabled: false,
  fontFamily: 'serif',
  fontScale: 2,
}
