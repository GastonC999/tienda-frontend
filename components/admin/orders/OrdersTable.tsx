'use client'

import type { Order, OrderStatus } from '@/types'
import { STATUS_CONFIG, ORDER_STATUSES } from './OrderStatusBadge'

// Tabla de órdenes del panel. Muestra número, cliente, email, total, estado y
// fecha. El estado se cambia con un <select> inline; el click en la fila (menos
// en el selector) abre el detalle con los items.
interface OrdersTableProps {
  orders: Order[]
  updatingId: number | null
  onSelect: (order: Order) => void
  onStatusChange: (order: Order, status: OrderStatus) => void
}

// Formatea la fecha ISO del backend a una fecha local legible.
function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function OrdersTable({
  orders,
  updatingId,
  onSelect,
  onStatusChange,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div
        className="rounded-xl px-6 py-16 text-center text-sm"
        style={{
          backgroundColor: '#581A1B',
          border: '1px solid rgba(200, 144, 42, 0.2)',
          color: 'rgba(200, 144, 42, 0.7)',
        }}
      >
        No hay órdenes para mostrar.
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
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr
            className="text-left"
            style={{
              color: 'rgba(200, 144, 42, 0.7)',
              borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
            }}
          >
            <th className="px-4 py-3 font-medium">Orden</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status]
            return (
              <tr
                key={order.id}
                onClick={() => onSelect(order)}
                className="cursor-pointer transition-colors duration-150 hover:bg-black/15"
                style={{ borderBottom: '1px solid rgba(200, 144, 42, 0.1)' }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: '#E0B65C' }}>
                  #{order.id}
                </td>
                <td className="px-4 py-3" style={{ color: 'rgba(200, 144, 42, 0.9)' }}>
                  {order.customerName}
                </td>
                <td className="px-4 py-3" style={{ color: 'rgba(200, 144, 42, 0.7)' }}>
                  {order.customerEmail}
                </td>
                <td className="px-4 py-3" style={{ color: '#E0B65C' }}>
                  ${order.total.toLocaleString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  {/* El selector cambia el estado sin abrir el detalle. Sus
                      colores reflejan el estado actual (badge embebido). */}
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onClick={e => e.stopPropagation()}
                    onChange={e =>
                      onStatusChange(order, e.target.value as OrderStatus)
                    }
                    className="rounded-full px-3 py-1 text-xs font-medium outline-none disabled:opacity-60"
                    style={{
                      color: cfg.color,
                      backgroundColor: cfg.background,
                      border: `1px solid ${cfg.border}`,
                    }}
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s} style={{ backgroundColor: '#581A1B', color: '#E0B65C' }}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3" style={{ color: 'rgba(200, 144, 42, 0.8)' }}>
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
