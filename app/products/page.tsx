import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { getProducts } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products: Product[] = await getProducts()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}