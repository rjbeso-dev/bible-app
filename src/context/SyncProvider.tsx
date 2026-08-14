import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'
import { pullAndMerge, pushSnapshot } from '../lib/cloudSync'

const PUSH_DEBOUNCE_MS = 1500

/**
 * Drives cloud sync while signed in. On sign-in, pulls the cloud snapshot,
 * merges it with local data, writes the merge back to localStorage, then
 * reloads once so every hook re-hydrates from the merged state. While signed
 * in, listens for the `bsa:datachanged` event (dispatched by storage.ts on
 * every synced-key write) and debounce-pushes the local snapshot to the cloud.
 * A no-op tree when Supabase isn't configured or no one is signed in.
 */
export function SyncProvider({ children }: { children: ReactNode }) {
  const { user, enabled } = useAuth()
  const syncedUserId = useRef<string | null>(null)
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled || !user) {
      syncedUserId.current = null
      return
    }
    if (syncedUserId.current === user.id) return
    syncedUserId.current = user.id
    let cancelled = false
    pullAndMerge(user.id).then(() => {
      if (!cancelled) window.location.reload()
    })
    return () => {
      cancelled = true
    }
  }, [enabled, user])

  useEffect(() => {
    if (!enabled || !user) return
    const userId = user.id
    const onDataChanged = () => {
      if (pushTimer.current) clearTimeout(pushTimer.current)
      pushTimer.current = setTimeout(() => {
        pushSnapshot(userId)
      }, PUSH_DEBOUNCE_MS)
    }
    window.addEventListener('bsa:datachanged', onDataChanged)
    return () => {
      window.removeEventListener('bsa:datachanged', onDataChanged)
      if (pushTimer.current) clearTimeout(pushTimer.current)
    }
  }, [enabled, user])

  return <>{children}</>
}
