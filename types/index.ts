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

// Payload de edición de un slide: todo menos id y orden (no se reordena desde
// el formulario). Lo usan el modal del admin y el route handler BFF.
export type HeroSlideInput = Omit<HeroSlide, 'id' | 'orden'>

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