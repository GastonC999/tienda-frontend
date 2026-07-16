export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  // Galería opcional. Si el backend no la envía, la UI usa [image] como
  // fuente única. Preparado para múltiples fotos sin romper productos actuales.
  images?: string[]
  category: string
  stock: number
}

// Payload para crear/editar un producto: igual que Product pero sin el id, que
// lo asigna el backend. Lo usan el formulario del admin y los route handlers.
export type ProductInput = Omit<Product, 'id'>

export type Role = 'ADMIN' | 'EDITOR'

// Slide del carousel Hero de la home. Espeja la entidad HeroSlide del backend
// (GET /api/slides público, PUT /api/slides/{id} para ADMIN/EDITOR). `imageUrl`
// es la imagen de fondo (Cloudinary); `orden` define la posición en el carousel.
export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  cta: string
  href: string
  imageUrl: string
  orden: number
}

// Payload de edición de un slide: todo menos id. El `orden` no se edita en el
// formulario pero se reenvía tal cual para que el backend no lo pierda.
// Lo usan el modal del admin y el route handler BFF.
export type HeroSlideInput = Omit<HeroSlide, 'id'>

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