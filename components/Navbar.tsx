'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const items = useCartStore(state => state.items)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <nav className="border-b border-gray-200 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Mi tienda
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm text-gray-600 hover:text-black">
            Productos
          </Link>
          <Link href="/cart" className="text-sm text-gray-600 hover:text-black">
            Carrito {mounted ? `(${totalItems})` : ''}
          </Link>
        </div>
      </div>
    </nav>
  )
}