import Link from 'next/link'
import { getProducts } from '@/lib/api'
import { Product } from '@/types'
import ProductCard from './ProductCard'

export const dynamic = 'force-dynamic'

export default async function FeaturedProducts() {
  let products: Product[] = []

  try {
    const all = await getProducts()
    products = all.slice(0, 3)
  } catch {
    return null
  }

  return (
    <section className="py-20">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#F5E6C8' }}>
            Destacados
          </h2>
          <p style={{ color: 'rgba(245, 230, 200, 0.5)' }}>Los favoritos de la semana</p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium transition-colors"
          style={{ color: '#CD8C1F' }}
        >
          Ver todos →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}