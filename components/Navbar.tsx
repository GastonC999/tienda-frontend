'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const items = useCartStore(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(107, 16, 16, 0.97)' : '#581A1B',
        borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="Moccana"
            width={140}
            height={48}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors"
            style={{ color: 'rgba(200, 144, 42, 0.8)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C8902A')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200, 144, 42, 0.8)')}
          >
            Productos
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: 'rgba(200, 144, 42, 0.15)',
              border: '1px solid rgba(200, 144, 42, 0.4)',
              color: '#C8902A',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.15)'
            }}
          >
            <span>Carrito</span>
            {mounted && totalItems > 0 && (
              <span
                className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: '#C8902A', color: '#581A1B' }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}