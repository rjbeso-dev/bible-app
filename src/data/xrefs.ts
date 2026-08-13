// Cross-references, sourced from OpenBible.info (CC BY). The data is processed
// into one compact file per book under ./xrefs/{bookIndex}.json, keyed by
// "chapter.verse" → a list of target refs encoded as [bookIndex, chapter, verse]
// (with an optional 4th element for a same-chapter range end). Each book's file
// is lazily loaded on demand so the initial bundle stays small.

import { BOOKS } from './books'

export interface CrossRef {
  /** Target book id (route/storage key). */
  id: string
  /** Human label, e.g. "John 3:16" or "Romans 5:1–5". */
  label: string
  /** Reader route with a verse hash, e.g. "/read/john/3#v-16". */
  href: string
}

type RawEntry = number[]
type BookXrefs = Record<string, RawEntry[]>

const loaders = import.meta.glob<{ default: BookXrefs }>('./xrefs/*.json')
const cache = new Map<number, BookXrefs | null>()

async function loadBook(index: number): Promise<BookXrefs | null> {
  if (cache.has(index)) return cache.get(index) ?? null
  const loader = loaders[`./xrefs/${index}.json`]
  if (!loader) {
    cache.set(index, null)
    return null
  }
  try {
    const mod = await loader()
    cache.set(index, mod.default)
    return mod.default
  } catch {
    cache.set(index, null)
    return null
  }
}

/** Cross-references for a verse, or [] if none. Lazily loads the book's data. */
export async function getCrossRefs(
  bookId: string,
  chapter: number,
  verse: number,
): Promise<CrossRef[]> {
  const index = BOOKS.findIndex((b) => b.id === bookId)
  if (index < 0) return []
  const data = await loadBook(index)
  const entries = data?.[`${chapter}.${verse}`]
  if (!entries) return []

  const refs: CrossRef[] = []
  for (const e of entries) {
    const meta = BOOKS[e[0]]
    if (!meta) continue
    const c = e[1]
    const v = e[2]
    const end = e[3]
    const label = end ? `${meta.name} ${c}:${v}–${end}` : `${meta.name} ${c}:${v}`
    refs.push({ id: meta.id, label, href: `/read/${encodeURIComponent(meta.id)}/${c}#v-${v}` })
  }
  return refs
}
