// Thin wrapper around the browser View Transitions API. Used for the theme
// toggle's circular-reveal animation. Feature-detected and reduced-motion
// aware: on unsupported browsers (or with reduced motion requested) `apply`
// just runs immediately, so callers never need their own fallback branch.

function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    )
  } catch {
    return false
  }
}

/** Run `apply` (a synchronous DOM/state mutation) as a smooth view transition. */
export function withViewTransition(apply: () => void): void {
  const start = typeof document !== 'undefined' ? document.startViewTransition : undefined
  if (typeof start !== 'function' || prefersReducedMotion()) {
    apply()
    return
  }
  start.call(document, apply)
}

/** Set the CSS custom properties the theme-reveal animation expands from. */
export function setTransitionOrigin(x: number, y: number): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
}
