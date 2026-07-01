'use client'

import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <button
      onClick={() => addItem(product)}
      className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
      style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
    >
      Agregar al carrito
    </button>
  )
}