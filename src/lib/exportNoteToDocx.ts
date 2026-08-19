import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from 'docx'
import type { NoteBlock, TextBlock, TextRun as NoteRun } from './noteDocument'

const NUMBERED_LIST_REF = 'note-numbered-list'
const MAX_IMAGE_WIDTH = 500 // px, keeps images within a letter page's content width

function stripHash(hex: string): string {
  return hex.replace(/^#/, '')
}

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; type: 'png' | 'jpg' | 'gif' } {
  const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/)
  const mime = match?.[1] ?? 'png'
  const base64 = match?.[2] ?? dataUrl.split(',')[1] ?? ''
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const type = mime === 'jpeg' ? 'jpg' : (mime as 'png' | 'jpg' | 'gif')
  return { bytes, type }
}

function toTextRuns(runs: NoteRun[], baseItalic = false): TextRun[] {
  const out: TextRun[] = []
  for (const run of runs) {
    const segments = run.text.split('\n')
    segments.forEach((segment, i) => {
      if (i > 0) out.push(new TextRun({ break: 1 }))
      if (!segment) return
      out.push(
        new TextRun({
          text: segment,
          bold: run.bold,
          italics: run.italic || baseItalic,
          underline: run.underline ? {} : undefined,
          color: run.color ? stripHash(run.color) : undefined,
          shading: run.highlightColor
            ? { type: ShadingType.SOLID, fill: stripHash(run.highlightColor), color: 'auto' }
            : undefined,
        }),
      )
    })
  }
  return out
}

const HEADING_LEVEL: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  heading1: HeadingLevel.HEADING_1,
  heading2: HeadingLevel.HEADING_2,
  heading3: HeadingLevel.HEADING_3,
}

function textBlockToParagraph(block: TextBlock): Paragraph {
  if (block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3') {
    return new Paragraph({
      heading: HEADING_LEVEL[block.type],
      spacing: { before: 240, after: 100 },
      children: toTextRuns(block.runs),
    })
  }

  if (block.type === 'bullet') {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 60 },
      children: toTextRuns(block.runs),
    })
  }

  if (block.type === 'number') {
    return new Paragraph({
      numbering: { reference: NUMBERED_LIST_REF, level: 0 },
      spacing: { after: 60 },
      children: toTextRuns(block.runs),
    })
  }

  if (block.type === 'quote') {
    return new Paragraph({
      indent: { left: 360 },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C9C2B4', space: 8 } },
      spacing: { before: 120, after: 120 },
      children: toTextRuns(block.runs, true),
    })
  }

  return new Paragraph({
    spacing: { after: 160 },
    children: toTextRuns(block.runs),
  })
}

/** Render a note's parsed blocks into a .docx file and trigger a browser
 * download. Runs entirely client-side via the `docx` package — no backend. */
export async function exportNoteToDocx(blocks: NoteBlock[], fileName: string, title?: string) {
  const children: Paragraph[] = []

  if (title) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
        children: [new TextRun({ text: title, bold: true })],
      }),
    )
  }

  for (const block of blocks) {
    if (block.type === 'image') {
      const { bytes, type } = dataUrlToBytes(block.dataUrl)
      const scale = Math.min(1, MAX_IMAGE_WIDTH / block.width)
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          alignment: AlignmentType.LEFT,
          children: [
            new ImageRun({
              type,
              data: bytes,
              transformation: { width: block.width * scale, height: block.height * scale },
            }),
          ],
        }),
      )
      continue
    }
    children.push(textBlockToParagraph(block))
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: NUMBERED_LIST_REF,
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START }],
        },
      ],
    },
    sections: [{ children }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.docx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
