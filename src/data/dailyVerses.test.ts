import { describe, it, expect } from 'vitest'
import { DAILY_VERSES, dayOfYear, verseOfTheDay } from './dailyVerses'
import { getBook } from './books'

describe('dailyVerses', () => {
  it('has a non-trivial, well-formed list', () => {
    expect(DAILY_VERSES.length).toBeGreaterThanOrEqual(30)
    for (const v of DAILY_VERSES) {
      expect(v.text.length).toBeGreaterThan(0)
      expect(v.chapter).toBeGreaterThan(0)
      expect(v.verse).toBeGreaterThan(0)
    }
  })

  it('references only real book slugs (so context links resolve)', () => {
    for (const v of DAILY_VERSES) {
      expect(getBook(v.book), `${v.ref} -> ${v.book}`).toBeDefined()
    }
  })

  it('picks deterministically by calendar day', () => {
    const a = verseOfTheDay(new Date(2026, 0, 1))
    const b = verseOfTheDay(new Date(2026, 0, 1))
    expect(a).toBe(b)
    const idx = dayOfYear(new Date(2026, 0, 1)) % DAILY_VERSES.length
    expect(a).toBe(DAILY_VERSES[idx])
  })

  it('advances on the next day', () => {
    const d0 = new Date(2026, 5, 10)
    const d1 = new Date(2026, 5, 11)
    expect(dayOfYear(d1)).toBe(dayOfYear(d0) + 1)
  })
})
