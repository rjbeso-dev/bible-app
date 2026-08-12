import { describe, it, expect } from 'vitest'
import { BOOKS, getBook, OT_BOOKS, NT_BOOKS } from './books'

describe('data/books: canon shape', () => {
  it('contains exactly 66 books', () => {
    expect(BOOKS).toHaveLength(66)
  })

  it('splits 39 OT + 27 NT', () => {
    expect(OT_BOOKS).toHaveLength(39)
    expect(NT_BOOKS).toHaveLength(27)
  })

  it('has unique book ids', () => {
    const ids = BOOKS.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('starts at Genesis and ends at Revelation', () => {
    expect(BOOKS[0].id).toBe('genesis')
    expect(BOOKS[BOOKS.length - 1].id).toBe('revelation')
  })
})

describe('data/books: chapter counts', () => {
  it('matches well-known chapter counts', () => {
    const count = (id: string) => getBook(id)?.chapterCount
    expect(count('genesis')).toBe(50)
    expect(count('exodus')).toBe(40)
    expect(count('psalms')).toBe(150)
    expect(count('john')).toBe(21)
    expect(count('revelation')).toBe(22)
  })

  it('marks the single-chapter books as 1 chapter', () => {
    const count = (id: string) => getBook(id)?.chapterCount
    for (const id of ['obadiah', 'philemon', 'jude', '2 john', '3 john']) {
      expect(count(id)).toBe(1)
    }
  })

  it('gives every book a plausible chapter count (>= 1)', () => {
    for (const b of BOOKS) {
      expect(b.chapterCount).toBeGreaterThanOrEqual(1)
      expect(Number.isInteger(b.chapterCount)).toBe(true)
    }
  })

  it('gives every book a name, testament and intro', () => {
    for (const b of BOOKS) {
      expect(b.name.length).toBeGreaterThan(0)
      expect(['OT', 'NT']).toContain(b.testament)
      expect(b.intro.length).toBeGreaterThan(0)
    }
  })

  it('gives every book complete reference metadata', () => {
    const fields = ['author', 'written', 'place', 'audience', 'genre', 'themes'] as const
    for (const b of BOOKS) {
      for (const field of fields) {
        expect(b[field].trim().length).toBeGreaterThan(0)
      }
    }
  })
})

describe('data/books: getBook lookup', () => {
  it('resolves by exact id', () => {
    expect(getBook('john')?.name).toBe('John')
    expect(getBook('1 corinthians')?.name).toBe('1 Corinthians')
  })

  it('is case-insensitive', () => {
    expect(getBook('John')?.id).toBe('john')
    expect(getBook('1 CORINTHIANS')?.id).toBe('1 corinthians')
  })

  it('returns undefined for unknown ids', () => {
    expect(getBook('nope')).toBeUndefined()
  })
})
