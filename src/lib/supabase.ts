// Optional Supabase client for account sign-in and cloud sync.
//
// The app is local-first: with no VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// set, `isSupabaseConfigured` is false and `supabase` is null. Every caller
// must gate on `isSupabaseConfigured` so the app behaves exactly as before
// when no account backend is configured.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** True when both Supabase env vars are present, i.e. accounts/sync are available. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// The anon key is public/safe to ship to the browser — Row-Level Security on
// the Supabase tables is what actually protects each user's data.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
