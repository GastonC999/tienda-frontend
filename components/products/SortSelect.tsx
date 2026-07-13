'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  buildProductQuery,
  DEFAULT_SORT,
  SORT_OPTIONS,
} from '@/lib/productFilters'

// Selector de ordenamiento. Escribe el valor en la URL (`sort`); si es el default
// lo omite para no ensuciar la query.
export default function SortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = searchParams.get('sort') ?? DEFAULT_SORT

  function handleChange(next: string) {
    const query = buildProductQuery(searchParams, {
      sort: next === DEFAULT_SORT ? null : next,
    })
    router.replace(`${pathname}${query}`, { scroll: false })
  }

  return (
    <label className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245, 230, 200, 0.7)' }}>
      <span className="whitespace-nowrap">Ordenar por</span>
      <select
        value={value}
        onChange={e => handleChange(e.target.value)}
        aria-label="Ordenar productos"
        className="rounded-lg px-3 py-2 text-sm outline-none"
        style={{
          backgroundColor: '#3D0A0A',
          color: '#F5E6C8',
          border: '1px solid rgba(200, 144, 42, 0.4)',
        }}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#3D0A0A' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
