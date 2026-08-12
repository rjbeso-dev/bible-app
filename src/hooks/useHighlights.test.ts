import { describe, it, expect, beforeEach, vi } from 'vitest'

// Like useNotes, useHighlights holds a module-level singleton cache, so we
// reset modules and re-import a matching React + hook for every test.
async function freshHighlights() {
  vi.resetModules()
  localStorage.clear()
  const { renderHook, act } = await import('@testing-library/react')
  const mod = await import('./useHighlights')
  return { renderHook, act, useHighlights: mod.useHighlights }
}

beforeEach(() => {
  localStorage.clear()
})

describe('useHighlights: set / toggle / clear (F5)', () => {
  it('sets a color and reads it via colorFor', async () => {
    const { renderHook, act, useHighlights } = await freshHighlights()
    const { result } = renderHook(() => useHighlights())
    act(() => {
      result.current.setHighlight('john.3.16', 'yellow')
    })
    expect(result.current.colorFor('john.3.16')).toBe('yellow')
  })

  it('toggles off when the same color is applied twice', async () => {
    const { renderHook, act, useHighlights } = await freshHighlights()
    const { result } = renderHook(() => useHighlights())
    act(() => {
      result.current.toggleHighlight('john.3.16', 'green')
    })
    expect(result.current.colorFor('john.3.16')).toBe('green')
    act(() => {
      result.current.toggleHighlight('john.3.16', 'green')
    })
    expect(result.current.colorFor('john.3.16')).toBeNull()
  })

  it('toggling a different color replaces rather than clears', async () => {
    const { renderHook, act, useHighlights } = await freshHighlights()
    const { result } = renderHook(() => useHighlights())
    act(() => {
      result.current.toggleHighlight('john.3.16', 'green')
    })
    act(() => {
      result.current.toggleHighlight('john.3.16', 'blue')
    })
    expect(result.current.colorFor('john.3.16')).toBe('blue')
  })

  it('removes a highlight', async () => {
    const { renderHook, act, useHighlights } = await freshHighlights()
    const { result } = renderHook(() => useHighlights())
    act(() => {
      result.current.setHighlight('john.3.16', 'pink')
    })
    act(() => {
      result.current.removeHighlight('john.3.16')
    })
    expect(result.current.colorFor('john.3.16')).toBeNull()
  })
})

describe('useHighlights: persistence (F5)', () => {
  it('persists to bsa.highlights', async () => {
    const { renderHook, act, useHighlights } = await freshHighlights()
    const { result } = renderHook(() => useHighlights())
    act(() => {
      result.current.setHighlight('gen.1.1', 'orange')
    })
    const raw = localStorage.getItem('bsa.highlights')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)['gen.1.1'].color).toBe('orange')
  })

  it('restores persisted highlights on a fresh mount', async () => {
    vi.resetModules()
    localStorage.clear()
    localStorage.setItem(
      'bsa.highlights',
      JSON.stringify({
        'john.1.1': { verseKey: 'john.1.1', color: 'blue', updatedAt: 1 },
      }),
    )
    const { renderHook } = await import('@testing-library/react')
    const { useHighlights } = await import('./useHighlights')
    const { result } = renderHook(() => useHighlights())
    expect(result.current.colorFor('john.1.1')).toBe('blue')
  })
})
