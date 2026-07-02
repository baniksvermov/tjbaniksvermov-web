'use client'

import { useEffect } from 'react'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from './CartProvider'
import { Button } from '@/components/ui/Button'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, itemKey } = useCart()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-[Anton] text-lg uppercase tracking-wide">
            Košík {items.length > 0 && <span className="text-primary">({items.length})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="rounded p-1 text-gray-400 hover:text-gray-700"
            aria-label="Zavřít košík"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <ShoppingBag className="h-12 w-12" />
              <p className="text-sm">Košík je prázdný</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const key = itemKey(item)
                return (
                  <li key={key} className="flex gap-4 pb-4 border-b last:border-0">
                    {/* Image placeholder */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-16 w-16 rounded object-cover bg-gray-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">
                        {item.product_name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        {/* Quantity */}
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={() => updateQty(key, item.quantity - 1)}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-sm"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(key, item.quantity + 1)}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                        </span>
                        <button
                          onClick={() => removeItem(key)}
                          className="ml-auto text-gray-400 hover:text-red-500"
                          aria-label="Odebrat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Celkem</span>
              <span className="text-primary">{total.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <p className="text-xs text-gray-500">Ceny jsou bez dopravy.</p>
            <Button href="/eshop/objednavka" onClick={closeCart} size="lg" className="w-full">
              Přejít k objednávce
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
