import { describe, it, expect, beforeEach, vi } from 'vitest'

// useReadingProgress keeps a module-level singleton cache (mirroring useNotes)
// that localStorage.clear() alone does not reset. Reset the module registry and
// re-import for each test to guarantee clean state.
async function fresh() {
  vi.resetModules()
  localStorage.clear()
  const { renderHook, act } = await import('@testing-library/react')
  const mod = await import('./useReadingProgress')
  return { renderHook, act, ...mod }
}

beforeEach(() => {
  localStorage.clear()
})

describe('useReadingProgress', () => {
  it('records distinct read chapters and counts them once', async () => {
    const { renderHook, act, useReadingProgress } = await fresh()
    const { result } = renderHook(() => useReadingProgress())
    act(() => result.current.recordRead('john', 1, 'web'))
    act(() => result.current.recordRead('john', 1, 'web')) // duplicate
    act(() => result.current.recordRead('mark', 2, 'kjv'))
    expect(result.current.chaptersReadCount).toBe(2)
    expect(result.current.hasRead('john', 1)).toBe(true)
    expect(result.current.hasRead('luke', 4)).toBe(false)
  })

  it('keeps recents most-recent-first and de-duplicated', async () => {
    const { renderHook, act, useReadingProgress } = await fresh()
    const { result } = renderHook(() => useReadingProgress())
    act(() => result.current.recordRead('john', 1, 'web'))
    act(() => result.current.recordRead('mark', 2, 'kjv'))
    act(() => result.current.recordRead('john', 1, 'web')) // revisit
    const recent = result.current.recentChapters
    expect(recent[0]).toMatchObject({ book: 'john', chapter: 1 })
    expect(recent.filter((r) => r.book === 'john' && r.chapter === 1)).toHaveLength(1)
  })

  it('caps the recent list', async () => {
    const { renderHook, act, useReadingProgress, RECENT_CAP } = await fresh()
    const { result } = renderHook(() => useReadingProgress())
    act(() => {
      for (let i = 1; i <= RECENT_CAP + 5; i++) {
        result.current.recordRead('genesis', i, 'web')
      }
    })
    expect(result.current.recentChapters.length).toBeLessThanOrEqual(RECENT_CAP)
  })

  it('persists to localStorage', async () => {
    const { renderHook, act, useReadingProgress } = await fresh()
    const { STORAGE_KEYS } = await import('../lib/storage')
    const { result } = renderHook(() => useReadingProgress())
    act(() => result.current.recordRead('john', 3, 'web'))
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.readChapters)!)
    expect(stored).toContain('john.3')
  })
})
