import { describe, it, expect, afterEach, vi } from 'vitest'
import { getCommentaryChapter } from './commentarySource'

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

describe('commentarySource', () => {
  it('parses verse-numbered content into CommentaryVerse[]', async () => {
    const fetchFn = mockFetch({
      jsonValue: {
        chapter: {
          content: [
            { type: 'heading', content: ['Introduction'] },
            { type: 'verse', number: 1, content: ['In the beginning God created...'] },
            { type: 'verse', number: 2, content: ['The earth was without form, ', 'and void.'] },
          ],
        },
      },
    })
    const verses = await getCommentaryChapter('matthew-henry', 'genesis', 1)
    expect(verses).toEqual([
      { verse: 1, text: 'In the beginning God created...' },
      { verse: 2, text: 'The earth was without form,  and void.' },
    ])
    // Uses the verified USFM code and the HelloAO endpoint shape.
    expect(fetchFn.mock.calls[0][0]).toBe(
      'https://bible.helloao.org/api/c/matthew-henry/GEN/1.json',
    )
  })

  it('returns null for an unknown book id (no USFM mapping)', async () => {
    const fetchFn = mockFetch({ jsonValue: {} })
    const verses = await getCommentaryChapter('matthew-henry', 'not-a-book', 1)
    expect(verses).toBeNull()
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('returns null (not an error) when the API responds 404 — commentary just does not cover this book', async () => {
    mockFetch({ ok: false, status: 404 })
    const verses = await getCommentaryChapter('keil-delitzsch', 'matthew', 1)
    expect(verses).toBeNull()
  })

  it('returns null on malformed JSON rather than throwing', async () => {
    mockFetch({ jsonValue: { chapter: {} } })
    const verses = await getCommentaryChapter('matthew-henry', 'genesis', 1)
    expect(verses).toBeNull()
  })
})
