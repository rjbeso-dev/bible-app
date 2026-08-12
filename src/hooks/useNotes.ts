import { useCallback, useEffect, useState } from 'react'
import type { Note } from '../types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'

function loadNotes(): Note[] {
  const raw = readJSON<Note[]>(STORAGE_KEYS.notes, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (n): n is Note =>
      !!n && typeof n.id === 'string' && typeof n.verseKey === 'string',
  )
}

function persist(notes: Note[]): void {
  writeJSON(STORAGE_KEYS.notes, notes)
}

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// Simple cross-hook broadcast so all mounted useNotes instances stay in sync.
type Listener = (notes: Note[]) => void
const listeners = new Set<Listener>()
let current: Note[] | null = null

function getNotes(): Note[] {
  if (current === null) current = loadNotes()
  return current
}

function setNotes(next: Note[]): void {
  current = next
  persist(next)
  listeners.forEach((l) => l(next))
}

export interface UseNotesResult {
  notes: Note[]
  notesFor: (verseKey: string) => Note[]
  addNote: (verseKey: string, reference: string, body: string) => Note | null
  updateNote: (id: string, body: string) => void
  deleteNote: (id: string) => void
  hasNote: (verseKey: string) => boolean
}

export function useNotes(): UseNotesResult {
  const [notes, setState] = useState<Note[]>(getNotes)

  useEffect(() => {
    const listener: Listener = (next) => setState(next)
    listeners.add(listener)
    // Re-sync in case notes changed before this subscribed.
    setState(getNotes())
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const addNote = useCallback(
    (verseKey: string, reference: string, body: string): Note | null => {
      const trimmed = body.trim()
      if (!trimmed) return null
      const now = Date.now()
      const note: Note = {
        id: newId(),
        verseKey,
        reference,
        body: trimmed,
        createdAt: now,
        updatedAt: now,
      }
      setNotes([...getNotes(), note])
      return note
    },
    [],
  )

  const updateNote = useCallback((id: string, body: string) => {
    const next = getNotes().map((n) =>
      n.id === id ? { ...n, body: body.trim(), updatedAt: Date.now() } : n,
    )
    setNotes(next)
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes(getNotes().filter((n) => n.id !== id))
  }, [])

  const notesFor = useCallback(
    (verseKey: string) => notes.filter((n) => n.verseKey === verseKey),
    [notes],
  )

  const hasNote = useCallback(
    (verseKey: string) => notes.some((n) => n.verseKey === verseKey),
    [notes],
  )

  return { notes, notesFor, addNote, updateNote, deleteNote, hasNote }
}
