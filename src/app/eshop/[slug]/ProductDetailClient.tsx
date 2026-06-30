'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ChevronRight, Check } from 'lucide-react'
import type { Product } from '@/types/database'
import { useCart } from '@/components/shop/CartProvider'

interface Props {
  product: Product
}

function proxyImg(url: string) {
  return `/api/img?url=${encodeURIComponent(url)}`
}

export default function ProductDetailClient({ product }: Props) {
  const { addItem, itemKey } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length === 1 ? product.colors[0] : null
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const rawImage = product.images?.[0]
  const image = rawImage ? proxyImg(rawImage) : null
  const cat = typeof product.category === 'object' ? product.category : null
  const hasColors = (product.colors?.length ?? 0) > 1
  const hasSizes = (product.sizes?.length ?? 0) > 0

  function handleAddToCart() {
    if (hasSizes && !selectedSize) {
      setError('Vyberte prosím velikost.')
      return
    }
    if (hasColors && !selectedColor) {
      setError('Vyberte prosím barvu.')
      return
    }
    setError('')

    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: qty,
      size: selectedSize,
      color: selectedColor,
      image: image ?? null,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-700">Domů</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/eshop" className="hover:text-gray-700">E-shop</Link>
          {cat && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-600">{cat.name}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-200">
                <ShoppingBag className="h-20 w-20" />
                <span className="text-sm">Obrázek brzy</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {cat && (
              <span className="text-xs font-semibold uppercase tracking-widest text-[#c8102e]">
                {cat.name}
              </span>
            )}

            <h1 className="font-[Anton] text-3xl uppercase tracking-wide leading-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-bold">
              {product.price.toLocaleString('cs-CZ')}{' '}
              <span className="text-lg font-normal text-gray-500">Kč</span>
            </div>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            )}

            {/* Color selector */}
            {hasColors && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Barva{selectedColor && <span className="font-normal text-gray-500"> — {selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors!.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full px-4 py-1.5 text-sm border transition-all ${
                        selectedColor === color
                          ? 'border-[#c8102e] bg-[#c8102e] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Single color display */}
            {!hasColors && product.colors?.[0] && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Barva:</span> {product.colors[0]}
              </p>
            )}

            {/* Size selector */}
            {hasSizes && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Velikost{selectedSize && <span className="font-normal text-gray-500"> — {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] rounded px-3 py-1.5 text-sm font-medium border transition-all ${
                        selectedSize === size
                          ? 'border-[#c8102e] bg-[#c8102e] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Množství:</span>
              <div className="flex items-center border rounded overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-base"
                >
                  −
                </button>
                <span className="px-4 py-1.5 text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 rounded-lg py-3.5 px-6 text-sm font-semibold transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-[#c8102e] text-white hover:bg-[#a00e26]'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Přidáno do košíku
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Přidat do košíku
                </>
              )}
            </button>

            <p className="text-xs text-gray-400">
              Produkty jsou šité na zakázku s potiskem TJ Baník Švermov. Dodací doba závisí na
              objemu objednávky — budeme vás kontaktovat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
