'use client'

import Image from 'next/image'
import type { Product, Role } from '@/types'

// Tabla de productos del panel. Muestra thumbnail, nombre, categoría y precio,
// más las acciones por fila. "Eliminar" sólo se renderiza para ADMIN (mismo
// criterio que el backend y middleware.ts; el endpoint igual lo revalida).
interface ProductsTableProps {
  products: Product[]
  role: Role
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductsTable({
  products,
  role,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const isAdmin = role === 'ADMIN'

  if (products.length === 0) {
    return (
      <div
        className="rounded-xl px-6 py-16 text-center text-sm"
        style={{
          backgroundColor: '#581A1B',
          border: '1px solid rgba(200, 144, 42, 0.2)',
          color: 'rgba(200, 144, 42, 0.7)',
        }}
      >
        No hay productos todavía. Creá el primero con “＋ Nuevo producto”.
      </div>
    )
  }

  return (
    <div
      className="overflow-x-auto rounded-xl"
      style={{
        backgroundColor: '#581A1B',
        border: '1px solid rgba(200, 144, 42, 0.2)',
      }}
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr
            className="text-left"
            style={{
              color: 'rgba(200, 144, 42, 0.7)',
              borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
            }}
          >
            <th className="px-4 py-3 font-medium">Imagen</th>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr
              key={product.id}
              style={{ borderBottom: '1px solid rgba(200, 144, 42, 0.1)' }}
            >
              <td className="px-4 py-3">
                <div
                  className="relative h-12 w-12 overflow-hidden rounded-lg"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
                >
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-4 py-3" style={{ color: '#E0B65C' }}>
                {product.name}
              </td>
              <td className="px-4 py-3" style={{ color: 'rgba(200, 144, 42, 0.8)' }}>
                {product.category}
              </td>
              <td className="px-4 py-3" style={{ color: '#E0B65C' }}>
                ${product.price.toLocaleString('es-AR')}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(200, 144, 42, 0.15)',
                      border: '1px solid rgba(200, 144, 42, 0.4)',
                      color: '#CD8C1F',
                    }}
                  >
                    Editar
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(224, 133, 124, 0.12)',
                        border: '1px solid rgba(224, 133, 124, 0.5)',
                        color: '#E0857C',
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
