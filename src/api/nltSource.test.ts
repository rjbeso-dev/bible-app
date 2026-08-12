import { describe, it, expect, afterEach, vi } from 'vitest'
import { getNltChapter } from './nltSource'
import { NotConfiguredError, NotFoundError } from './bibleSource'

function mockFetch(response: Partial<Response> & { textValue?: string }) {
  const fn = vi.fn().mockResolvedValue({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    text: async () => response.textValue ?? '',
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

// Mirrors the real api.nlt.to shape: a `vn` attribute (not `data-vn`) and the
// verse text inside a <p class="body-ch"> with a leading <span class="vn">.
const SAMPLE_HTML = `
  <html><body>
    <h2 class="subhead">Prologue</h2>
    <verse_export orig="john_1_1" bk="john" ch="1" vn="1">
      <p class="body-ch"><span class="vn">1</span>In the beginning the Word already existed.<a class="a-tn">*</a></p>
    </verse_export>
    <verse_export orig="john_1_2" bk="john" ch="1" vn="2">
      <p class="body-ch"><span class="vn">2</span>He existed in the beginning with God.</p>
    </verse_export>
  </body></html>
`

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('nltSource', () => {
  it('parses <verse_export> elements, dropping verse-number and note markup', async () => {
    const fetchFn = mockFetch({ textValue: SAMPLE_HTML })
    const chapter = await getNltChapter('john', 1)
    expect(chapter.translationId).toBe('nlt')
    expect(chapter.verses).toHaveLength(2)
    expect(chapter.verses[0].verse).toBe(1)
    // The inline "1" (verse-number span) and footnote marker are stripped.
    expect(chapter.verses[0].text).toBe('In the beginning the Word already existed.')
    expect(chapter.verses[1].text).toBe('He existed in the beginning with God.')
    // Calls the same-origin proxy path; the server injects the key.
    expect(fetchFn.mock.calls[0][0]).toMatch(/^\/api\/nlt\//)
  })

  // Regression: the live NLT payload nests verses in malformed <p> markup with
  // stray unclosed <p> tags, which makes the HTML parser re-parent a verse's
  // text into a neighbouring <verse_export>. Verses must still be read in order.
  it('reads every verse despite malformed <p> nesting (no dropped/merged verses)', async () => {
    const MALFORMED = `
      <verse_export bk="gene" ch="1" vn="22"><span class="vn">22</span>Then God blessed them.<p>
      </verse_export><verse_export bk="gene" ch="1" vn="23">
      <p class="ext-body"><span class="vn">23</span>Evening passed and morning came.</p>
      </verse_export><verse_export bk="gene" ch="1" vn="24">
      <p class="ext-hanging-sp"><span class="vn">24</span>Then God said, let the earth produce animals.
      </verse_export><verse_export bk="gene" ch="1" vn="25"><span class="vn">25</span>God made the animals.<p>
      </verse_export>`
    mockFetch({ textValue: MALFORMED })
    const chapter = await getNltChapter('genesis', 1)
    expect(chapter.verses.map((v) => v.verse)).toEqual([22, 23, 24, 25])
    const v23 = chapter.verses.find((v) => v.verse === 23)
    const v24 = chapter.verses.find((v) => v.verse === 24)
    expect(v23?.text).toBe('Evening passed and morning came.')
    expect(v24?.text).toBe('Then God said, let the earth produce animals.')
  })

  it('maps 404 to NotFoundError', async () => {
    mockFetch({ ok: false, status: 404 })
    await expect(getNltChapter('john', 999)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('maps 503 (no server key) to NotConfiguredError', async () => {
    mockFetch({ ok: false, status: 503 })
    await expect(getNltChapter('john', 1)).rejects.toBeInstanceOf(NotConfiguredError)
  })
})
