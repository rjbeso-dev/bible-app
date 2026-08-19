// Walks a note's sanitized bodyHtml into a small structured model — the
// exact set of shapes the rich editor's toolbar can produce (see
// sanitizeNoteHtml's allowlist) — so the PDF and DOCX exporters share one
// parse instead of each re-deriving formatting from raw HTML.

export interface TextRun {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  /** Text color, as a hex string (e.g. "#d64545"). */
  color?: string
  /** Highlight background color, as a hex string. */
  highlightColor?: string
}

export interface TextBlock {
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet' | 'number' | 'quote'
  runs: TextRun[]
}

export interface ImageBlock {
  type: 'image'
  dataUrl: string
  /** Natural pixel dimensions, used to size the image proportionally. */
  width: number
  height: number
}

export type NoteBlock = TextBlock | ImageBlock

const BLOCK_TAGS: Record<string, TextBlock['type']> = {
  H1: 'heading1',
  H2: 'heading2',
  H3: 'heading3',
  P: 'paragraph',
  DIV: 'paragraph',
}

function rgbToHex(rgb: string): string | undefined {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return rgb.startsWith('#') ? rgb : undefined
  const [, r, g, b] = m
  return '#' + [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('')
}

type RunFormatting = Omit<TextRun, 'text'>

/** Collect the inline text runs within a block-level element (a heading,
 * paragraph, or list item), tracking bold/italic/underline/color/highlight
 * as they nest via b/strong/i/em/u/span/font. */
function collectRuns(node: Node, inherited: RunFormatting): TextRun[] {
  const runs: TextRun[] = []
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ''
      if (text) runs.push({ ...inherited, text })
      continue
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue
    const el = child as HTMLElement
    const tag = el.tagName
    if (tag === 'BR') {
      runs.push({ ...inherited, text: '\n' })
      continue
    }
    const next: RunFormatting = { ...inherited }
    if (tag === 'B' || tag === 'STRONG') next.bold = true
    if (tag === 'I' || tag === 'EM') next.italic = true
    if (tag === 'U') next.underline = true
    if (tag === 'FONT') {
      const color = el.getAttribute('color')
      if (color) next.color = color
    }
    if (el.style?.color) next.color = rgbToHex(el.style.color) ?? next.color
    if (el.style?.backgroundColor) {
      const bg = rgbToHex(el.style.backgroundColor)
      if (bg && bg !== '#000000') next.highlightColor = bg
    }
    runs.push(...collectRuns(el, next))
  }
  return runs
}

function imageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth || 200, height: img.naturalHeight || 200 })
    img.onerror = () => resolve({ width: 200, height: 200 })
    img.src = src
  })
}

/** Parse sanitized note HTML into an ordered list of blocks. Images resolve
 * their natural dimensions (needed to size them proportionally in the
 * export), so this is async. */
export async function parseNoteHtml(html: string): Promise<NoteBlock[]> {
  const container = document.createElement('div')
  container.innerHTML = html
  const blocks: NoteBlock[] = []

  for (const node of Array.from(container.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) blocks.push({ type: 'paragraph', runs: [{ text }] })
      continue
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue
    const el = node as HTMLElement

    if (el.tagName === 'IMG') {
      const src = el.getAttribute('src') ?? ''
      const dims = await imageDimensions(src)
      blocks.push({ type: 'image', dataUrl: src, ...dims })
      continue
    }

    if (el.tagName === 'UL' || el.tagName === 'OL') {
      const itemType = el.tagName === 'UL' ? 'bullet' : 'number'
      for (const li of Array.from(el.children)) {
        if (li.tagName !== 'LI') continue
        const runs = collectRuns(li, {})
        if (runs.length > 0) blocks.push({ type: itemType, runs })
      }
      continue
    }

    if (el.classList.contains('note-quote')) {
      const runs = collectRuns(el, {})
      if (runs.length > 0) blocks.push({ type: 'quote', runs })
      continue
    }

    const blockType = BLOCK_TAGS[el.tagName]
    if (blockType) {
      const runs = collectRuns(el, {})
      if (runs.length > 0) blocks.push({ type: blockType, runs })
      continue
    }

    // Anything else (a stray inline element at the top level) — treat its
    // own text as a paragraph rather than dropping it silently.
    const runs = collectRuns(el, {})
    if (runs.length > 0) blocks.push({ type: 'paragraph', runs })
  }

  return blocks
}

/** A safe filename stem from a note's title/reference, e.g. "Sunday_sermon". */
export function noteFileName(label: string): string {
  const trimmed = label.trim() || 'Note'
  return trimmed.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'Note'
}
