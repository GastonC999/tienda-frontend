import ProductCardSkeleton from '@/components/ProductCardSkeleton'

// Fallback de Suspense de Next.js mientras el server component del catálogo
// resuelve getProducts(). Reproduce la estructura de products/page.tsx.
export default function ProductsLoading() {
  return (
    <div>
      <div className="mb-8">
        {/* Título */}
        <div className="skeleton h-8 w-56 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
