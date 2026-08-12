import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { readLastRead, useLastRead, DEFAULT_LAST_READ } from './useLastRead'

beforeEach(() => {
  localStorage.clear()
})

describe('readLastRead: restore (F6)', () => {
  it('defaults to john/1 on first run', () => {
    expect(readLastRead()).toEqual(DEFAULT_LAST_READ)
    expect(DEFAULT_LAST_READ.book).toBe('john')
    expect(DEFAULT_LAST_READ.chapter).toBe(1)
  })

  it('restores a valid persisted location', () => {
    localStorage.setItem(
      'bsa.lastRead',
      JSON.stringify({ book: 'romans', chapter: 8, verse: 28, updatedAt: 123 }),
    )
    expect(readLastRead()).toEqual({
      book: 'romans',
      chapter: 8,
      verse: 28,
      updatedAt: 123,
    })
  })

  it('falls back to default on corrupted JSON', () => {
    localStorage.setItem('bsa.lastRead', '{broken')
    expect(readLastRead()).toEqual(DEFAULT_LAST_READ)
  })

  it('falls back to default on an invalid chapter', () => {
    localStorage.setItem(
      'bsa.lastRead',
      JSON.stringify({ book: 'romans', chapter: 0, updatedAt: 1 }),
    )
    expect(readLastRead()).toEqual(DEFAULT_LAST_READ)
  })
})

describe('useLastRead: persist (F6)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('records the location after the debounce window', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useLastRead())
    act(() => {
      result.current.record('psalms', 23, 1)
    })
    // Nothing persisted before the debounce elapses.
    expect(localStorage.getItem('bsa.lastRead')).toBeNull()
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(readLastRead()).toMatchObject({ book: 'psalms', chapter: 23, verse: 1 })
  })

  it('debounces so the latest record within the window wins', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useLastRead())
    act(() => {
      result.current.record('genesis', 1)
      result.current.record('exodus', 2)
    })
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(readLastRead()).toMatchObject({ book: 'exodus', chapter: 2 })
  })
})
