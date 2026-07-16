// Fallback de Suspense mientras el server component del detalle resuelve
// getProduct(). Reproduce la estructura de products/[id]/page.tsx.
export default function ProductDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="skeleton h-4 w-72 rounded mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Galería */}
        <div className="skeleton w-full aspect-square rounded-xl" />

        <div className="flex flex-col justify-center">
          {/* Categoría */}
          <div className="skeleton h-4 w-24 rounded mb-2" />
          {/* Nombre */}
          <div className="skeleton h-8 w-3/4 rounded mb-4" />
          {/* Precio */}
          <div className="skeleton h-7 w-32 rounded mb-8" />
          {/* Selector de cantidad */}
          <div className="skeleton h-8 w-40 rounded mb-5" />
          {/* Botón agregar */}
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>

      {/* Descripción */}
      <section className="mt-16 max-w-2xl">
        <div className="skeleton h-6 w-40 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-5/6 rounded mb-2" />
        <div className="skeleton h-4 w-4/6 rounded" />
      </section>
    </div>
  )
}
