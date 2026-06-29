'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, addItem, clearCart, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-lg mb-4" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>Tu carrito está vacío</p>
        <Link
          href="/products"
          className="text-sm underline underline-offset-4 transition-colors"
          style={{ color: '#CD8C1F' }}
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: '#F5E6C8' }}>Tu carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm transition-colors hover:text-red-400"
          style={{ color: 'rgba(245, 230, 200, 0.5)' }}
        >
          Vaciar carrito
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: 'rgba(200, 144, 42, 0.15)' }}>
        {items.map(item => (
          <div key={item.id} className="flex gap-4 py-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#3D0A0A' }}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: '#F5E6C8' }}>{item.name}</p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>{item.category}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-md transition-colors flex items-center justify-center text-lg leading-none"
                    style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-4 text-center" style={{ color: '#F5E6C8' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-7 h-7 rounded-md transition-colors flex items-center justify-center text-lg leading-none"
                    style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
                  >
                    +
                  </button>
                </div>
                <span className="font-medium" style={{ color: '#F5E6C8' }}>
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-6" style={{ borderTop: '1px solid rgba(200, 144, 42, 0.2)' }}>
        <div className="flex items-center justify-between mb-6">
          <span style={{ color: 'rgba(245, 230, 200, 0.6)' }}>Total</span>
          <span className="text-xl font-semibold" style={{ color: '#CD8C1F' }}>
            ${totalPrice().toLocaleString('es-AR')}
          </span>
        </div>
<Link
  href="/checkout"
  className="block w-full py-3 rounded-xl text-sm font-medium transition-colors text-center"
  style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
>
  Ir al checkout
</Link>
      </div>
    </div>
  )
}