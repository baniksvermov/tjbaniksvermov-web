'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X, Upload, Loader2, ChevronLeft, Plus } from 'lucide-react'

const CATEGORIES = [
  { id: '', name: 'Vyberte kategorii…' },
]

const PRESET_COLORS = [
  { label: 'Červená', dots: ['#C8102E'] },
  { label: 'Červeno-bílá', dots: ['#C8102E', '#FFFFFF'] },
  { label: 'Černo-červená', dots: ['#1a1a1a', '#C8102E'] },
  { label: 'Černá', dots: ['#1a1a1a'] },
  { label: 'Bílá', dots: ['#FFFFFF'] },
  { label: 'Modrá', dots: ['#003087'] },
  { label: 'Tmavě modrá', dots: ['#001F5B'] },
  { label: 'Zelená', dots: ['#006747'] },
]

const SIZES_DETSKA = ['116', '122', '128', '134', '140', '146', '152', '158', '164']
const SIZES_DOSPELA = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

interface ImgItem {
  url: string
  uploading?: boolean
  error?: string
}

interface Variant {
  enabled: boolean
  price: string
  sizes: string[]
}

export default function NovyProduktPage() {
  const router = useRouter()

  // Categories fetched client-side
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [catsLoaded, setCatsLoaded] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [colors, setColors] = useState<string[]>([])
  const [customColor, setCustomColor] = useState('')
  const [images, setImages] = useState<ImgItem[]>([])
  const [jakoSku, setJakoSku] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [detska, setDetska] = useState<Variant>({ enabled: true, price: '', sizes: [...SIZES_DETSKA] })
  const [dospela, setDospela] = useState<Variant>({ enabled: true, price: '', sizes: [...SIZES_DOSPELA] })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  // Load categories on first focus of select
  async function loadCategories() {
    if (catsLoaded) return
    setCatsLoaded(true)
    const res = await fetch('/api/admin/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const newItems: ImgItem[] = Array.from(files).map(() => ({ url: '', uploading: true }))
    setImages((prev) => [...prev, ...newItems])

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fd = new FormData()
      fd.append('file', file)

      try {
        const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
        const data = await res.json()
        setImages((prev) => {
          const updated = [...prev]
          const idx = updated.findIndex((x) => x.uploading && !x.url)
          if (idx !== -1) updated[idx] = { url: data.url ?? '', uploading: false, error: data.error }
          return updated
        })
      } catch {
        setImages((prev) => {
          const updated = [...prev]
          const idx = updated.findIndex((x) => x.uploading && !x.url)
          if (idx !== -1) updated[idx] = { url: '', uploading: false, error: 'Chyba nahrávání' }
          return updated
        })
      }
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function toggleColor(label: string) {
    setColors((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    )
  }

  function addCustomColor() {
    const c = customColor.trim()
    if (c && !colors.includes(c)) setColors((prev) => [...prev, c])
    setCustomColor('')
  }

  function toggleSize(variant: 'detska' | 'dospela', size: string) {
    const setter = variant === 'detska' ? setDetska : setDospela
    setter((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  function selectAllSizes(variant: 'detska' | 'dospela') {
    const all = variant === 'detska' ? SIZES_DETSKA : SIZES_DOSPELA
    const setter = variant === 'detska' ? setDetska : setDospela
    setter((prev) => ({ ...prev, sizes: [...all] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Zadejte název produktu.')
    if (!categoryId) return setError('Vyberte kategorii.')
    if (!detska.enabled && !dospela.enabled) return setError('Zvolte alespoň jednu variantu (dětská nebo dospělá).')
    if (detska.enabled && (!detska.price || Number(detska.price) <= 0)) return setError('Zadejte cenu dětské varianty.')
    if (dospela.enabled && (!dospela.price || Number(dospela.price) <= 0)) return setError('Zadejte cenu dospělé varianty.')
    if (images.some((i) => i.uploading)) return setError('Počkejte na dokončení nahrávání fotek.')

    const variants = []
    if (detska.enabled) variants.push({ type: 'detska', price: Number(detska.price), sizes: detska.sizes })
    if (dospela.enabled) variants.push({ type: 'dospela', price: Number(dospela.price), sizes: dospela.sizes })

    setSaving(true)
    const res = await fetch('/api/admin/save-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category_id: categoryId,
        description,
        colors,
        images: images.filter((i) => i.url).map((i) => i.url),
        jako_sku: jakoSku,
        status,
        variants,
      }),
    })
    setSaving(false)

    const data = await res.json()
    if (!res.ok || data.error) return setError(data.error ?? 'Chyba při ukládání.')

    router.push('/admin/produkty')
    router.refresh()
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/produkty" className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Nový produkt</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vytvoří dětskou a/nebo dospělou variantu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ZÁKLADNÍ INFO */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#0a0a0a]">Základní informace</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Název artiklu *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="např. Bunda s kapucí Sonic"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
            />
            <p className="text-xs text-gray-400 mt-1">Varianty se vytvoří jako „{name || 'Název'} — dětská" a „{name || 'Název'} — dospělá"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              onFocus={loadCategories}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
            >
              <option value="">Vyberte kategorii…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {!catsLoaded && <option value="" disabled>Načítání…</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">JAKO SKU (kód produktu)</label>
            <input
              type="text"
              value={jakoSku}
              onChange={(e) => setJakoSku(e.target.value)}
              placeholder="např. 6826"
              className="w-40 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
            />
          </div>
        </section>

        {/* POPIS */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#0a0a0a]">Popis produktu</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Popis materiálu, vlastností, technologií…"
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] resize-y"
          />
        </section>

        {/* BARVY */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#0a0a0a]">Barvy</h2>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => {
              const active = colors.includes(c.label)
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => toggleColor(c.label)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all ${
                    active
                      ? 'border-[#c8102e] bg-[#c8102e]/5 font-medium text-[#c8102e]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="flex gap-0.5">
                    {c.dots.map((dot, i) => (
                      <span
                        key={i}
                        className="inline-block h-3.5 w-3.5 rounded-full border border-gray-200"
                        style={{ backgroundColor: dot }}
                      />
                    ))}
                  </span>
                  {c.label}
                </button>
              )
            })}
          </div>

          {/* Vlastní barva */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
              placeholder="Vlastní barva…"
              className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c8102e] focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomColor}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-gray-400"
            >
              <Plus className="h-3.5 w-3.5" /> Přidat
            </button>
          </div>

          {/* Vybrané barvy */}
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <span key={c} className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">
                  {c}
                  <button type="button" onClick={() => setColors((prev) => prev.filter((x) => x !== c))}>
                    <X className="h-3 w-3 text-gray-400 hover:text-gray-700" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* FOTOGRAFIE */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#0a0a0a]">Fotografie</h2>

          {/* Upload zone */}
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-8 cursor-pointer hover:border-[#c8102e] transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          >
            <Upload className="h-8 w-8 text-gray-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Přetáhněte fotky nebo klikněte pro výběr</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · max 5 MB</p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {img.uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : img.error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                  ) : (
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VARIANTY */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 space-y-6">
          <h2 className="font-semibold text-[#0a0a0a]">Varianty a ceny</h2>

          {/* Dětská */}
          <div className={`rounded-lg border p-4 space-y-4 transition-opacity ${detska.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={detska.enabled}
                  onChange={(e) => setDetska((p) => ({ ...p, enabled: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]"
                />
                <span className="font-medium text-sm">Dětská varianta</span>
                <span className="text-xs text-gray-400">(116–164)</span>
              </label>
              {detska.enabled && (
                <button type="button" onClick={() => selectAllSizes('detska')} className="text-xs text-[#c8102e] hover:underline">
                  Vybrat vše
                </button>
              )}
            </div>

            {detska.enabled && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={detska.price}
                    onChange={(e) => setDetska((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0"
                    min={0}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
                  />
                  <span className="text-sm text-gray-500">Kč</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Dostupné velikosti:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES_DETSKA.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize('detska', s)}
                        className={`rounded px-2.5 py-1 text-xs font-medium border transition-all ${
                          detska.sizes.includes(s)
                            ? 'border-[#c8102e] bg-[#c8102e] text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dospělá */}
          <div className={`rounded-lg border p-4 space-y-4 transition-opacity ${dospela.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dospela.enabled}
                  onChange={(e) => setDospela((p) => ({ ...p, enabled: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]"
                />
                <span className="font-medium text-sm">Dospělá varianta</span>
                <span className="text-xs text-gray-400">(XS–4XL)</span>
              </label>
              {dospela.enabled && (
                <button type="button" onClick={() => selectAllSizes('dospela')} className="text-xs text-[#c8102e] hover:underline">
                  Vybrat vše
                </button>
              )}
            </div>

            {dospela.enabled && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dospela.price}
                    onChange={(e) => setDospela((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0"
                    min={0}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
                  />
                  <span className="text-sm text-gray-500">Kč</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Dostupné velikosti:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES_DOSPELA.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize('dospela', s)}
                        className={`rounded px-2.5 py-1 text-xs font-medium border transition-all ${
                          dospela.sizes.includes(s)
                            ? 'border-[#c8102e] bg-[#c8102e] text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* STAV */}
        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-[#0a0a0a] mb-4">Publikování</h2>
          <div className="flex gap-4">
            {(['published', 'draft'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="text-[#c8102e] focus:ring-[#c8102e]"
                />
                <span className="text-sm">{s === 'published' ? 'Zveřejněno' : 'Skrytý (draft)'}</span>
              </label>
            ))}
          </div>
        </section>

        {/* ERROR + SUBMIT */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#c8102e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a00e26] disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Ukládám…' : 'Uložit produkt'}
          </button>
          <Link href="/admin/produkty" className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700">
            Zrušit
          </Link>
        </div>
      </form>
    </div>
  )
}
