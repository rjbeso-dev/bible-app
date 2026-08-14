import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export interface AuthContextValue {
  user: User | null
  /** True while the initial session lookup is in flight. */
  loading: boolean
  /** True when Supabase is configured (accounts/sync are available at all). */
  enabled: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
