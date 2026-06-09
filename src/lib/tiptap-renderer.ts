import type { Json } from '@/types/database'

// Jednoduchý renderer TipTap JSON → HTML bez externí závislosti
function renderNode(node: any): string {
  if (!node) return ''

  const marks = (node.marks ?? []).map((m: any) => m.type)
  let text = ''

  switch (node.type) {
    case 'doc':
      return (node.content ?? []).map(renderNode).join('')

    case 'paragraph':
      text = (node.content ?? []).map(renderNode).join('')
      return `<p>${text || '&nbsp;'}</p>`

    case 'heading': {
      const level = node.attrs?.level ?? 2
      text = (node.content ?? []).map(renderNode).join('')
      return `<h${level}>${text}</h${level}>`
    }

    case 'bulletList':
      return `<ul>${(node.content ?? []).map(renderNode).join('')}</ul>`

    case 'orderedList':
      return `<ol>${(node.content ?? []).map(renderNode).join('')}</ol>`

    case 'listItem':
      return `<li>${(node.content ?? []).map(renderNode).join('')}</li>`

    case 'blockquote':
      return `<blockquote>${(node.content ?? []).map(renderNode).join('')}</blockquote>`

    case 'horizontalRule':
      return '<hr />'

    case 'hardBreak':
      return '<br />'

    case 'image':
      return `<img src="${node.attrs?.src ?? ''}" alt="${node.attrs?.alt ?? ''}" />`

    case 'text': {
      text = node.text ?? ''
      // WP migrovaný HTML obsah — vrátit přímo bez escapování
      if (text.startsWith('__HTML__')) return text.slice(8)
      // Escapovat HTML
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      if (marks.includes('bold')) text = `<strong>${text}</strong>`
      if (marks.includes('italic')) text = `<em>${text}</em>`
      if (marks.includes('underline')) text = `<u>${text}</u>`
      if (marks.includes('strike')) text = `<s>${text}</s>`
      if (marks.includes('code')) text = `<code>${text}</code>`
      const linkMark = (node.marks ?? []).find((m: any) => m.type === 'link')
      if (linkMark) {
        text = `<a href="${linkMark.attrs?.href ?? '#'}" target="${linkMark.attrs?.target ?? '_blank'}" rel="noopener noreferrer">${text}</a>`
      }
      return text
    }

    default:
      return (node.content ?? []).map(renderNode).join('')
  }
}

function cleanWpContent(html: string): string {
  return html
    // Odstraň WP shortcodes (multiline, různé formy uvozovek)
    .replace(/\[\/?\w[\w-]*[\s\S]*?\]/g, '')
    // Odstraň prázdné odstavce
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '')
    .replace(/<p>&nbsp;<\/p>/gi, '')
    .trim()
}

export function tiptapToHtml(content: Json | null): string {
  if (!content) return ''
  if (typeof content === 'string') return cleanWpContent(content)

  // Migrovany WP HTML obsah
  const html = renderNode(content)
  if (html.startsWith('__HTML__')) return cleanWpContent(html.slice(8))
  return html
}
