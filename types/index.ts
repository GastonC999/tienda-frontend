export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
}

// Payload para crear/editar un producto: igual que Product pero sin el id, que
// lo asigna el backend. Lo usan el formulario del admin y los route handlers.
export type ProductInput = Omit<Product, 'id'>

export type Role = 'ADMIN' | 'EDITOR'

export interface AuthUser {
  email: string
  role: Role
  token: string
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

// Item de una orden tal como lo crea el checkout (storefront): no lleva id
// propio del lado del front; el backend persiste el detalle junto a la orden.
export interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
}

// Orden completa devuelta por el backend (con los items embebidos). La crea el
// checkout y la gestiona el admin (listado y cambio de estado).
export interface Order {
  id: number
  customerName: string
  customerEmail: string
  total: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

// ---------------------------------------------------------------------------
// Estadísticas del dashboard (panel ADMIN). Espejan el StatsResponse del
// backend: `GET /api/stats` devuelve todo ya calculado en un solo request.
// Solo se cuentan las órdenes PAID para revenue (lo impone el backend).
// ---------------------------------------------------------------------------

// Producto más vendido: nombre y unidades totales vendidas.
export interface TopProduct {
  productName: string
  totalQuantity: number
}

// Punto del gráfico de línea: cantidad de órdenes en un día (no suma de pesos).
export interface DailyOrder {
  date: string
  orderCount: number
}

export interface Stats {
  totalRevenue: number // suma del total de órdenes PAID
  ordersByStatus: Record<string, number> // claves: PENDING | PAID | CANCELLED
  topProducts: TopProduct[] // top 5
  revenueByCategory: Record<string, number> // revenue PAID por categoría
  dailyOrders: DailyOrder[] // últimos 30 días
}