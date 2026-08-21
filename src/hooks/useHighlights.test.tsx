import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { ReactNode } from 'react'
import type { AuthGateContextValue } from '../context/authGateContext'

// useHighlights gates writes through useAuthGate — for these data-layer
// tests, stub a context that always allows the action, same as real
// behavior when accounts aren't configured.
const alwaysAllow: AuthGateContextValue = {
  requireAuth: (action) => {
    action()
    return true
  },
  promptSignIn: () => {},
}

// Like useNotes, useHighlights holds a module-level singleton cache, so we
// reset modules and re-import a matching React + hook for every test. The
// AuthGateContext it reads from must be re-imported fresh too — after
// resetModules, useHighlights' import of authGateContext.ts resolves to a
// new module instance (a new createContext() object), so a wrapper built
// from the stale top-level import wouldn't match it.
async function freshHighlights() {
  vi.resetModules()
  localStorage.clear()
  const { renderHook, act } = await import('@testing-library/react')
  const { AuthGateContext } = await import('../context/authGateContext')
  const mod = await import('./useHighlights')
  function wrapper({ children }: { children: ReactNode }) {
    return <AuthGateContext value={alwaysAllow}>{children}</AuthGateContext>
  }
  return { renderHook, act, useHighlights: mod.useHighlights, wrapper }
}

beforeEach(() => {
  localStorage.clear()
})

describe('useHighlights: set / toggle / clear (F5)', () => {
  it('sets a color and reads it via colorFor', async () => {
    const { renderHook, act, useHighlights, wrapper } = await freshHighlights()
    const { result } = renderHook(() => useHighlights(), { wrapper })
    act(() => {
      result.current.setHighlight('john.3.16', 'yellow')
    })
    expect(result.current.colorFor('john.3.16')).toBe('yellow')
  })

  it('toggles off when the same color is applied twice', async () => {
    const { renderHook, act, useHighlights, wrapper } = await freshHighlights()
    const { result } = renderHook(() => useHighlights(), { wrapper })
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
    const { renderHook, act, useHighlights, wrapper } = await freshHighlights()
    const { result } = renderHook(() => useHighlights(), { wrapper })
    act(() => {
      result.current.toggleHighlight('john.3.16', 'green')
    })
    act(() => {
      result.current.toggleHighlight('john.3.16', 'blue')
    })
    expect(result.current.colorFor('john.3.16')).toBe('blue')
  })

  it('removes a highlight', async () => {
    const { renderHook, act, useHighlights, wrapper } = await freshHighlights()
    const { result } = renderHook(() => useHighlights(), { wrapper })
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
    const { renderHook, act, useHighlights, wrapper } = await freshHighlights()
    const { result } = renderHook(() => useHighlights(), { wrapper })
    act(() => {
      result.current.setHighlight('gen.1.1', 'orange')
    })
    const raw = localStorage.getItem('bsa.highlights')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)['gen.1.1'].color).toBe('orange')
  })

  it('restores persisted highlights on a fresh mount', async () => {
    // freshHighlights() clears storage as part of resetting modules, so
    // seed it after — the hook only reads localStorage lazily, on first
    // getMap() call inside renderHook below.
    const { renderHook, useHighlights, wrapper } = await freshHighlights()
    localStorage.setItem(
      'bsa.highlights',
      JSON.stringify({
        'john.1.1': { verseKey: 'john.1.1', color: 'blue', updatedAt: 1 },
      }),
    )
    const { result } = renderHook(() => useHighlights(), { wrapper })
    expect(result.current.colorFor('john.1.1')).toBe('blue')
  })
})
