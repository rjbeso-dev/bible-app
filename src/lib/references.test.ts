import { describe, it, expect } from 'vitest'
import {
  verseKey,
  parseVerseKey,
  prevChapter,
  nextChapter,
  formatReference,
} from './references'

// Smoke tests confirming the Vitest tooling is wired up. The full suite is
// authored separately.
describe('references', () => {
  it('builds and parses verse keys, including multi-word books', () => {
    expect(verseKey('john', 3, 16)).toBe('john.3.16')
    expect(parseVerseKey('1 corinthians.13.4')).toEqual({
      book: '1 corinthians',
      chapter: 13,
      verse: 4,
    })
    expect(parseVerseKey('nonsense')).toBeNull()
  })

  it('navigates chapters across book boundaries', () => {
    expect(nextChapter('john', 1)).toEqual({ book: 'john', chapter: 2 })
    // John has 21 chapters; next rolls into Acts 1.
    expect(nextChapter('john', 21)).toEqual({ book: 'acts', chapter: 1 })
    // Genesis 1 is the very beginning.
    expect(prevChapter('genesis', 1)).toBeNull()
    // Revelation 22 is the very end.
    expect(nextChapter('revelation', 22)).toBeNull()
  })

  it('formats human-readable references', () => {
    expect(formatReference('john', 3)).toBe('John 3')
    expect(formatReference('john', 3, 16)).toBe('John 3:16')
    expect(formatReference('1 corinthians', 13, 4)).toBe('1 Corinthians 13:4')
  })
})
