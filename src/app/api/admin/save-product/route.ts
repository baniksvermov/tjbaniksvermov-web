import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface Variant {
  type: 'detska' | 'dospela'
  price: number
  sizes: string[]
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const body = await req.json()
  const { name, category_id, description, colors, images, jako_sku, status, variants } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Chybí název' }, { status: 400 })
  if (!category_id) return NextResponse.json({ error: 'Chybí kategorie' }, { status: 400 })
  if (!variants || variants.length === 0) return NextResponse.json({ error: 'Zvolte alespoň jednu variantu' }, { status: 400 })

  const baseSlug = slugify(name.trim())

  const rows = (variants as Variant[]).map((v) => ({
    name: `${name.trim()} — ${v.type === 'detska' ? 'dětská' : 'dospělá'}`,
    slug: `${baseSlug}-${v.type === 'detska' ? 'detska' : 'dospela'}`,
    category_id,
    description: description?.trim() || null,
    price: Number(v.price),
    sizes: v.sizes,
    colors: colors ?? [],
    images: images ?? [],
    jako_sku: jako_sku?.trim() || null,
    status: status ?? 'published',
    in_stock: true,
  }))

  const { error } = await supabase.from('products').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
