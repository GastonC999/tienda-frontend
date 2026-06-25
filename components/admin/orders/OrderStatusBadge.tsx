import type { OrderStatus } from '@/types'

// Configuración central de estados de orden: etiqueta en español y colores del
// badge. La reutilizan el badge, el filtro y el selector de la tabla para no
// repetir el mapeo. Amarillo PENDING, verde PAID, rojo CANCELLED (criterio).
interface StatusStyle {
  label: string
  color: string
  background: string
  border: string
}

export const STATUS_CONFIG: Record<OrderStatus, StatusStyle> = {
  PENDING: {
    label: 'Pendiente',
    color: '#E0B65C',
    background: 'rgba(224, 182, 92, 0.15)',
    border: 'rgba(224, 182, 92, 0.5)',
  },
  PAID: {
    label: 'Pagada',
    color: '#6FBF8B',
    background: 'rgba(111, 191, 139, 0.15)',
    border: 'rgba(111, 191, 139, 0.5)',
  },
  CANCELLED: {
    label: 'Cancelada',
    color: '#E0857C',
    background: 'rgba(224, 133, 124, 0.15)',
    border: 'rgba(224, 133, 124, 0.5)',
  },
}

// Orden de estados para los selectores/filtros.
export const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'PAID', 'CANCELLED']

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
      style={{
        color: cfg.color,
        backgroundColor: cfg.background,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.label}
    </span>
  )
}
