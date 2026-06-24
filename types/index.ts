export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
}

export type Role = 'ADMIN' | 'EDITOR'

export interface AuthUser {
  email: string
  role: Role
  token: string
}