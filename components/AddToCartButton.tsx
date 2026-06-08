'use client'

import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <button
      onClick={() => addItem(product)}
      className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
    >
      Agregar al carrito
    </button>
  )
}