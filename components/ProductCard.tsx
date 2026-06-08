'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full aspect-square bg-gray-50">
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
        <p className="text-xs text-gray-400 mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h2 className="font-medium text-gray-900 hover:underline underline-offset-4">
            {product.name}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <button
            onClick={() => addItem(product)}
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}