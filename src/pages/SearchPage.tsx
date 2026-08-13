import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchEsv, type SearchResult } from '../api/esvSource'
import { BibleApiError } from '../api'
import { getBook } from '../data/books'
import { Icon } from '../components/ui/Icon'

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'results'; query: string; results: SearchResult[] }

/** Turn an ESV reference like "John 3:16" into a reader link, or null. */
function refToHref(reference: string): string | null {
  const m = /^(.+?)\s+(\d+):(\d+)/.exec(reference)
  if (!m) return null
  let bookId = m[1].toLowerCase().trim()
  if (bookId === 'psalm') bookId = 'psalms'
  if (!getBook(bookId)) return null
  return `/read/${encodeURIComponent(bookId)}/${m[2]}#v-${m[3]}`
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })
  const controllerRef = useRef<AbortController | null>(null)

  const run = async () => {
    const q = query.trim()
    if (!q) return
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setState({ kind: 'loading' })
    try {
      const results = await searchEsv(q, { signal: controller.signal })
      setState({ kind: 'results', query: q, results })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message =
        err instanceof BibleApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong.'
      setState({ kind: 'error', message })
    }
  }

  return (
    <div className="search-page">
      <h1 className="page-title">Search</h1>

      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault()
          void run()
        }}
        role="search"
      >
        <span className="search-input-wrap">
          <Icon name="search" size={18} className="search-input-icon" />
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the Bible…"
            aria-label="Search the Bible"
            autoFocus
          />
        </span>
        <button type="submit" className="button primary" disabled={!query.trim()}>
          Search
        </button>
      </form>

      <p className="search-note muted">Full-text search of the ESV.</p>

      {state.kind === 'loading' && <p className="muted search-status">Searching…</p>}

      {state.kind === 'error' && (
        <p className="banner-inline warning" role="alert">
          {state.message}
        </p>
      )}

      {state.kind === 'results' && state.results.length === 0 && (
        <div className="empty-state">
          <p>No results for “{state.query}”.</p>
          <p className="muted">Try a different word or phrase.</p>
        </div>
      )}

      {state.kind === 'results' && state.results.length > 0 && (
        <ol className="search-results">
          {state.results.map((r) => {
            const href = refToHref(r.reference)
            return (
              <li key={r.reference} className="search-result">
                {href ? (
                  <Link to={href} className="search-result-ref">
                    {r.reference}
                  </Link>
                ) : (
                  <span className="search-result-ref">{r.reference}</span>
                )}
                <p className="search-result-snippet">{r.content}</p>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
