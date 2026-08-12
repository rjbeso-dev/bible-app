import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Reset DOM and localStorage between tests.
afterEach(() => {
  cleanup()
  try {
    localStorage.clear()
  } catch {
    // ignore
  }
})
