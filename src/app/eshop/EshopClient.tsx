'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Product, ProductCategory } from '@/types/database'

interface Props {
  products: Product[]
  categories: ProductCategory[]
}

const RELEVANT_SLUGS = [
  'bundy', 'mikiny', 'tricka', 'teplaky-sortky',
  'funkcni-pradlo', 'tasky-a-batohy', 'brankarska-vybava', 'doplnky', 'stulpny',
]

export default function EshopClient({ products, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string>('vse')

  const visibleCategories = categories.filter((c) => RELEVANT_SLUGS.includes(c.slug))

  const filtered =
    activeCat === 'vse'
      ? products
      : products.filter((p) => {
          const cat = typeof p.category === 'object' ? p.category : null
          return cat?.slug === activeCat
        })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[#0a0a0a] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-[Anton] text-4xl uppercase tracking-wide">E-shop</h1>
          <p className="mt-2 text-gray-400 text-sm">
            Klubové oblečení JAKO s potiskem TJ Baník Švermov
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCat('vse')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCat === 'vse'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vše ({products.length})
          </button>
          {visibleCategories.map((cat) => {
            const count = products.filter((p) => {
              const c = typeof p.category === 'object' ? p.category : null
              return c?.slug === cat.slug
            }).length
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCat(cat.slug)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCat === cat.slug
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
            <ShoppingBag className="h-12 w-12" />
            <p>Žádné produkty v této kategorii</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function proxyImg(url: string) {
  return `/api/img?url=${encodeURIComponent(url)}`
}

function ProductCard({ product }: { product: Product }) {
  const rawImage = product.images?.[0]
  const image = rawImage ? proxyImg(rawImage) : null
  const cat = typeof product.category === 'object' ? product.category : null

  return (
    <Link
      href={`/eshop/${product.slug}`}
      className="group flex flex-col rounded-lg border border-gray-100 overflow-hidden hover:border-primary hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-200">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        {cat && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {cat.name}
          </span>
        )}
        <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto pt-2">
          <span className="text-base font-bold">
            {product.price.toLocaleString('cs-CZ')} Kč
          </span>
        </div>
      </div>
    </Link>
  )
}
