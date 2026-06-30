import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/database'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name').eq('slug', slug).single()
  return { title: data?.name ?? 'Produkt' }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:product_categories(id,name,slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!product) notFound()

  return <ProductDetailClient product={product as Product} />
}
