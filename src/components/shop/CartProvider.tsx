'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { CartItem } from '@/types/database'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  hydrated: boolean
}

type CartAction =
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; key: string }
  | { type: 'UPDATE_QTY'; key: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

interface CartContext {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (key: string) => void
  updateQty: (key: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: number
  itemCount: number
  itemKey: (item: Pick<CartItem, 'product_id' | 'size' | 'color'>) => string
}

const CartCtx = createContext<CartContext | null>(null)

const LS_KEY = 'banik_cart'

function itemKey(item: Pick<CartItem, 'product_id' | 'size' | 'color'>) {
  return `${item.product_id}__${item.size ?? ''}__${item.color ?? ''}`
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items, hydrated: true }

    case 'ADD_ITEM': {
      const key = itemKey(action.item)
      const existing = state.items.find((i) => itemKey(i) === key)
      const items = existing
        ? state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity: i.quantity + action.item.quantity } : i
          )
        : [...state.items, action.item]
      return { ...state, items, isOpen: true }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => itemKey(i) !== action.key) }

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) => (itemKey(i) === action.key ? { ...i, quantity: action.qty } : i))
          .filter((i) => i.quantity > 0),
      }

    case 'CLEAR':
      return { ...state, items: [] }

    case 'OPEN':
      return { ...state, isOpen: true }

    case 'CLOSE':
      return { ...state, isOpen: false }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false, hydrated: false })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) })
      else dispatch({ type: 'HYDRATE', items: [] })
    } catch {
      dispatch({ type: 'HYDRATE', items: [] })
    }
  }, [])

  useEffect(() => {
    if (state.hydrated) {
      localStorage.setItem(LS_KEY, JSON.stringify(state.items))
    }
  }, [state.items, state.hydrated])

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', item }), [])
  const removeItem = useCallback((key: string) => dispatch({ type: 'REMOVE_ITEM', key }), [])
  const updateQty = useCallback(
    (key: string, qty: number) => dispatch({ type: 'UPDATE_QTY', key, qty }),
    []
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), [])

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartCtx.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        total,
        itemCount,
        itemKey,
      }}
    >
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
