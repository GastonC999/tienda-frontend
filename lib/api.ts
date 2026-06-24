import { useAuthStore } from '@/store/authStore'
import { AuthUser } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Inicia sesión contra el backend. Devuelve el usuario autenticado (con token)
// o lanza un error con mensaje legible si las credenciales son inválidas.
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (res.status === 401) throw new Error('Email o contraseña incorrectos')
  if (!res.ok) throw new Error('No se pudo iniciar sesión')
  return res.json()
}

// Cabecera de autorización para endpoints protegidos. Lee el token del store.
export function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().user?.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export async function getProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`)
  if (!res.ok) throw new Error('Producto no encontrado')
  return res.json()
}