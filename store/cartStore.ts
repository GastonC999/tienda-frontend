import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface CartItem extends Product {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => set((state) => {
        const existing = state.items.find(i => i.id === product.id)
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          }
        }
        return { items: [...state.items, { ...product, quantity: 1 }] }
      }),

      removeItem: (id) => set((state) => ({
        items: state.items
          .map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0)
      })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)