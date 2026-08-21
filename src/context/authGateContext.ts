import { createContext } from 'react'

export interface AuthGateContextValue {
  /** Runs `action` immediately if signed in (or accounts aren't configured
   * at all). Otherwise shows the sign-in prompt and skips `action`. Returns
   * whether `action` ran, in case the caller needs to know. */
  requireAuth: (action: () => void, message?: string) => boolean
  /** Shows the sign-in prompt directly, with no gated action attached. */
  promptSignIn: (message?: string) => void
}

export const AuthGateContext = createContext<AuthGateContextValue | null>(null)
