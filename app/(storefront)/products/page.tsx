import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import ProductFilters from '@/components/products/ProductFilters'
import { Product } from '@/types'
import { getProducts } from '@/lib/api'
import { CATEGORIES } from '@/lib/categories'
import {
  filterAndSortProducts,
  getPriceBounds,
  parseFilters,
  RawProductParams,
} from '@/lib/productFilters'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawProductParams>
}) {
  const filters = parseFilters(await searchParams)
  const allProducts: Product[] = await getProducts()

  // Bounds sobre el catálogo completo para que el slider no "salte" al filtrar.
  const bounds = getPriceBounds(allProducts)
  const products = filterAndSortProducts(allProducts, filters)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#F5E6C8' }}>
          {filters.category || 'Todos los productos'}
        </h1>
      </div>

      <CategoryFilter categories={CATEGORIES} active={filters.category} />

      <ProductFilters bounds={bounds} resultCount={products.length} />

      {products.length === 0 ? (
        <div className="text-center py-24" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>
          No se encontraron productos con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
