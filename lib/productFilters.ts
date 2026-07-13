import { Product } from '@/types'

// ---------------------------------------------------------------------------
// Filtros del catálogo (/products). Toda la lógica de búsqueda, rango de precio
// y ordenamiento vive acá para que la página (Server Component) quede declarativa
// y los controles del cliente compartan el mismo contrato. La URL es la única
// fuente de verdad: `parseFilters` normaliza los query params y `buildProductQuery`
// los reescribe preservando el resto.
// ---------------------------------------------------------------------------

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'newest'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
]

const SORT_VALUES = SORT_OPTIONS.map(o => o.value)

export const DEFAULT_SORT: SortOption = 'newest'

export interface ProductFilters {
  category?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  sort: SortOption
}

// Query params crudos tal como llegan de `searchParams` (todo string u opcional).
export interface RawProductParams {
  category?: string
  q?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

function toNumber(value?: string): number | undefined {
  if (value === undefined || value.trim() === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function isSortOption(value?: string): value is SortOption {
  return value !== undefined && SORT_VALUES.includes(value as SortOption)
}

// Normaliza los query params: convierte precios a número, valida `sort` contra
// los valores permitidos (descarta basura de la URL) y recorta la búsqueda.
export function parseFilters(params: RawProductParams): ProductFilters {
  const q = params.q?.trim()
  return {
    category: params.category || undefined,
    q: q || undefined,
    minPrice: toNumber(params.minPrice),
    maxPrice: toNumber(params.maxPrice),
    sort: isSortOption(params.sort) ? params.sort : DEFAULT_SORT,
  }
}

// Rango de precios del catálogo, para inicializar el slider. Con lista vacía
// devuelve 0/0 (el slider se deshabilita al detectar min === max).
export function getPriceBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 }
  let min = products[0].price
  let max = products[0].price
  for (const p of products) {
    if (p.price < min) min = p.price
    if (p.price > max) max = p.price
  }
  return { min: Math.floor(min), max: Math.ceil(max) }
}

// Aplica los filtros en orden: categoría → texto → rango de precio → orden.
// "newest" usa `id` descendente como proxy de recencia (el backend asigna ids
// incrementales; el tipo Product todavía no tiene createdAt).
export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  let result = products

  if (filters.category) {
    result = result.filter(p => p.category === filters.category)
  }

  if (filters.q) {
    const needle = filters.q.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(needle))
  }

  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.maxPrice!)
  }

  // Copia antes de ordenar para no mutar el array de entrada.
  const sorted = [...result]
  switch (filters.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      break
    case 'newest':
      sorted.sort((a, b) => b.id - a.id)
      break
  }
  return sorted
}

// Mergea `patch` sobre los params actuales y devuelve el query string ('' si no
// queda ninguno). Un valor null o vacío elimina esa clave. Lo usan todos los
// controles del cliente para actualizar un filtro sin perder los demás.
export function buildProductQuery(
  current: URLSearchParams,
  patch: Record<string, string | null | undefined>,
): string {
  const params = new URLSearchParams(current.toString())
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
