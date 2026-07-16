'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order, OrderStatus } from '@/types'
import { useToast } from '@/components/ToastProvider'
import { STATUS_CONFIG, ORDER_STATUSES } from './OrderStatusBadge'
import OrdersTable from './OrdersTable'
import OrderDetailModal from './OrderDetailModal'

// Orquestador de la gestión de órdenes (client). Recibe el listado desde el
// server component. Mantiene el estado del filtro por estado y del modal de
// detalle, y centraliza el cambio de estado vía el route handler BFF, el toast
// de feedback y el router.refresh() que re-fetchea el listado del server.
interface OrderManagerProps {
  orders: Order[]
}

type Filter = OrderStatus | 'ALL'

export default function OrderManager({ orders }: OrderManagerProps) {
  const router = useRouter()
  const toast = useToast()

  const [filter, setFilter] = useState<Filter>('ALL')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  // Cambia el estado de una orden. Restringido a ADMIN (el endpoint lo revalida
  // con 403). Tras el éxito refresca el listado del server.
  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    if (status === order.status) return
    setUpdatingId(order.id)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo actualizar el estado')

      toast.success('Estado actualizado')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar el estado')
    } finally {
      setUpdatingId(null)
    }
  }

  // Pills del filtro: "Todas" + un botón por estado.
  const filters: { value: Filter; label: string }[] = [
    { value: 'ALL', label: 'Todas' },
    ...ORDER_STATUSES.map(s => ({ value: s as Filter, label: STATUS_CONFIG[s].label })),
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold" style={{ color: '#E0B65C' }}>
          Órdenes
        </h1>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => {
            const active = filter === f.value
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? 'rgba(200, 144, 42, 0.18)' : 'transparent',
                  border: '1px solid rgba(200, 144, 42, 0.4)',
                  color: active ? '#E0B65C' : 'rgba(200, 144, 42, 0.7)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <OrdersTable
        orders={filtered}
        updatingId={updatingId}
        onSelect={order => setSelected(order)}
        onStatusChange={handleStatusChange}
      />

      {selected && (
        <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
