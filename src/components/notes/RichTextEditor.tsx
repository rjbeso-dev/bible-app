import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Icon, type IconName } from '../ui/Icon'
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

// Saturated enough to read as intentional text color against either theme's
// surface, unlike the pale HIGHLIGHT_COLORS above (which are backgrounds).
const FONT_COLORS = [
  { name: 'Red', hex: '#d64545' },
  { name: 'Orange', hex: '#d98736' },
  { name: 'Green', hex: '#4f9d5c' },
  { name: 'Blue', hex: '#4a7fd6' },
  { name: 'Purple', hex: '#8b5fc9' },
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
    const [lastHighlight, setLastHighlight] = useState(HIGHLIGHT_COLORS[0].hex)
    const [lastFontColor, setLastFontColor] = useState(FONT_COLORS[0].hex)

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

    // Popovers (the color pickers) live outside the contentEditable's DOM
    // subtree, so clicking a swatch would otherwise leave whatever the
    // browser's default click behavior did to the selection. Restoring the
    // range captured right when the picker opened puts it back exactly
    // where the user left it, the same trick insertHtml uses.
    const restoreSelection = useCallback(() => {
      const el = editorRef.current
      if (!el) return
      el.focus()
      const sel = window.getSelection()
      if (sel && savedRangeRef.current && el.contains(savedRangeRef.current.commonAncestorContainer)) {
        sel.removeAllRanges()
        sel.addRange(savedRangeRef.current)
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
        restoreSelection()
        document.execCommand('hiliteColor', false, hex ?? 'transparent')
        if (hex) {
          document.execCommand('foreColor', false, '#1a1a1a')
          setLastHighlight(hex)
        }
        emitChange()
      },
      [restoreSelection, emitChange],
    )

    const fontColor = useCallback(
      (hex: string | null) => {
        const el = editorRef.current
        if (!el) return
        restoreSelection()
        // execCommand('foreColor', ...) doesn't understand cascade
        // keywords — passing 'inherit' was observed applying
        // rgba(0,0,0,0) (fully transparent, i.e. invisible text)
        // rather than resetting anything. Resolve the theme's actual
        // text color first so "default" sets a real, opaque value.
        const resetColor = hex ?? getComputedStyle(el).color
        document.execCommand('foreColor', false, resetColor)
        if (hex) setLastFontColor(hex)
        emitChange()
      },
      [restoreSelection, emitChange],
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

          <ColorPickerButton
            label="Highlight color"
            icon="highlighter"
            colors={HIGHLIGHT_COLORS}
            activeColor={lastHighlight}
            noneLabel="Remove highlight"
            onOpen={saveRange}
            onPick={highlight}
          />
          <ColorPickerButton
            label="Text color"
            letter="A"
            colors={FONT_COLORS}
            activeColor={lastFontColor}
            noneLabel="Default text color"
            onOpen={saveRange}
            onPick={fontColor}
          />

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
  icon: IconName
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

interface ColorPickerButtonProps {
  label: string
  icon?: IconName
  /** Shown instead of an icon for the text-color tool, Word-style. */
  letter?: string
  colors: { name: string; hex: string }[]
  activeColor: string
  noneLabel: string
  /** Called right as the popover opens, to capture the selection before
   * any click inside the popover has a chance to disturb it. */
  onOpen: () => void
  onPick: (hex: string | null) => void
}

/** A Word-style color tool: a button showing the last-used color as an
 * underline bar, opening a dropdown grid of swatches on click. */
function ColorPickerButton({
  label,
  icon,
  letter,
  colors,
  activeColor,
  noneLabel,
  onOpen,
  onPick,
}: ColorPickerButtonProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="rich-editor-color-picker">
      <button
        type="button"
        className="rich-editor-tool rich-editor-color-trigger"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={open}
        title={label}
        onMouseDown={(e) => {
          e.preventDefault()
          onOpen()
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {icon ? <Icon name={icon} size={16} /> : <span className="rich-editor-color-letter">{letter}</span>}
        <span className="rich-editor-color-bar" style={{ background: activeColor }} aria-hidden="true" />
      </button>

      {open && (
        <>
          <div className="popover-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="rich-editor-color-popover" role="menu" aria-label={label}>
            <div className="rich-editor-color-grid">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  role="menuitem"
                  className="rich-editor-swatch"
                  style={{ background: c.hex }}
                  aria-label={c.name}
                  title={c.name}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPick(c.hex)
                    setOpen(false)
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              role="menuitem"
              className="rich-editor-color-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onPick(null)
                setOpen(false)
              }}
            >
              <Icon name="close" size={14} /> {noneLabel}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
