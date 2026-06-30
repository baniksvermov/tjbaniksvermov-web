'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Trash2, Eye, EyeOff, Upload, X, Loader2, LayoutGrid, Columns2, Square } from 'lucide-react'
import type { Article, ArticleCategory } from '@/types/database'

interface Props {
  article?: Article
  categories: ArticleCategory[]
  onSave: (data: FormData) => Promise<{ error?: string; slug?: string }>
  onDelete?: () => Promise<void>
}

type Layout = 'carousel' | 'side-by-side' | 'single'

const LAYOUTS: { value: Layout; label: string; icon: React.ReactNode }[] = [
  { value: 'carousel', label: 'Carousel', icon: <LayoutGrid className="h-4 w-4" /> },
  { value: 'side-by-side', label: 'Vedle sebe', icon: <Columns2 className="h-4 w-4" /> },
  { value: 'single', label: 'Jeden velký', icon: <Square className="h-4 w-4" /> },
]

interface ImgItem {
  url: string
  uploading?: boolean
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

  // Hero image
  const [heroUploading, setHeroUploading] = useState(false)
  const [heroUrl, setHeroUrl] = useState(article?.hero_image_url ?? '')
  const heroRef = useRef<HTMLInputElement>(null)

  // Gallery
  const [gallery, setGallery] = useState<ImgItem[]>(
    (article?.gallery_images ?? []).map((url) => ({ url }))
  )
  const [layout, setLayout] = useState<Layout>(article?.gallery_layout ?? 'carousel')
  const galleryRef = useRef<HTMLInputElement>(null)

  // YouTube
  const [youtubeUrl, setYoutubeUrl] = useState(article?.youtube_url ?? '')

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

  async function uploadHero(file: File) {
    setHeroUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload-article-image', { method: 'POST', body: fd })
    const data = await res.json()
    setHeroUploading(false)
    if (data.url) setHeroUrl(data.url)
    else setError(data.error ?? 'Chyba nahrávání')
  }

  async function addGalleryImages(files: FileList | null) {
    if (!files) return
    const slots = Array.from(files).slice(0, 3 - gallery.length)
    const placeholders: ImgItem[] = slots.map(() => ({ url: '', uploading: true }))
    setGallery((prev) => [...prev, ...placeholders])

    for (const file of slots) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload-article-image', { method: 'POST', body: fd })
      const data = await res.json()
      setGallery((prev) => {
        const updated = [...prev]
        const idx = updated.findIndex((x) => x.uploading && !x.url)
        if (idx !== -1) updated[idx] = { url: data.url ?? '', uploading: false }
        return updated
      })
    }
  }

  function removeGalleryImg(idx: number) {
    setGallery((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (gallery.some((i) => i.uploading)) return setError('Počkejte na dokončení nahrávání fotek.')

    const formData = new FormData()
    formData.set('title', title)
    formData.set('slug', slug)
    formData.set('excerpt', excerpt)
    formData.set('content', content)
    formData.set('category_id', categoryId)
    formData.set('status', status)
    formData.set('hero_image_url', heroUrl)
    formData.set('gallery_images', JSON.stringify(gallery.filter((i) => i.url).map((i) => i.url)))
    formData.set('gallery_layout', layout)
    formData.set('youtube_url', youtubeUrl.trim())

    startTransition(async () => {
      const result = await onSave(formData)
      if (result?.error) {
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
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* ZÁKLADNÍ INFO */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#0a0a0a]">Základní informace</h2>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Název *</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
            placeholder="Název článku"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">URL slug *</label>
          <div className="flex items-center rounded-lg border border-gray-200 focus-within:border-[#c8102e] focus-within:ring-1 focus-within:ring-[#c8102e]">
            <span className="pl-4 text-sm text-gray-400 shrink-0">/novinky/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="flex-1 py-2.5 pr-4 text-[#0a0a0a] focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Kategorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
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
              <button type="button" onClick={() => setStatus('draft')}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                  status === 'draft' ? 'bg-[#0a0a0a] text-white' : 'hover:bg-gray-50'
                }`}>
                <EyeOff className="h-3.5 w-3.5" /> Koncept
              </button>
              <button type="button" onClick={() => setStatus('published')}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                  status === 'published' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'
                }`}>
                <Eye className="h-3.5 w-3.5" /> Publikováno
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Perex (krátký popis)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] resize-none"
            placeholder="Krátký popis článku zobrazený ve výpisu..."
          />
        </div>
      </section>

      {/* HLAVNÍ OBRÁZEK */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#0a0a0a]">Hlavní obrázek (hero)</h2>
        <p className="text-xs text-gray-400">Zobrazuje se v záhlaví článku a při sdílení na sociálních sítích.</p>

        {heroUrl ? (
          <div className="relative">
            <img src={heroUrl} alt="" className="w-full h-48 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => setHeroUrl('')}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => heroRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-8 cursor-pointer hover:border-[#c8102e] transition-colors"
          >
            {heroUploading
              ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              : <Upload className="h-6 w-6 text-gray-300" />}
            <p className="text-sm text-gray-500">{heroUploading ? 'Nahrávám...' : 'Klikněte pro nahrání obrázku'}</p>
          </div>
        )}
        <input
          ref={heroRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0])}
        />
      </section>

      {/* GALERIE */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-[#0a0a0a]">Fotogalerie</h2>
          <p className="text-xs text-gray-400 mt-0.5">Až 3 fotky zobrazené pod textem článku.</p>
        </div>

        {/* Layout výběr */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Způsob zobrazení:</p>
          <div className="flex gap-2">
            {LAYOUTS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLayout(l.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                  layout === l.value
                    ? 'border-[#c8102e] bg-[#c8102e]/5 text-[#c8102e] font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {l.icon} {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload + preview */}
        <div className="grid grid-cols-3 gap-3">
          {gallery.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {img.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeGalleryImg(i)}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {gallery.length < 3 && (
            <div
              onClick={() => galleryRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#c8102e] transition-colors"
            >
              <Upload className="h-5 w-5 text-gray-300" />
              <span className="text-xs text-gray-400">Přidat foto</span>
            </div>
          )}
        </div>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addGalleryImages(e.target.files)}
        />
      </section>

      {/* YOUTUBE */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#0a0a0a]">YouTube video</h2>
        <p className="text-xs text-gray-400">Vložte odkaz na YouTube video — zobrazí se pod textem článku.</p>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
        />
        {youtubeUrl && getYouTubeId(youtubeUrl) && (
          <div className="rounded-xl overflow-hidden aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(youtubeUrl)}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </section>

      {/* OBSAH */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#0a0a0a]">Text článku</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm text-[#0a0a0a] focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] resize-y"
          placeholder="Obsah článku..."
        />
        <p className="text-xs text-gray-400">Piš prostý text nebo TipTap JSON.</p>
      </section>
    </form>
  )
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    return u.searchParams.get('v')
  } catch {
    return null
  }
}
