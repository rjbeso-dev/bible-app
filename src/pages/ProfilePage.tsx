import { useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { useAuth } from '../context/useAuth'
import { useNotes } from '../hooks/useNotes'
import { useHighlights } from '../hooks/useHighlights'
import { useReadingProgress } from '../hooks/useReadingProgress'
import { BOOKS, getBook } from '../data/books'
import { formatReference, parseVerseKey } from '../lib/references'
import type { Note, RecentChapter } from '../types'
import { Icon } from '../components/ui/Icon'

function readerHref(book: string, chapter: number, verse?: number): string {
  const base = `/read/${encodeURIComponent(book)}/${chapter}`
  return verse ? `${base}#v-${verse}` : base
}

/** Best available display name for the signed-in user. */
function displayName(user: User): string {
  const meta = user.user_metadata
  const name = meta?.full_name ?? meta?.name
  if (typeof name === 'string' && name.trim()) return name.trim()
  return user.email ?? 'Your account'
}

/** Google profile photo, if Supabase captured one. */
function avatarUrl(user: User): string | null {
  const meta = user.user_metadata
  const url = meta?.avatar_url ?? meta?.picture
  return typeof url === 'string' && url ? url : null
}

/** How many books have every chapter marked read, and how many have at least one. */
function bookProgress(readChapters: string[]): { started: number; completed: number } {
  const perBook = new Map<string, number>()
  for (const key of readChapters) {
    const dot = key.lastIndexOf('.')
    if (dot === -1) continue
    const bookId = key.slice(0, dot)
    perBook.set(bookId, (perBook.get(bookId) ?? 0) + 1)
  }
  let completed = 0
  for (const [bookId, count] of perBook) {
    const meta = getBook(bookId)
    if (meta && count >= meta.chapterCount) completed += 1
  }
  return { started: perBook.size, completed }
}

export function ProfilePage() {
  const { user, enabled, signOut } = useAuth()
  const { notes } = useNotes()
  const { highlights } = useHighlights()
  const { readChapters, recentChapters, chaptersReadCount } = useReadingProgress()

  const progress = useMemo(() => bookProgress(readChapters), [readChapters])

  const recentNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5),
    [notes],
  )

  // No accounts configured, or nobody's signed in: there's no profile to show.
  if (!enabled || !user) return <Navigate to="/" replace />

  const name = displayName(user)
  const avatar = avatarUrl(user)
  const memberSince = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(user.created_at))

  return (
    <div className="dashboard profile-page">
      <header className="profile-masthead">
        {avatar ? (
          <img src={avatar} alt="" className="profile-avatar" referrerPolicy="no-referrer" />
        ) : (
          <span className="profile-avatar profile-avatar-fallback" aria-hidden="true">
            <Icon name="user" size={28} />
          </span>
        )}
        <div className="profile-identity">
          <h1 className="profile-name">{name}</h1>
          {user.email && <p className="profile-email muted">{user.email}</p>}
          <p className="profile-since muted">Member since {memberSince} · Synced across your devices</p>
        </div>
      </header>

      <section className="dash-stats profile-stats" aria-label="Your milestones">
        <StatItem icon="book" value={chaptersReadCount} label="Chapters read" />
        <StatItem icon="bookmark" value={Object.keys(highlights).length} label="Highlights" />
        <StatItem icon="note" value={notes.length} label="Notes" />
        <StatItem
          icon="sparkle"
          value={progress.completed}
          label={`Books completed (of ${BOOKS.length})`}
        />
      </section>

      <div className="dash-grid profile-grid">
        <div className="dash-main">
          <section className="dash-block" aria-labelledby="profile-notes-h">
            <h3 id="profile-notes-h" className="dash-block-title">Your notes</h3>
            {recentNotes.length > 0 ? (
              <ul className="dash-list">
                {recentNotes.map((n) => (
                  <NoteRow key={n.id} note={n} />
                ))}
              </ul>
            ) : (
              <p className="dash-empty muted">
                Tap a verse while reading and choose “Add note”.
              </p>
            )}
            {notes.length > recentNotes.length && (
              <Link to="/notes" className="dash-inline-link">
                See all notes <Icon name="arrow-right" size={14} />
              </Link>
            )}
          </section>
        </div>

        <aside className="dash-aside">
          <section className="dash-block" aria-labelledby="profile-jump-h">
            <h3 id="profile-jump-h" className="dash-block-title">Jump back in</h3>
            {recentChapters.length > 0 ? (
              <ul className="dash-list">
                {recentChapters.slice(0, 6).map((c) => (
                  <RecentRow key={`${c.book}.${c.chapter}`} chapter={c} />
                ))}
              </ul>
            ) : (
              <p className="dash-empty muted">Your recently opened chapters will collect here.</p>
            )}
          </section>

          <section className="dash-block" aria-labelledby="profile-account-h">
            <h3 id="profile-account-h" className="dash-block-title">Account</h3>
            <p className="dash-empty muted profile-account-note">
              Signed in with Google. Signing out keeps everything on this device — it just stops
              syncing until you sign back in.
            </p>
            <button type="button" className="button ghost small" onClick={() => void signOut()}>
              Sign out
            </button>
          </section>
        </aside>
      </div>
    </div>
  )
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: 'book' | 'note' | 'bookmark' | 'sparkle'
  value: number
  label: string
}) {
  return (
    <div className="dash-stat">
      <span className="dash-stat-icon" aria-hidden="true">
        <Icon name={icon} size={16} />
      </span>
      <span className="dash-stat-value">{value}</span>
      <span className="dash-stat-label">{label}</span>
    </div>
  )
}

function RecentRow({ chapter }: { chapter: RecentChapter }) {
  const meta = getBook(chapter.book)
  const name = meta ? `${meta.name} ${chapter.chapter}` : formatReference(chapter.book, chapter.chapter)
  return (
    <li className="dash-row">
      <Link to={readerHref(chapter.book, chapter.chapter)} className="dash-row-link">
        <span className="dash-row-ref">{name}</span>
        <span className="dash-row-meta">{chapter.translationId.toUpperCase()}</span>
      </Link>
    </li>
  )
}

function NoteRow({ note }: { note: Note }) {
  const parsed = note.verseKey ? parseVerseKey(note.verseKey) : null
  const href = parsed ? readerHref(parsed.book, parsed.chapter, parsed.verse) : `/notes/${note.id}`
  return (
    <li className="dash-row">
      <Link to={href} className="dash-row-link dash-row-note">
        <span className="dash-row-ref">{note.reference ?? note.title ?? 'Note'}</span>
        <span className="dash-row-preview">{note.body}</span>
      </Link>
    </li>
  )
}
