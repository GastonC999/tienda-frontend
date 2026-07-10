import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Product } from '@/types'
import { getProducts } from '@/lib/api'
import { CATEGORIES } from '@/lib/categories'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allProducts: Product[] = await getProducts()

  const products = category
    ? allProducts.filter(p => p.category === category)
    : allProducts

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#F5E6C8' }}>
          {category || 'Todos los productos'}
        </h1>
      </div>

      <CategoryFilter categories={CATEGORIES} active={category} />

      {products.length === 0 ? (
        <div className="text-center py-24" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>
          No hay productos en esta categoría todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}