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