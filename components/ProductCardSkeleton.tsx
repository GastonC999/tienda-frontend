// Placeholder que imita el layout de ProductCard mientras el catálogo carga.
// Se usa en los loading.tsx de la tienda para evitar el "salto" al aparecer datos.
export default function ProductCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#581A1B', border: '1px solid rgba(200, 144, 42, 0.2)' }}
    >
      {/* Imagen cuadrada */}
      <div className="skeleton w-full aspect-square" />

      <div className="p-4">
        {/* Categoría */}
        <div className="skeleton h-3 w-1/3 rounded" />
        {/* Nombre */}
        <div className="skeleton h-4 w-3/4 rounded mt-2" />
        {/* Descripción */}
        <div className="skeleton h-3 w-full rounded mt-3" />
        <div className="skeleton h-3 w-5/6 rounded mt-2" />

        <div className="flex items-center justify-between mt-4">
          {/* Precio */}
          <div className="skeleton h-5 w-20 rounded" />
          {/* Botón "Agregar" */}
          <div className="skeleton h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
