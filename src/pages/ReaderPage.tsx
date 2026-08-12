import { useParams, useLocation, Navigate } from 'react-router-dom'
import { Reader } from '../components/reader/Reader'
import { getBook } from '../data/books'
import { clampChapter } from '../lib/references'

/** Parse "#v-16" from the location hash into a verse number. */
function parseHashVerse(hash: string): number | undefined {
  const m = /^#v-(\d+)$/.exec(hash)
  if (!m) return undefined
  const n = Number(m[1])
  return Number.isFinite(n) && n > 0 ? n : undefined
}

export function ReaderPage() {
  const params = useParams<{ book: string; chapter: string }>()
  const location = useLocation()

  const bookParam = (params.book ?? '').toLowerCase()
  const meta = getBook(bookParam)

  // Unknown book -> fall back to John 1.
  if (!meta) {
    return <Navigate to="/read/john/1" replace />
  }

  const rawChapter = Number(params.chapter)
  const chapter = Number.isFinite(rawChapter)
    ? clampChapter(meta.id, Math.trunc(rawChapter))
    : 1

  // Normalize an out-of-range/non-integer chapter in the URL.
  if (String(chapter) !== params.chapter) {
    return <Navigate to={`/read/${encodeURIComponent(meta.id)}/${chapter}`} replace />
  }

  const initialVerse = parseHashVerse(location.hash)

  return (
    <Reader
      key={`${meta.id}.${chapter}`}
      book={meta.id}
      chapter={chapter}
      initialVerse={initialVerse}
    />
  )
}
