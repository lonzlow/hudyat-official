import 'server-only'
import sanitizeHtml from 'sanitize-html'

// Article bodies come in three shapes. Old articles are plain text (one paragraph per line) or a JSON
// list of paragraphs. Articles published from the CMS are HTML written in its Tiptap editor, which
// starts with a block tag such as <p>. A plain-text article cannot start that way, so this is safe to
// test for.
const HTML_BODY = /^\s*<(?:p|h[1-6]|ul|ol|blockquote|figure|div|img|pre|hr)[\s>/]/i

export function isHtmlBody(raw: string | null | undefined): raw is string {
  return typeof raw === 'string' && HTML_BODY.test(raw)
}

// The CMS sanitizes what it shows to staff, but the public site must not trust that: this runs on the
// server, on every request, and keeps only what the editor can produce.
export function sanitizeBodyHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a',
      'ul', 'ol', 'li', 'blockquote', 'br', 'hr', 'img', 'code', 'pre',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      // the editor's alignment buttons write style="text-align: …"; no other style is kept
      '*': ['style'],
    },
    allowedStyles: {
      '*': { 'text-align': [/^(?:left|center|right|justify)$/] },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      // the page already has an <h1>: article headings start at <h2>
      h1: 'h2',
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' },
      }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    },
  })
}
