'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { buildProductQuery } from '@/lib/productFilters'

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: readonly string[]
  active?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Cambia solo el param `category` y preserva búsqueda, precio y orden.
  function selectCategory(category: string | null) {
    const query = buildProductQuery(searchParams, { category })
    router.push(`${pathname}${query}`, { scroll: false })
  }

  function handleClick(category: string) {
    // Volver a tocar la categoría activa la deselecciona ("Todos").
    selectCategory(category === active ? null : category)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => selectCategory(null)}
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
