import DOMPurify from 'dompurify'

// The rich note editor's toolbar only ever produces these tags/attributes
// (via document.execCommand), but contentEditable also accepts paste from
// anywhere — arbitrary clipboard HTML included. Sanitize on both save and
// load so nothing outside this allowlist ever reaches innerHTML.
const ALLOWED_TAGS = [
  'p', 'div', 'br', 'b', 'strong', 'i', 'em', 'u', 'span', 'font',
  'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'img',
]
// class is limited to values this app defines its own CSS for (e.g. the
// inserted-verse-quote block) — an attacker-controlled class name can only
// pick up styling we already wrote, never inject new CSS.
const ALLOWED_ATTR = ['style', 'face', 'color', 'size', 'class', 'src', 'alt']

/** Escape plain text and turn newlines into <br> so older notes (or the
 * quick verse-note popover, which stays plain text) load into the rich
 * editor without losing their line breaks. */
export function plainTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(/\n/g, '<br>')
}

export function sanitizeNoteHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // img's src is the only URL-bearing attribute allowed, and only ever
    // as an embedded data: image — never a remote http(s) URL, which would
    // let arbitrary pasted HTML load a tracking pixel or exfiltrate the
    // fact this note was opened. Attached images are stored inline, not
    // linked, so this doesn't restrict the actual feature.
    ALLOWED_URI_REGEXP: /^data:image\//,
  })
}
