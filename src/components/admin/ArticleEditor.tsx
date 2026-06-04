'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Article, ArticleCategory } from '@/types/database'

interface Props {
  article?: Article
  categories: ArticleCategory[]
  onSave: (data: FormData) => Promise<{ error?: string; slug?: string }>
  onDelete?: () => Promise<void>
}

export default function ArticleEditor({ article, categories, onSave, onDelete }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(
    article?.content
      ? (typeof article.content === 'string'
          ? article.content
          : JSON.stringify(article.content, null, 2))
      : ''
  )
  const [categoryId, setCategoryId] = useState(article?.category_id ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status ?? 'draft')
  const [heroImageUrl, setHeroImageUrl] = useState(article?.hero_image_url ?? '')

  function generateSlug(val: string) {
    return val
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!article) setSlug(generateSlug(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.set('title', title)
    formData.set('slug', slug)
    formData.set('excerpt', excerpt)
    formData.set('content', content)
    formData.set('category_id', categoryId)
    formData.set('status', status)
    formData.set('hero_image_url', heroImageUrl)

    startTransition(async () => {
      const result = await onSave(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/clanky')
        router.refresh()
      }
    })
  }

  async function handleDelete() {
    if (!onDelete) return
    if (!confirm('Opravdu smazat tento článek? Akce je nevratná.')) return
    await onDelete()
    router.push('/admin/clanky')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">
          {article ? 'Upravit článek' : 'Nový článek'}
        </h1>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Smazat
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-5 py-2 text-sm font-medium text-white hover:bg-[#a50d25] disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Ukládám...' : 'Uložit'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Název */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Název *</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            placeholder="Název článku"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">URL slug *</label>
          <div className="flex items-center rounded-lg border border-gray-200 focus-within:border-[#c8102e] focus-within:ring-1 focus-within:ring-[#c8102e] transition-colors">
            <span className="pl-4 text-sm text-gray-400 shrink-0">/novinky/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="flex-1 py-2.5 pr-4 text-[#0a0a0a] focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Kategorie + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Kategorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            >
              <option value="">— bez kategorie —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                  status === 'draft' ? 'bg-[#0a0a0a] text-white' : 'hover:bg-gray-50'
                }`}
              >
                <EyeOff className="h-3.5 w-3.5" /> Koncept
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                  status === 'published' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Publikováno
              </button>
            </div>
          </div>
        </div>

        {/* Hero obrázek */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            URL hlavního obrázku
          </label>
          <input
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            placeholder="https://..."
          />
          {heroImageUrl && (
            <img src={heroImageUrl} alt="" className="mt-2 h-32 w-full object-cover rounded-lg" />
          )}
        </div>

        {/* Perex */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Perex (krátký popis)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors resize-none"
            placeholder="Krátký popis článku zobrazený ve výpisu..."
          />
        </div>

        {/* Obsah */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Obsah článku</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors resize-y"
            placeholder="Obsah článku..."
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Piš prostý text nebo TipTap JSON. Plnohodnotný WYSIWYG editor přibude v další verzi.
          </p>
        </div>
      </div>
    </form>
  )
}
