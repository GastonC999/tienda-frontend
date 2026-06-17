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
          backgroundColor: !active ? '#581A1B' : 'transparent',
          color: !active ? 'white' : '#581A1B',
          border: '1px solid #581A1B',
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
            backgroundColor: active === cat ? '#581A1B' : 'transparent',
            color: active === cat ? 'white' : '#581A1B',
            border: '1px solid #581A1B',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}