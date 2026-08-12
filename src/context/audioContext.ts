import { createContext } from 'react'
import type { AudioMode, AudioScene, AudioSettings } from '../types'

export interface AudioContextValue {
  isPlaying: boolean
  mode: AudioMode
  scene: AudioScene
  volume: number
  /** Current stream URL, or '' when none / a local file is loaded. */
  customUrl: string
  /** Display name for the custom source (URL or file name). */
  customName: string
  error: string | null
  play: () => void
  pause: () => void
  toggle: () => void
  setScene: (id: AudioScene) => void
  setMode: (mode: AudioMode) => void
  setVolume: (volume: number) => void
  setCustomUrl: (url: string, name?: string) => void
  loadFile: (file: File) => void
}

export const AudioPlayerContext = createContext<AudioContextValue | null>(null)

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  mode: 'ambient',
  scene: 'rain',
  volume: 0.5,
}
