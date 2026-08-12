import { useContext } from 'react'
import { AudioPlayerContext, type AudioContextValue } from './audioContext'

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return ctx
}
