'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SearchBar from './SearchBar'
import PriceRangeFilter from './PriceRangeFilter'
import SortSelect from './SortSelect'

// Barra de filtros avanzados del catálogo: buscador + rango de precio + orden.
// Solo compone los tres controles (cada uno escribe su propio param en la URL) y
// agrega un botón para limpiar todo. `bounds` son los precios min/max del catálogo.
export default function ProductFilters({
  bounds,
  resultCount,
}: {
  bounds: { min: number; max: number }
  resultCount: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Hay filtros activos si existe cualquier param más allá de la categoría.
  const hasActiveFilters =
    searchParams.has('q') ||
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice') ||
    searchParams.has('sort')

  function handleClear() {
    // Preserva la categoría (vive en el mismo path via ?category=…) y limpia el resto.
    const category = searchParams.get('category')
    const query = category ? `?category=${encodeURIComponent(category)}` : ''
    router.push(`${pathname}${query}`, { scroll: false })
  }

  return (
    <div
      className="mt-6 rounded-xl p-4"
      style={{ backgroundColor: '#581A1B', border: '1px solid rgba(200, 144, 42, 0.2)' }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <SearchBar />
        <SortSelect />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <PriceRangeFilter min={bounds.min} max={bounds.max} />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>
            {resultCount} {resultCount === 1 ? 'producto' : 'productos'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs underline underline-offset-4"
              style={{ color: 'rgba(200, 144, 42, 0.9)' }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
