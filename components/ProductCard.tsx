'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <div
      className="rounded-xl overflow-hidden transition-colors"
      style={{ backgroundColor: '#581A1B', border: '1px solid rgba(200, 144, 42, 0.2)' }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full aspect-square" style={{ backgroundColor: '#3D0A0A' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h2 className="font-medium hover:underline underline-offset-4" style={{ color: '#F5E6C8' }}>
            {product.name}
          </h2>
        </Link>
        <p className="text-sm mt-1" style={{ color: 'rgba(245, 230, 200, 0.55)' }}>{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold" style={{ color: '#CD8C1F' }}>
            ${product.price.toLocaleString('es-AR')}
          </span>
          <button
            onClick={() => addItem(product)}
            className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}