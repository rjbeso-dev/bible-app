import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'
import { AuthGateContext, type AuthGateContextValue } from './authGateContext'
import { SignInGateModal } from '../components/account/SignInGateModal'

const DEFAULT_MESSAGE = 'Sign in to save your progress.'

/**
 * Gates write actions (highlighting, adding notes) behind sign-in. When
 * accounts aren't configured at all (`enabled: false`, e.g. local dev
 * without Supabase env vars) everything passes through unblocked — there'd
 * be no sign-in flow to send anyone to.
 */
export function AuthGateProvider({ children }: { children: ReactNode }) {
  const { user, enabled } = useAuth()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  const promptSignIn = useCallback((msg?: string) => {
    setMessage(msg ?? DEFAULT_MESSAGE)
    setOpen(true)
  }, [])

  const requireAuth = useCallback(
    (action: () => void, msg?: string) => {
      if (!enabled || user) {
        action()
        return true
      }
      promptSignIn(msg)
      return false
    },
    [enabled, user, promptSignIn],
  )

  const value = useMemo<AuthGateContextValue>(
    () => ({ requireAuth, promptSignIn }),
    [requireAuth, promptSignIn],
  )

  return (
    <AuthGateContext value={value}>
      {children}
      {enabled && <SignInGateModal open={open} message={message} onClose={() => setOpen(false)} />}
    </AuthGateContext>
  )
}
