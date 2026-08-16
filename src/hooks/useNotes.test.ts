import { describe, it, expect, beforeEach, vi } from 'vitest'

// useNotes keeps a module-level singleton cache (`current`) that is NOT reset
// between tests by localStorage.clear() alone. We therefore reset the module
// registry and re-import the hook (together with a matching React/testing-lib)
// for every test to guarantee clean state.
async function freshNotes() {
  vi.resetModules()
  localStorage.clear()
  const { renderHook, act } = await import('@testing-library/react')
  const mod = await import('./useNotes')
  return { renderHook, act, useNotes: mod.useNotes }
}

beforeEach(() => {
  localStorage.clear()
})

describe('useNotes: CRUD round-trip', () => {
  it('adds a note and exposes it via notesFor / hasNote', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.addNote('john.3.16', 'John 3:16', 'For God so loved')
    })

    expect(result.current.notes).toHaveLength(1)
    expect(result.current.hasNote('john.3.16')).toBe(true)
    expect(result.current.notesFor('john.3.16')[0].body).toBe('For God so loved')
  })

  it('ignores an empty/whitespace note body', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    let created: unknown
    act(() => {
      created = result.current.addNote('john.3.16', 'John 3:16', '   ')
    })
    expect(created).toBeNull()
    expect(result.current.notes).toHaveLength(0)
  })

  it('edits a note body', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    let id = ''
    act(() => {
      id = result.current.addNote('john.3.16', 'John 3:16', 'first')!.id
    })
    act(() => {
      result.current.updateNote(id, 'edited')
    })
    expect(result.current.notesFor('john.3.16')[0].body).toBe('edited')
  })

  it('deletes a note', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    let id = ''
    act(() => {
      id = result.current.addNote('john.3.16', 'John 3:16', 'temp')!.id
    })
    act(() => {
      result.current.deleteNote(id)
    })
    expect(result.current.notes).toHaveLength(0)
    expect(result.current.hasNote('john.3.16')).toBe(false)
  })
})

describe('useNotes: persistence & sync', () => {
  it('persists notes to localStorage under bsa.notes', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    act(() => {
      result.current.addNote('gen.1.1', 'Genesis 1:1', 'In the beginning')
    })
    const raw = localStorage.getItem('bsa.notes')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)[0].body).toBe('In the beginning')
  })

  it('restores persisted notes on a fresh mount (deep-link support, F4)', async () => {
    // Seed storage, then load the hook fresh so it reads from disk.
    vi.resetModules()
    localStorage.clear()
    localStorage.setItem(
      'bsa.notes',
      JSON.stringify([
        {
          id: 'n1',
          verseKey: 'john.3.16',
          reference: 'John 3:16',
          body: 'seeded',
          createdAt: 1,
          updatedAt: 1,
        },
      ]),
    )
    const { renderHook } = await import('@testing-library/react')
    const { useNotes } = await import('./useNotes')
    const { result } = renderHook(() => useNotes())
    expect(result.current.notesFor('john.3.16')[0].body).toBe('seeded')
  })

  it('keeps two mounted instances in sync via broadcast', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const a = renderHook(() => useNotes())
    const b = renderHook(() => useNotes())
    act(() => {
      a.result.current.addNote('acts.2.38', 'Acts 2:38', 'Repent')
    })
    expect(b.result.current.hasNote('acts.2.38')).toBe(true)
  })
})

describe('useNotes: standalone notes (no verse tie)', () => {
  it('adds a standalone note with no verseKey', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    act(() => {
      result.current.addStandaloneNote({ title: 'Sunday sermon', body: 'Outline…' })
    })
    expect(result.current.notes).toHaveLength(1)
    expect(result.current.notes[0].verseKey).toBeUndefined()
    expect(result.current.notes[0].title).toBe('Sunday sermon')
  })

  it('ignores an empty/whitespace body', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    let created: unknown
    act(() => {
      created = result.current.addStandaloneNote({ title: 'x', body: '   ' })
    })
    expect(created).toBeNull()
    expect(result.current.notes).toHaveLength(0)
  })

  it('updates title/reference/body independently via updateNoteFields', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    let id = ''
    act(() => {
      id = result.current.addStandaloneNote({ title: 'first', body: 'draft' })!.id
    })
    act(() => {
      result.current.updateNoteFields(id, { title: 'revised' })
    })
    const note = result.current.notes.find((n) => n.id === id)!
    expect(note.title).toBe('revised')
    expect(note.body).toBe('draft')
  })

  it('does not surface a standalone note under a verse key', async () => {
    const { renderHook, act, useNotes } = await freshNotes()
    const { result } = renderHook(() => useNotes())
    act(() => {
      result.current.addStandaloneNote({ body: 'general note' })
    })
    expect(result.current.hasNote('john.3.16')).toBe(false)
  })
})
