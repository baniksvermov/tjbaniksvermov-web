import { createClient } from '@/lib/supabase/server'
import type { Product, ProductCategory } from '@/types/database'
import EshopClient from './EshopClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'E-shop — TJ Baník Švermov',
  description: 'Klubové oblečení JAKO — ONE a SONIC kolekce s potiskem TJ Baník Švermov.',
}

export default async function EshopPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:product_categories(id,name,slug)')
      .eq('status', 'published')
      .eq('in_stock', true)
      .order('name'),
    supabase.from('product_categories').select('*').order('name'),
  ])

  return (
    <EshopClient
      products={(products as Product[]) ?? []}
      categories={(categories as ProductCategory[]) ?? []}
    />
  )
}
