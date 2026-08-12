// Required copyright / attribution line shown beneath a displayed chapter.
// ESV and NLT mandate a short copyright notice; the free translations are
// attributed globally in the app footer, so they need nothing extra here.

interface ChapterAttributionProps {
  translationId: string
}

const NOTICES: Record<string, string> = {
  esv: 'Scripture quotations are from the ESV® Bible, © Crossway.',
  nlt: 'Holy Bible, New Living Translation, © Tyndale House Foundation.',
}

export function ChapterAttribution({ translationId }: ChapterAttributionProps) {
  const notice = NOTICES[translationId]
  if (!notice) return null
  return (
    <p className="chapter-attribution muted" role="note">
      {notice}
    </p>
  )
}
