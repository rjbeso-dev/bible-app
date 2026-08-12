import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { Chapter } from '../types'

// Mock the data source so no real network is touched. NetworkError is a
// BibleApiError subclass in the real module; we mirror the class here so the
// hook's `instanceof BibleApiError` branch is exercised.
vi.mock('../api', () => {
  class BibleApiError extends Error {
    kind: string
    constructor(kind: string, message: string) {
      super(message)
      this.kind = kind
    }
  }
  return {
    BibleApiError,
    bibleSource: {
      getChapter: vi.fn(),
      listTranslations: () => [],
    },
  }
})

import { bibleSource } from '../api'
import { useChapter } from './useChapter'
import { writeChapterCache, clearChapterCache, readChapterCache } from '../lib/chapterCache'

const getChapter = vi.mocked(bibleSource.getChapter)

function makeChapter(book: string, chapter: number, translationId: string): Chapter {
  return {
    reference: `${book} ${chapter}`,
    translationId,
    translationName: translationId.toUpperCase(),
    book,
    chapter,
    verses: [
      { book_id: book, book_name: book, chapter, verse: 1, text: 'hello' },
    ],
  }
}

beforeEach(() => {
  localStorage.clear()
  clearChapterCache()
  getChapter.mockReset()
})

describe('useChapter: cache-first behavior', () => {
  it('serves a cache hit without fetching', async () => {
    writeChapterCache(makeChapter('john', 3, 'web'))
    const { result } = renderHook(() => useChapter('john', 3, 'web'))

    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.chapter?.verses[0].text).toBe('hello')
    // The whole point of cache-first: no network on a hit.
    expect(getChapter).not.toHaveBeenCalled()
  })

  it('fetches on a miss then writes through to the cache', async () => {
    getChapter.mockResolvedValue(makeChapter('mark', 1, 'web'))
    const { result } = renderHook(() => useChapter('mark', 1, 'web'))

    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(getChapter).toHaveBeenCalledTimes(1)
    expect(getChapter).toHaveBeenCalledWith(
      'mark',
      1,
      'web',
      expect.objectContaining({ signal: expect.anything() }),
    )
    // Written through to the cache.
    expect(readChapterCache('web', 'mark', 1)).not.toBeNull()
  })

  it('re-fetches per translation (F2 cache-keyed by translation)', async () => {
    getChapter.mockResolvedValue(makeChapter('john', 1, 'kjv'))
    // web copy is cached, but a kjv render must miss and fetch.
    writeChapterCache(makeChapter('john', 1, 'web'))
    const { result } = renderHook(() => useChapter('john', 1, 'kjv'))
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(getChapter).toHaveBeenCalledTimes(1)
    expect(getChapter.mock.calls[0][2]).toBe('kjv')
  })

  it('surfaces an error when the fetch fails and no cache exists', async () => {
    getChapter.mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useChapter('luke', 2, 'web'))
    await waitFor(() =>
      expect(['error', 'offline']).toContain(result.current.status),
    )
    expect(result.current.error).toBe('boom')
    expect(result.current.chapter).toBeNull()
  })

  it('stays idle when book is undefined', () => {
    const { result } = renderHook(() => useChapter(undefined, 1, 'web'))
    expect(result.current.status).toBe('idle')
    expect(getChapter).not.toHaveBeenCalled()
  })
})
