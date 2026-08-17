import DOMPurify from 'dompurify'

// The rich note editor's toolbar only ever produces these tags/attributes
// (via document.execCommand), but contentEditable also accepts paste from
// anywhere — arbitrary clipboard HTML included. Sanitize on both save and
// load so nothing outside this allowlist ever reaches innerHTML.
const ALLOWED_TAGS = [
  'p', 'div', 'br', 'b', 'strong', 'i', 'em', 'u', 'span', 'font',
  'h1', 'h2', 'h3', 'ul', 'ol', 'li',
]
// class is limited to values this app defines its own CSS for (e.g. the
// inserted-verse-quote block) — an attacker-controlled class name can only
// pick up styling we already wrote, never inject new CSS.
const ALLOWED_ATTR = ['style', 'face', 'color', 'size', 'class']

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
    // No tag here takes a URL attribute (no <a>/<img>/<iframe>), so refuse
    // any anyway — belt and suspenders against a future allowlist edit.
    ALLOWED_URI_REGEXP: /^$/,
  })
}
