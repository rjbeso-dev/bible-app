import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SettingsProvider } from '../context/SettingsProvider'
import { ThemeToggle } from './layout/ThemeToggle'
import { TranslationSelect } from './reader/TranslationSelect'
import { bibleSource } from '../api'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ThemeToggle (F8)', () => {
  it('flips data-theme on the root and persists the choice', () => {
    render(
      <SettingsProvider>
        <ThemeToggle />
      </SettingsProvider>,
    )
    // Defaults to light in jsdom (no matchMedia dark match).
    expect(document.documentElement.dataset.theme).toBe('light')
    const btn = screen.getByRole('button', { name: /switch to dark theme/i })

    act(() => {
      fireEvent.click(btn)
    })

    expect(document.documentElement.dataset.theme).toBe('dark')
    const stored = JSON.parse(localStorage.getItem('bsa.settings')!)
    expect(stored.theme).toBe('dark')
  })
})

describe('SettingsProvider theme init (F8)', () => {
  it('initialises from prefers-color-scheme when nothing is stored', () => {
    // Stub matchMedia to report a dark OS preference.
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      })),
    )
    render(
      <SettingsProvider>
        <ThemeToggle />
      </SettingsProvider>,
    )
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})

describe('TranslationSelect (F2)', () => {
  it('lists every curated translation, grouped by reading level', () => {
    render(<TranslationSelect value="web" onChange={() => {}} />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(bibleSource.listTranslations().length)
    // Six free versions plus five licensed ones (ESV, NLT, NIV, AMP, NASB).
    expect(options).toHaveLength(11)
    expect(
      screen.getByRole('option', { name: 'King James Version (Classic)' }),
    ).toBeInTheDocument()
    // Reading-level groups are present as <optgroup> labels.
    expect(screen.getByRole('group', { name: 'Easy to read' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Study translations' })).toBeInTheDocument()
    // Licensed versions appear by plain name (no user-facing key marker).
    expect(
      screen.getByRole('option', { name: 'English Standard Version' }),
    ).toBeInTheDocument()
  })

  it('fires onChange with the selected translation id', () => {
    const onChange = vi.fn()
    render(<TranslationSelect value="web" onChange={onChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'kjv' } })
    expect(onChange).toHaveBeenCalledWith('kjv')
  })
})
