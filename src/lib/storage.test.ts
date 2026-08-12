import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  STORAGE_PREFIX,
  readJSON,
  writeJSON,
  removeKey,
  keysWithPrefix,
  isQuotaError,
} from './storage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('storage: defensive reads', () => {
  it('returns the fallback for a missing key', () => {
    expect(readJSON('bsa.missing', { a: 1 })).toEqual({ a: 1 })
  })

  it('returns the fallback for corrupted JSON without throwing', () => {
    localStorage.setItem('bsa.corrupt', '{not valid json')
    expect(() => readJSON('bsa.corrupt', 'fallback')).not.toThrow()
    expect(readJSON('bsa.corrupt', 'fallback')).toBe('fallback')
  })

  it('parses a well-formed value', () => {
    localStorage.setItem('bsa.ok', JSON.stringify({ x: 42 }))
    expect(readJSON('bsa.ok', null)).toEqual({ x: 42 })
  })
})

describe('storage: write / remove round-trip', () => {
  it('writes then reads back the same value', () => {
    expect(writeJSON('bsa.rt', [1, 2, 3])).toBe(true)
    expect(readJSON('bsa.rt', [])).toEqual([1, 2, 3])
  })

  it('removes a key', () => {
    writeJSON('bsa.del', 'v')
    removeKey('bsa.del')
    expect(readJSON('bsa.del', 'gone')).toBe('gone')
  })
})

describe('storage: namespacing', () => {
  it('lists only keys with the given prefix', () => {
    writeJSON(`${STORAGE_PREFIX}a`, 1)
    writeJSON(`${STORAGE_PREFIX}b`, 2)
    localStorage.setItem('other.c', '3')
    const keys = keysWithPrefix(STORAGE_PREFIX)
    expect(keys).toContain(`${STORAGE_PREFIX}a`)
    expect(keys).toContain(`${STORAGE_PREFIX}b`)
    expect(keys).not.toContain('other.c')
  })
})

describe('storage: quota handling', () => {
  function quotaError(): DOMException {
    return new DOMException('quota', 'QuotaExceededError')
  }

  it('detects a quota error', () => {
    expect(isQuotaError(quotaError())).toBe(true)
    expect(isQuotaError(new Error('nope'))).toBe(false)
  })

  it('runs the onQuotaExceeded hook and retries once (success)', () => {
    let calls = 0
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      calls += 1
      if (calls === 1) throw quotaError()
      // second call succeeds (no-op)
    })
    const freed = vi.fn()
    const ok = writeJSON('bsa.quota', { big: true }, freed)
    expect(ok).toBe(true)
    expect(freed).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('returns false on quota error when no hook is supplied', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw quotaError()
    })
    expect(writeJSON('bsa.quota2', { big: true })).toBe(false)
  })
})
