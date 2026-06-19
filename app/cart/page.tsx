'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, addItem, clearCart, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
        <Link
          href="/products"
          className="text-sm underline underline-offset-4 text-gray-600 hover:text-white"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Tu carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 py-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{item.category}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center text-lg leading-none"
                  >
                    +
                  </button>
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-500">Total</span>
          <span className="text-xl font-semibold">
            ${totalPrice().toLocaleString('es-AR')}
          </span>
        </div>
<Link
  href="/checkout"
  className="block w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors text-center"
>
  Ir al checkout
</Link>
      </div>
    </div>
  )
}