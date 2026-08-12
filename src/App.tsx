import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { DashboardPage } from './pages/DashboardPage'
import { ReaderPage } from './pages/ReaderPage'
import { NotesPage } from './pages/NotesPage'
import { readLastRead } from './hooks/useLastRead'

function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

/** Redirect "/read" to the reader at the last-read location. */
function ReadRedirect() {
  const last = readLastRead()
  return (
    <Navigate to={`/read/${encodeURIComponent(last.book)}/${last.chapter}`} replace />
  )
}

export default function App() {
  const online = useOnlineStatus()

  return (
    <div className="app-shell">
      <Header />

      {!online && (
        <div className="offline-banner" role="status">
          You’re offline. Chapters you’ve already opened are still available.
        </div>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/read" element={<ReadRedirect />} />
          <Route path="/read/:book/:chapter" element={<ReaderPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
