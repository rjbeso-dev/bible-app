import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/useSettings'
import { useChapter } from '../../hooks/useChapter'
import { useLastRead } from '../../hooks/useLastRead'
import { useReadingProgress } from '../../hooks/useReadingProgress'
import { getBook } from '../../data/books'
import {
  nextChapter,
  prevChapter,
  formatReference,
  verseKey as makeKey,
} from '../../lib/references'
import { STORAGE_KEYS, readJSON, writeJSON } from '../../lib/storage'
import { BookChapterPicker } from '../navigation/BookChapterPicker'
import { ChapterPager } from '../navigation/ChapterPager'
import { BookIntro } from '../study/BookIntro'
import { NotePopover } from '../study/NotePopover'
import { VerseContextPanel } from '../study/VerseContextPanel'
import { Icon } from '../ui/Icon'
import { ChapterView } from './ChapterView'
import { ParallelView } from './ParallelView'
import { StudyPanel } from './StudyPanel'
import { TranslationSelect } from './TranslationSelect'
import { ChapterAttribution } from './ChapterAttribution'

interface ReaderProps {
  book: string
  chapter: number
  initialVerse?: number
}

export function Reader({ book, chapter, initialVerse }: ReaderProps) {
  const navigate = useNavigate()
  const { settings, setPrimaryTranslation, toggleParallel } = useSettings()
  const { record } = useLastRead()
  const { recordRead } = useReadingProgress()

  const meta = getBook(book)
  const primary = useChapter(book, chapter, settings.primaryTranslation)

  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const [noteVerse, setNoteVerse] = useState<number | null>(null)
  const [contextVerse, setContextVerse] = useState<number | null>(null)
  const [introOpen, setIntroOpen] = useState(chapter === 1)
  const [studyOpen, setStudyOpen] = useState(() => readJSON<boolean>(STORAGE_KEYS.studyOpen, true))

  const scrolledFor = useRef<string>('')

  useEffect(() => {
    writeJSON(STORAGE_KEYS.studyOpen, studyOpen)
  }, [studyOpen])

  // Record last-read and reading progress on chapter change.
  useEffect(() => {
    if (meta) {
      record(book, chapter)
      recordRead(book, chapter, settings.primaryTranslation)
    }
    setSelectedVerse(null)
    setIntroOpen(chapter === 1)
  }, [book, chapter, meta, record, recordRead, settings.primaryTranslation])

  // Record verse focus.
  useEffect(() => {
    if (meta && selectedVerse) record(book, chapter, selectedVerse)
  }, [selectedVerse, book, chapter, meta, record])

  // Selecting a verse opens (and populates) the study panel.
  useEffect(() => {
    if (selectedVerse != null) setStudyOpen(true)
  }, [selectedVerse])

  // Scroll to the initial (hash) verse once the chapter is ready.
  useEffect(() => {
    if (!initialVerse || primary.status !== 'ready') return
    const marker = `${book}.${chapter}.${initialVerse}`
    if (scrolledFor.current === marker) return
    const el = document.getElementById(`v-${initialVerse}`)
    if (el) {
      scrolledFor.current = marker
      el.scrollIntoView({ block: 'center' })
      setSelectedVerse(initialVerse)
    }
  }, [initialVerse, primary.status, book, chapter])

  // Arrow-key chapter navigation (ignoring form fields and modifier combos).
  const goPrev = useCallback(() => {
    const t = prevChapter(book, chapter)
    if (t) navigate(`/read/${encodeURIComponent(t.book)}/${t.chapter}`)
  }, [book, chapter, navigate])
  const goNext = useCallback(() => {
    const t = nextChapter(book, chapter)
    if (t) navigate(`/read/${encodeURIComponent(t.book)}/${t.chapter}`)
  }, [book, chapter, navigate])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) {
        return
      }
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  if (!meta) {
    return (
      <div className="reader-empty">
        <h2>Book not found</h2>
        <p className="muted">
          We couldn’t find a book called “{book}”.
        </p>
        <button type="button" className="button primary" onClick={() => navigate('/read/john/1')}>
          Go to John 1
        </button>
      </div>
    )
  }

  const verses = primary.chapter?.verses ?? []
  const noteKey = noteVerse != null ? makeKey(book, chapter, noteVerse) : null
  const showStudyPanel = studyOpen

  return (
    <div className="reader reader-focus">
      <div className="reader-toolbar">
        <div className="reader-toolbar-left">
          <BookChapterPicker book={book} chapter={chapter} />
          <button
            type="button"
            className={'icon-button' + (introOpen ? ' is-active' : '')}
            onClick={() => setIntroOpen((o) => !o)}
            aria-pressed={introOpen}
            aria-label="Book introduction"
            title="Book introduction"
          >
            <Icon name="info" />
          </button>
        </div>

        <div className="reader-toolbar-right">
          {!settings.parallelEnabled && (
            <TranslationSelect
              value={settings.primaryTranslation}
              onChange={setPrimaryTranslation}
              compact
            />
          )}
          <button
            type="button"
            className={'button ghost small' + (settings.parallelEnabled ? ' is-active' : '')}
            onClick={toggleParallel}
            aria-pressed={settings.parallelEnabled}
          >
            <Icon name="columns" size={16} /> Parallel
          </button>
          <button
            type="button"
            className={'button ghost small' + (studyOpen ? ' is-active' : '')}
            onClick={() => setStudyOpen((o) => !o)}
            aria-pressed={studyOpen}
            aria-label="Toggle study panel"
          >
            <Icon name="sidebar" size={16} /> Study
          </button>
        </div>
      </div>

      <BookIntro book={book} open={introOpen} onClose={() => setIntroOpen(false)} />

      {primary.fromCache && (
        <p className="banner-inline warning" role="status">
          Showing a saved copy — couldn’t refresh from the network.
        </p>
      )}
      {primary.status === 'offline' && !primary.chapter && (
        <p className="banner-inline warning" role="status">
          You appear to be offline and this chapter isn’t saved yet.
        </p>
      )}

      <div className="reader-layout">
        <div className="reader-column">
          <article className="reader-body">
            <h1 className="chapter-heading">
              {formatReference(book, chapter)}
              <span className="chapter-heading-translation">
                {primary.chapter ? primary.chapter.translationName : ''}
              </span>
            </h1>

            {primary.status === 'loading' && !primary.chapter && <ChapterSkeleton />}

            {primary.status === 'error' && !primary.chapter && (
              <div className="reader-error" role="alert">
                <p>Couldn’t load this chapter.</p>
                {primary.error && <p className="muted">{primary.error}</p>}
                <button type="button" className="button primary" onClick={primary.refetch}>
                  Try again
                </button>
              </div>
            )}

            {primary.chapter && !settings.parallelEnabled && (
              <ChapterView
                book={book}
                chapter={chapter}
                verses={verses}
                selectedVerse={selectedVerse}
                inlineActions={!showStudyPanel}
                onSelectVerse={setSelectedVerse}
                onOpenNote={setNoteVerse}
                onOpenContext={setContextVerse}
              />
            )}

            {settings.parallelEnabled && (
              <ParallelView
                book={book}
                chapter={chapter}
                primaryChapter={primary.chapter}
                selectedVerse={selectedVerse}
                inlineActions={!showStudyPanel}
                onSelectVerse={setSelectedVerse}
                onOpenNote={setNoteVerse}
                onOpenContext={setContextVerse}
              />
            )}

            {primary.chapter && (
              <ChapterAttribution translationId={primary.chapter.translationId} />
            )}
          </article>
        </div>

        {showStudyPanel && (
          <StudyPanel
            book={book}
            chapter={chapter}
            verse={selectedVerse}
            verses={verses}
            onOpenNote={(v) => setNoteVerse(v)}
            onClose={() => setStudyOpen(false)}
          />
        )}
      </div>

      <div className="reader-dock">
        <ChapterPager book={book} chapter={chapter} currentLabel={formatReference(book, chapter)} />
      </div>

      {noteKey && <NotePopover verseKey={noteKey} onClose={() => setNoteVerse(null)} />}

      {contextVerse != null && (
        <VerseContextPanel
          book={book}
          chapter={chapter}
          verse={contextVerse}
          translationId={settings.primaryTranslation}
          verses={verses}
          onClose={() => setContextVerse(null)}
        />
      )}
    </div>
  )
}

function ChapterSkeleton() {
  return (
    <div className="chapter-skeleton" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-line" style={{ width: `${70 + ((i * 13) % 30)}%` }} />
      ))}
    </div>
  )
}
