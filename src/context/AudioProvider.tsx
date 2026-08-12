import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AudioMode, AudioScene, AudioSettings } from '../types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'
import {
  startAmbientScene,
  stopAmbient,
  setAmbientVolume,
  setCustomAudioUrl,
  setCustomAudioFile,
  playCustomAudio,
  pauseCustomAudio,
  setCustomAudioVolume,
  setCustomAudioErrorHandler,
} from '../lib/audioEngine'
import {
  AudioPlayerContext,
  DEFAULT_AUDIO_SETTINGS,
  type AudioContextValue,
} from './audioContext'

const VALID_SCENES: AudioScene[] = ['rain', 'pad', 'brown', 'chimes']

/** Load persisted audio settings defensively. Never restores a playing state. */
function loadSettings(): Required<Pick<AudioSettings, 'mode' | 'scene' | 'volume'>> & {
  customUrl: string
  customName: string
} {
  const raw = readJSON<Partial<AudioSettings> | null>(STORAGE_KEYS.audio, null)
  const d = DEFAULT_AUDIO_SETTINGS
  if (!raw || typeof raw !== 'object') {
    return { mode: d.mode, scene: d.scene, volume: d.volume, customUrl: '', customName: '' }
  }
  return {
    mode: raw.mode === 'custom' ? 'custom' : 'ambient',
    scene: VALID_SCENES.includes(raw.scene as AudioScene) ? (raw.scene as AudioScene) : d.scene,
    volume:
      typeof raw.volume === 'number' && raw.volume >= 0 && raw.volume <= 1
        ? raw.volume
        : d.volume,
    customUrl: typeof raw.customUrl === 'string' ? raw.customUrl : '',
    customName: typeof raw.customName === 'string' ? raw.customName : '',
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadSettings()).current
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setModeState] = useState<AudioMode>(initial.mode)
  const [scene, setSceneState] = useState<AudioScene>(initial.scene)
  const [volume, setVolumeState] = useState(initial.volume)
  const [customUrl, setCustomUrlState] = useState(initial.customUrl)
  const [customName, setCustomName] = useState(initial.customName)
  const [error, setError] = useState<string | null>(null)
  // A local file was loaded this session (its object URL isn't persistable).
  const hasFileSource = useRef(false)

  // Persist settings (never the playing state) whenever they change.
  useEffect(() => {
    const payload: AudioSettings = { mode, scene, volume }
    if (customUrl) payload.customUrl = customUrl
    if (customName) payload.customName = customName
    writeJSON(STORAGE_KEYS.audio, payload)
  }, [mode, scene, volume, customUrl, customName])

  // Surface errors from the underlying <audio> element.
  useEffect(() => {
    setCustomAudioErrorHandler((message) => {
      setError(message)
      setIsPlaying(false)
    })
    return () => setCustomAudioErrorHandler(null)
  }, [])

  const startCustom = useCallback(() => {
    if (customUrl) {
      setCustomAudioUrl(customUrl)
    } else if (!hasFileSource.current) {
      setError('Add a stream URL or choose a file first.')
      setIsPlaying(false)
      return
    }
    setCustomAudioVolume(volume)
    playCustomAudio()
      .then(() => {
        setError(null)
        setIsPlaying(true)
      })
      .catch(() => {
        setError("Couldn't play that audio source.")
        setIsPlaying(false)
      })
  }, [customUrl, volume])

  const play = useCallback(() => {
    setError(null)
    if (mode === 'ambient') {
      startAmbientScene(scene, volume)
      setIsPlaying(true)
    } else {
      startCustom()
    }
  }, [mode, scene, volume, startCustom])

  const pause = useCallback(() => {
    stopAmbient()
    pauseCustomAudio()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  const setScene = useCallback(
    (id: AudioScene) => {
      setSceneState(id)
      if (isPlaying && mode === 'ambient') startAmbientScene(id, volume)
    },
    [isPlaying, mode, volume],
  )

  const setMode = useCallback(
    (next: AudioMode) => {
      if (next === mode) return
      const wasPlaying = isPlaying
      if (wasPlaying) {
        stopAmbient()
        pauseCustomAudio()
      }
      setModeState(next)
      setError(null)
      if (wasPlaying) {
        if (next === 'ambient') {
          startAmbientScene(scene, volume)
          setIsPlaying(true)
        } else {
          startCustom()
        }
      }
    },
    [mode, isPlaying, scene, volume, startCustom],
  )

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    setAmbientVolume(v)
    setCustomAudioVolume(v)
  }, [])

  const restartCustomIfPlaying = useCallback(() => {
    if (!isPlaying || mode !== 'custom') return
    setCustomAudioVolume(volume)
    playCustomAudio()
      .then(() => {
        setError(null)
        setIsPlaying(true)
      })
      .catch(() => {
        setError("Couldn't play that audio source.")
        setIsPlaying(false)
      })
  }, [isPlaying, mode, volume])

  const setCustomUrl = useCallback(
    (url: string, name?: string) => {
      hasFileSource.current = false
      setCustomUrlState(url)
      setCustomName(name ?? url)
      setError(null)
      if (url) setCustomAudioUrl(url)
      restartCustomIfPlaying()
    },
    [restartCustomIfPlaying],
  )

  const loadFile = useCallback(
    (file: File) => {
      const url = setCustomAudioFile(file)
      if (!url) {
        setError('Audio playback is not supported in this browser.')
        return
      }
      hasFileSource.current = true
      setCustomUrlState('') // object URLs don't survive a reload, so don't persist one
      setCustomName(file.name)
      setError(null)
      restartCustomIfPlaying()
    },
    [restartCustomIfPlaying],
  )

  const value = useMemo<AudioContextValue>(
    () => ({
      isPlaying,
      mode,
      scene,
      volume,
      customUrl,
      customName,
      error,
      play,
      pause,
      toggle,
      setScene,
      setMode,
      setVolume,
      setCustomUrl,
      loadFile,
    }),
    [
      isPlaying,
      mode,
      scene,
      volume,
      customUrl,
      customName,
      error,
      play,
      pause,
      toggle,
      setScene,
      setMode,
      setVolume,
      setCustomUrl,
      loadFile,
    ],
  )

  return <AudioPlayerContext value={value}>{children}</AudioPlayerContext>
}
