import { notFound } from 'next/navigation'
import { createPublicClient } from '@/lib/supabase/public'
import type { Product } from '@/types/database'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase.from('products').select('slug').eq('status', 'published')
  return (data ?? []).map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = createPublicClient()
  const { data } = await supabase.from('products').select('name').eq('slug', slug).single()
  return { title: data?.name ?? 'Produkt' }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:product_categories(id,name,slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!product) notFound()

  return <ProductDetailClient product={product as Product} />
}
