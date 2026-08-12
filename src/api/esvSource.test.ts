import { describe, it, expect, afterEach, vi } from 'vitest'
import { getEsvChapter } from './esvSource'
import { NotConfiguredError, NotFoundError } from './bibleSource'

function mockFetch(response: Partial<Response> & { jsonValue?: unknown }) {
  const fn = vi.fn().mockResolvedValue({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: async () => response.jsonValue,
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('esvSource', () => {
  it('parses [n] verse markers into verses (no client key needed)', async () => {
    const fetchFn = mockFetch({
      jsonValue: {
        passages: [
          '[1] In the beginning was the Word, and the Word was with God. [2] He was in the beginning with God.',
        ],
      },
    })
    const chapter = await getEsvChapter('john', 1)
    expect(chapter.translationId).toBe('esv')
    expect(chapter.translationName).toBe('English Standard Version')
    expect(chapter.verses).toHaveLength(2)
    expect(chapter.verses[0]).toMatchObject({ verse: 1 })
    expect(chapter.verses[0].text).toMatch(/^In the beginning/)
    expect(chapter.verses[1].verse).toBe(2)
    // Calls the same-origin proxy path; the server injects the key.
    expect(fetchFn.mock.calls[0][0]).toMatch(/^\/api\/esv\//)
  })

  it('maps 404 to NotFoundError', async () => {
    mockFetch({ ok: false, status: 404 })
    await expect(getEsvChapter('john', 999)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('maps 401 (rejected key) to NotConfiguredError', async () => {
    mockFetch({ ok: false, status: 401 })
    await expect(getEsvChapter('john', 1)).rejects.toBeInstanceOf(NotConfiguredError)
  })

  it('maps 503 (no server key) to NotConfiguredError', async () => {
    mockFetch({ ok: false, status: 503 })
    await expect(getEsvChapter('john', 1)).rejects.toBeInstanceOf(NotConfiguredError)
  })
})
