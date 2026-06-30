'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ChevronRight, Check } from 'lucide-react'
import type { Product } from '@/types/database'
import { useCart } from '@/components/shop/CartProvider'

interface Props {
  product: Product
}

const COLOR_DOTS: Record<string, string[]> = {
  'Červená': ['#C8102E'],
  'Červeno-bílá': ['#C8102E', '#FFFFFF'],
  'Černo-červená': ['#1a1a1a', '#C8102E'],
  'Černá': ['#1a1a1a'],
}

function proxyImg(url: string) {
  return `/api/img?url=${encodeURIComponent(url)}`
}

export default function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length === 1 ? product.colors[0] : null
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  const images = (product.images ?? []).map(proxyImg)
  const mainImage = images[activeImg] ?? null
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
      image: product.images?.[activeImg] ?? null,
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
          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-200">
                  <ShoppingBag className="h-20 w-20" />
                  <span className="text-sm text-gray-400">Obrázek brzy</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border-2 transition-all ${
                      activeImg === i
                        ? 'border-[#c8102e]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
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
                  Barva
                  {selectedColor && (
                    <span className="font-normal text-gray-500"> — {selectedColor}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors!.map((color) => {
                    const dots = COLOR_DOTS[color] ?? ['#888']
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className={`relative h-9 w-9 rounded-full border-2 overflow-hidden transition-all flex-shrink-0 ${
                          selectedColor === color
                            ? 'border-[#c8102e] scale-110 shadow-md ring-2 ring-[#c8102e]/20'
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {dots.length === 1 ? (
                          <span
                            className="absolute inset-0"
                            style={{ backgroundColor: dots[0] }}
                          />
                        ) : (
                          <>
                            <span
                              className="absolute inset-0 right-1/2"
                              style={{ backgroundColor: dots[0] }}
                            />
                            <span
                              className="absolute inset-0 left-1/2 border-l border-gray-200"
                              style={{ backgroundColor: dots[1] }}
                            />
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Single color display */}
            {!hasColors && product.colors?.[0] && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Barva:</span>
                <div className="flex items-center gap-1.5">
                  {(COLOR_DOTS[product.colors[0]] ?? ['#888']).map((c, i) => (
                    <span
                      key={i}
                      className="inline-block h-4 w-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <span className="text-sm text-gray-600">{product.colors[0]}</span>
                </div>
              </div>
            )}

            {/* Size selector */}
            {hasSizes && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Velikost
                  {selectedSize && (
                    <span className="font-normal text-gray-500"> — {selectedSize}</span>
                  )}
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
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-base"
                >
                  −
                </button>
                <span className="px-4 py-1.5 text-sm font-medium border-x border-gray-300">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-base"
                >
                  +
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

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
