'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/components/ToastProvider'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)
  const toast = useToast()
  const [quantity, setQuantity] = useState(1)

  const outOfStock = product.stock <= 0
  // Si hay stock, no dejamos superarlo; si el stock es 0 el botón se deshabilita.
  const max = product.stock > 0 ? product.stock : 1

  const dec = () => setQuantity(q => Math.max(1, q - 1))
  const inc = () => setQuantity(q => Math.min(max, q + 1))

  const handleAdd = () => {
    addItem(product, quantity)
    toast.success(`${quantity} × ${product.name} agregado al carrito`)
  }

  return (
    <div>
      {/* Selector de cantidad — mismo patrón visual que el carrito */}
      <div className="flex items-center gap-4 mb-5">
        <span className="text-sm" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>
          Cantidad
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={dec}
            disabled={quantity <= 1 || outOfStock}
            aria-label="Disminuir cantidad"
            className="w-8 h-8 rounded-md transition-colors flex items-center justify-center text-lg leading-none disabled:opacity-40"
            style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
          >
            −
          </button>
          <span
            className="text-sm font-medium w-5 text-center"
            style={{ color: '#F5E6C8' }}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={inc}
            disabled={quantity >= max || outOfStock}
            aria-label="Aumentar cantidad"
            className="w-8 h-8 rounded-md transition-colors flex items-center justify-center text-lg leading-none disabled:opacity-40"
            style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="w-full py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
      >
        {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  )
}
