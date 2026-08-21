import { useContext } from 'react'
import { AuthGateContext, type AuthGateContextValue } from './authGateContext'

export function useAuthGate(): AuthGateContextValue {
  const ctx = useContext(AuthGateContext)
  if (!ctx) {
    throw new Error('useAuthGate must be used within an AuthGateProvider')
  }
  return ctx
}
