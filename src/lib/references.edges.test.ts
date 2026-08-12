import { describe, it, expect } from 'vitest'
import {
  verseKey,
  parseVerseKey,
  prevChapter,
  nextChapter,
  clampChapter,
  formatReference,
} from './references'

describe('references: verse keys', () => {
  it('formats keys deterministically', () => {
    expect(verseKey('genesis', 1, 1)).toBe('genesis.1.1')
    expect(verseKey('3 john', 1, 14)).toBe('3 john.1.14')
  })

  it('round-trips a key through parse', () => {
    const k = verseKey('1 corinthians', 13, 4)
    expect(parseVerseKey(k)).toEqual({
      book: '1 corinthians',
      chapter: 13,
      verse: 4,
    })
  })

  it('rejects malformed keys', () => {
    expect(parseVerseKey('nonsense')).toBeNull()
    expect(parseVerseKey('john.3')).toBeNull()
    expect(parseVerseKey('')).toBeNull()
    expect(parseVerseKey('john.abc.def')).toBeNull()
  })
})

describe('references: chapter navigation across canon', () => {
  it('has no previous chapter before Genesis 1', () => {
    expect(prevChapter('genesis', 1)).toBeNull()
  })

  it('has no next chapter after Revelation 22', () => {
    expect(nextChapter('revelation', 22)).toBeNull()
  })

  it('rolls back across a book boundary to the last chapter of the prior book', () => {
    // Exodus 1 -> Genesis 50 (Genesis has 50 chapters).
    expect(prevChapter('exodus', 1)).toEqual({ book: 'genesis', chapter: 50 })
    // Matthew 1 -> Malachi 4 (last OT book, 4 chapters).
    expect(prevChapter('matthew', 1)).toEqual({ book: 'malachi', chapter: 4 })
  })

  it('rolls forward across a book boundary to chapter 1 of the next book', () => {
    // Genesis 50 -> Exodus 1.
    expect(nextChapter('genesis', 50)).toEqual({ book: 'exodus', chapter: 1 })
    // Malachi 4 -> Matthew 1 (OT/NT seam).
    expect(nextChapter('malachi', 4)).toEqual({ book: 'matthew', chapter: 1 })
  })

  it('steps within a book without crossing boundaries', () => {
    expect(nextChapter('john', 1)).toEqual({ book: 'john', chapter: 2 })
    expect(prevChapter('john', 3)).toEqual({ book: 'john', chapter: 2 })
  })

  it('returns null for unknown books', () => {
    expect(prevChapter('nope', 5)).toBeNull()
    expect(nextChapter('nope', 5)).toBeNull()
  })
})

describe('references: clampChapter', () => {
  it('clamps below and above the valid range', () => {
    expect(clampChapter('john', 0)).toBe(1)
    expect(clampChapter('john', -4)).toBe(1)
    expect(clampChapter('john', 99)).toBe(21) // John has 21 chapters
    expect(clampChapter('john', 5)).toBe(5)
  })

  it('passes through unchanged for unknown books', () => {
    expect(clampChapter('nope', 7)).toBe(7)
  })
})

describe('references: formatReference', () => {
  it('uses the display name and omits verse when absent', () => {
    expect(formatReference('john', 3)).toBe('John 3')
    expect(formatReference('john', 3, 16)).toBe('John 3:16')
    expect(formatReference('1 corinthians', 13, 4)).toBe('1 Corinthians 13:4')
  })

  it('falls back to the raw id for unknown books', () => {
    expect(formatReference('mystery', 2)).toBe('mystery 2')
  })
})
