// API.Bible's Fair Use Management System: reporting a view lets them show
// publishers (Zondervan/NIV, Lockman/AMP+NASB) that their licensed text is
// being used within the terms of the free tier. Required by their terms of
// use — see https://docs.api.bible/guides/fair-use/. The queue-shim in
// index.html means this is safe to call before the script has loaded.
declare global {
  interface Window {
    fums?: (...args: unknown[]) => void
  }
}

/** Report that the user was just shown scripture fetched with this token. */
export function reportFumsView(fumsToken: string | undefined | null): void {
  if (!fumsToken || typeof window === 'undefined' || !window.fums) return
  window.fums('trackView', fumsToken)
}
