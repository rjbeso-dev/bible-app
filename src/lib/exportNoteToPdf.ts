import { jsPDF } from 'jspdf'
import type { NoteBlock, TextBlock, TextRun } from './noteDocument'

const MARGIN = 54 // 0.75in at 72dpi
const INK = '#1a1a1a'

const BLOCK_STYLE: Record<TextBlock['type'], { size: number; bold: boolean; italic: boolean; lineHeight: number; before: number }> = {
  heading1: { size: 20, bold: true, italic: false, lineHeight: 25, before: 16 },
  heading2: { size: 16, bold: true, italic: false, lineHeight: 21, before: 14 },
  heading3: { size: 13, bold: true, italic: false, lineHeight: 18, before: 12 },
  paragraph: { size: 11, bold: false, italic: false, lineHeight: 16, before: 8 },
  bullet: { size: 11, bold: false, italic: false, lineHeight: 16, before: 4 },
  number: { size: 11, bold: false, italic: false, lineHeight: 16, before: 4 },
  quote: { size: 11, bold: false, italic: true, lineHeight: 16, before: 10 },
}

function fontStyle(bold: boolean, italic: boolean): string {
  if (bold && italic) return 'bolditalic'
  if (bold) return 'bold'
  if (italic) return 'italic'
  return 'normal'
}

/** Split a run's text into tokens that can each be measured/placed as a
 * unit: whitespace runs, explicit newlines, and words. */
function tokenize(text: string): string[] {
  return text.split(/(\n|\s+)/).filter((t) => t.length > 0)
}

class PdfCursor {
  doc: jsPDF
  pageWidth: number
  pageHeight: number
  maxWidth: number
  y: number

  constructor(doc: jsPDF) {
    this.doc = doc
    this.pageWidth = doc.internal.pageSize.getWidth()
    this.pageHeight = doc.internal.pageSize.getHeight()
    this.maxWidth = this.pageWidth - MARGIN * 2
    this.y = MARGIN
  }

  ensureSpace(needed: number) {
    if (this.y + needed > this.pageHeight - MARGIN) {
      this.doc.addPage()
      this.y = MARGIN
    }
  }

  /** Word-wrap and draw a run list starting at (x, current y), honoring
   * per-run bold/italic/color/underline/highlight and explicit newlines.
   * Returns after advancing past the final line of this block. */
  flowRuns(runs: TextRun[], x0: number, width: number, size: number, lineHeight: number, baseBold: boolean, baseItalic: boolean) {
    const { doc } = this
    doc.setFontSize(size)
    let x = x0
    this.ensureSpace(lineHeight)
    for (const run of runs) {
      for (const token of tokenize(run.text)) {
        if (token === '\n') {
          this.y += lineHeight
          x = x0
          this.ensureSpace(lineHeight)
          continue
        }
        doc.setFont('helvetica', fontStyle(!!run.bold || baseBold, !!run.italic || baseItalic))
        const w = doc.getTextWidth(token)
        const isWhitespace = /^\s+$/.test(token)
        if (!isWhitespace && x + w > x0 + width && x > x0) {
          this.y += lineHeight
          x = x0
          this.ensureSpace(lineHeight)
        }
        if (isWhitespace) {
          x += w
          continue
        }
        if (run.highlightColor) {
          doc.setFillColor(run.highlightColor)
          doc.rect(x, this.y - size * 0.78, w, size * 1.15, 'F')
        }
        doc.setTextColor(run.color || INK)
        doc.text(token, x, this.y)
        if (run.underline) {
          doc.setDrawColor(run.color || INK)
          doc.setLineWidth(0.6)
          doc.line(x, this.y + 1.5, x + w, this.y + 1.5)
        }
        x += w
      }
    }
    this.y += lineHeight
  }
}

/** Render a note's parsed blocks into a jsPDF document and trigger a
 * browser download. Runs entirely client-side — no backend involved. */
export function exportNoteToPdf(blocks: NoteBlock[], fileName: string, title?: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const cursor = new PdfCursor(doc)

  if (title) {
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(INK)
    cursor.ensureSpace(28)
    doc.text(title, MARGIN, cursor.y)
    cursor.y += 30
  }

  for (const block of blocks) {
    if (block.type === 'image') {
      const maxImgWidth = cursor.maxWidth
      const scale = Math.min(1, maxImgWidth / block.width)
      const w = block.width * scale
      const h = block.height * scale
      cursor.ensureSpace(h + 12)
      const format = block.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
      doc.addImage(block.dataUrl, format, MARGIN, cursor.y, w, h)
      cursor.y += h + 12
      continue
    }

    const style = BLOCK_STYLE[block.type]
    cursor.y += style.before
    cursor.ensureSpace(style.lineHeight)

    if (block.type === 'bullet' || block.type === 'number') {
      const indent = 16
      const prefix = block.type === 'bullet' ? '•' : '•'
      doc.setFontSize(style.size)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(INK)
      doc.text(prefix, MARGIN, cursor.y)
      cursor.flowRuns(block.runs, MARGIN + indent, cursor.maxWidth - indent, style.size, style.lineHeight, style.bold, style.italic)
      continue
    }

    if (block.type === 'quote') {
      const indent = 14
      const startY = cursor.y - style.size * 0.78
      cursor.flowRuns(block.runs, MARGIN + indent, cursor.maxWidth - indent, style.size, style.lineHeight, style.bold, style.italic)
      const endY = cursor.y - style.lineHeight + style.size * 0.4
      doc.setDrawColor('#c9c2b4')
      doc.setLineWidth(2)
      doc.line(MARGIN + 2, startY, MARGIN + 2, endY)
      continue
    }

    cursor.flowRuns(block.runs, MARGIN, cursor.maxWidth, style.size, style.lineHeight, style.bold, style.italic)
  }

  doc.save(`${fileName}.pdf`)
}
