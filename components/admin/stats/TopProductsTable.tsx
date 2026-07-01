import type { TopProduct } from '@/types'

// Tabla de los 5 productos más vendidos (por unidades). Mismo markup y paleta
// que OrdersTable: fondo vino, acento dorado, bordes translúcidos.
interface TopProductsTableProps {
  products: TopProduct[]
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-medium" style={{ color: '#E0B65C' }}>
        Top 5 productos más vendidos
      </h2>
      {products.length === 0 ? (
        <div
          className="rounded-xl px-6 py-16 text-center text-sm"
          style={{
            backgroundColor: '#581A1B',
            border: '1px solid rgba(200, 144, 42, 0.2)',
            color: 'rgba(200, 144, 42, 0.7)',
          }}
        >
          Aún no hay ventas para mostrar.
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            backgroundColor: '#581A1B',
            border: '1px solid rgba(200, 144, 42, 0.2)',
          }}
        >
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr
                className="text-left"
                style={{
                  color: 'rgba(200, 144, 42, 0.7)',
                  borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
                }}
              >
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Unidades vendidas</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.productName}
                  style={{ borderBottom: '1px solid rgba(200, 144, 42, 0.1)' }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: '#E0B65C' }}>
                    {index + 1}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'rgba(200, 144, 42, 0.9)' }}>
                    {product.productName}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#E0B65C' }}>
                    {product.totalQuantity.toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
