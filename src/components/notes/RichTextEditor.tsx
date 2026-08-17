import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { Icon } from '../ui/Icon'
import { sanitizeNoteHtml } from '../../lib/sanitizeNoteHtml'

const FONT_STACKS: { label: string; value: string }[] = [
  { label: 'Serif', value: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif" },
  { label: 'Sans', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Comfort', value: "'Atkinson Hyperlegible', Verdana, Tahoma, system-ui, sans-serif" },
  { label: 'Mono', value: "'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace" },
]

// execCommand('fontSize', ...) uses the legacy HTML 1-7 scale, not px.
const FONT_SIZES: { label: string; value: string }[] = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Large', value: '5' },
  { label: 'X-Large', value: '6' },
]

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', hex: '#fde88a' },
  { name: 'Green', hex: '#bfe6b6' },
  { name: 'Blue', hex: '#b6d9f2' },
  { name: 'Pink', hex: '#f6c2d6' },
  { name: 'Orange', hex: '#f8cf9a' },
]

export interface RichTextEditorHandle {
  /** Insert HTML at the last known cursor position (works even if focus is
   * currently elsewhere, e.g. the user just clicked a verse in the side panel). */
  insertHtml: (html: string) => void
  focus: () => void
}

interface RichTextEditorProps {
  initialHtml: string
  placeholder?: string
  onChange: (html: string, plainText: string) => void
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor({ initialHtml, placeholder, onChange }, ref) {
    const editorRef = useRef<HTMLDivElement>(null)
    const savedRangeRef = useRef<Range | null>(null)
    const didInit = useRef(false)

    // Set the starting content once; after that the DOM is the source of
    // truth (re-setting innerHTML on every keystroke would fight the caret).
    useEffect(() => {
      if (didInit.current || !editorRef.current) return
      editorRef.current.innerHTML = sanitizeNoteHtml(initialHtml)
      didInit.current = true
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const saveRange = useCallback(() => {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0 || !editorRef.current) return
      const range = sel.getRangeAt(0)
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange()
      }
    }, [])

    const emitChange = useCallback(() => {
      const el = editorRef.current
      if (!el) return
      onChange(el.innerHTML, el.innerText)
    }, [onChange])

    const exec = useCallback(
      (command: string, value?: string) => {
        editorRef.current?.focus()
        document.execCommand(command, false, value)
        emitChange()
      },
      [emitChange],
    )

    const highlight = useCallback(
      (hex: string | null) => {
        editorRef.current?.focus()
        document.execCommand('hiliteColor', false, hex ?? 'transparent')
        if (hex) document.execCommand('foreColor', false, '#1a1a1a')
        emitChange()
      },
      [emitChange],
    )

    useImperativeHandle(ref, () => ({
      insertHtml: (html: string) => {
        const el = editorRef.current
        if (!el) return
        el.focus()

        // Insert via the Range API rather than execCommand('insertHTML'):
        // that command re-merges the inserted markup with whatever inline
        // formatting is active at the caret (observed producing stray
        // font-size/background-color spans around an inserted verse quote),
        // where Range.insertNode() places exactly the nodes we built.
        let range: Range
        if (savedRangeRef.current && el.contains(savedRangeRef.current.commonAncestorContainer)) {
          range = savedRangeRef.current
        } else {
          range = document.createRange()
          range.selectNodeContents(el)
          range.collapse(false)
        }

        const template = document.createElement('template')
        template.innerHTML = sanitizeNoteHtml(html)
        const fragment = template.content
        const lastNode = fragment.lastChild

        range.deleteContents()
        range.insertNode(fragment)

        if (lastNode) {
          const sel = window.getSelection()
          const after = document.createRange()
          after.setStartAfter(lastNode)
          after.collapse(true)
          sel?.removeAllRanges()
          sel?.addRange(after)
          savedRangeRef.current = after.cloneRange()
        }

        emitChange()
      },
      focus: () => editorRef.current?.focus(),
    }))

    return (
      <div className="rich-editor">
        <div className="rich-editor-toolbar" role="toolbar" aria-label="Formatting">
          <ToolbarButton label="Bold" icon="bold" onClick={() => exec('bold')} />
          <ToolbarButton label="Italic" icon="italic" onClick={() => exec('italic')} />
          <ToolbarButton label="Underline" icon="underline" onClick={() => exec('underline')} />

          <span className="rich-editor-toolbar-divider" aria-hidden="true" />

          <select
            className="rich-editor-select"
            aria-label="Heading"
            defaultValue="P"
            onMouseDown={saveRange}
            onChange={(e) => {
              exec('formatBlock', e.target.value)
              e.target.value = 'P'
            }}
          >
            <option value="P">Paragraph</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
          </select>

          <ToolbarButton
            label="Bulleted list"
            icon="list"
            onClick={() => exec('insertUnorderedList')}
          />
          <ToolbarButton
            label="Numbered list"
            icon="list-ordered"
            onClick={() => exec('insertOrderedList')}
          />

          <span className="rich-editor-toolbar-divider" aria-hidden="true" />

          <div className="rich-editor-swatches" role="group" aria-label="Highlight color">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                className="rich-editor-swatch"
                style={{ background: c.hex }}
                aria-label={`Highlight ${c.name}`}
                title={`Highlight ${c.name}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => highlight(c.hex)}
              />
            ))}
            <button
              type="button"
              className="rich-editor-swatch rich-editor-swatch-none"
              aria-label="Remove highlight"
              title="Remove highlight"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => highlight(null)}
            >
              <Icon name="close" size={12} />
            </button>
          </div>

          <span className="rich-editor-toolbar-divider" aria-hidden="true" />

          <select
            className="rich-editor-select"
            aria-label="Font"
            defaultValue=""
            onMouseDown={saveRange}
            onChange={(e) => {
              if (e.target.value) exec('fontName', e.target.value)
              e.target.value = ''
            }}
          >
            <option value="" disabled>
              Font
            </option>
            {FONT_STACKS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            className="rich-editor-select"
            aria-label="Font size"
            defaultValue=""
            onMouseDown={saveRange}
            onChange={(e) => {
              if (e.target.value) exec('fontSize', e.target.value)
              e.target.value = ''
            }}
          >
            <option value="" disabled>
              Size
            </option>
            {FONT_SIZES.map((s) => (
              <option key={s.label} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div
          ref={editorRef}
          className="rich-editor-body"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={emitChange}
          onBlur={saveRange}
          onKeyUp={saveRange}
          onMouseUp={saveRange}
        />
      </div>
    )
  },
)

interface ToolbarButtonProps {
  label: string
  icon: Parameters<typeof Icon>[0]['name']
  onClick: () => void
}

function ToolbarButton({ label, icon, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className="rich-editor-tool"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
    </button>
  )
}
