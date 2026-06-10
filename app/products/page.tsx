import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Product } from '@/types'
import { getProducts } from '@/lib/api'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['Café', 'Cannabis Medicinal', 'Cultivo', 'Accesorios']

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
        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#6B1010' }}>
          {category || 'Todos los productos'}
        </h1>
        <p className="text-sm text-gray-400">
          {products.length} producto{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      <CategoryFilter categories={CATEGORIES} active={category} />

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
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