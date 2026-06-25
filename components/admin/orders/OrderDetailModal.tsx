'use client'

import type { Order } from '@/types'
import OrderStatusBadge from './OrderStatusBadge'

// Modal de detalle de una orden. Controlado: el padre decide cuándo mostrarlo.
// Mismo patrón de overlay que ConfirmDialog/ProductFormModal (click-fuera cierra,
// stopPropagation en el contenido). Muestra los datos del cliente y los items.
interface OrderDetailModalProps {
  order: Order
  onClose: () => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in-up max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
        style={{
          backgroundColor: '#581A1B',
          border: '1px solid rgba(200, 144, 42, 0.25)',
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold" style={{ color: '#E0B65C' }}>
            Orden #{order.id}
          </h2>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Datos del cliente */}
        <div className="mb-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p style={{ color: 'rgba(200, 144, 42, 0.6)' }}>Cliente</p>
            <p style={{ color: '#E0B65C' }}>{order.customerName}</p>
          </div>
          <div>
            <p style={{ color: 'rgba(200, 144, 42, 0.6)' }}>Fecha</p>
            <p style={{ color: '#E0B65C' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div className="col-span-2">
            <p style={{ color: 'rgba(200, 144, 42, 0.6)' }}>Email</p>
            <p style={{ color: '#E0B65C' }}>{order.customerEmail}</p>
          </div>
        </div>

        {/* Items */}
        <p className="mb-2 text-sm font-medium" style={{ color: 'rgba(200, 144, 42, 0.8)' }}>
          Items
        </p>
        <div
          className="mb-4 divide-y rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(200, 144, 42, 0.15)',
          }}
        >
          {order.items.map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              className="flex items-center justify-between gap-4 px-4 py-3"
              style={{ borderColor: 'rgba(200, 144, 42, 0.1)' }}
            >
              <div className="min-w-0">
                <p className="truncate" style={{ color: '#E0B65C' }}>
                  {item.productName}
                </p>
                <p className="text-xs" style={{ color: 'rgba(200, 144, 42, 0.6)' }}>
                  {item.quantity} × ${item.price.toLocaleString('es-AR')}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium" style={{ color: '#E0B65C' }}>
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="mb-6 flex items-center justify-between border-t pt-4"
          style={{ borderColor: 'rgba(200, 144, 42, 0.2)' }}
        >
          <span className="text-sm" style={{ color: 'rgba(200, 144, 42, 0.7)' }}>
            Total
          </span>
          <span className="text-xl font-semibold" style={{ color: '#E0B65C' }}>
            ${order.total.toLocaleString('es-AR')}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(200, 144, 42, 0.18)',
              border: '1px solid rgba(200, 144, 42, 0.4)',
              color: '#CD8C1F',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
