'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: string[]
  active?: string
}) {
  const router = useRouter()

  function handleClick(category: string) {
    if (category === active) {
      router.push('/products')
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => router.push('/products')}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{
          backgroundColor: !active ? '#CD8C1F' : 'transparent',
          color: !active ? '#3D0A0A' : 'rgba(200, 144, 42, 0.9)',
          border: '1px solid rgba(200, 144, 42, 0.4)',
        }}
      >
        Todos
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: active === cat ? '#CD8C1F' : 'transparent',
            color: active === cat ? '#3D0A0A' : 'rgba(200, 144, 42, 0.9)',
            border: '1px solid rgba(200, 144, 42, 0.4)',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}