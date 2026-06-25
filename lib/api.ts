import { AuthUser } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Inicia sesión contra el backend. Devuelve el usuario autenticado (con token)
// o lanza un error con mensaje legible si las credenciales son inválidas.
// La consume el provider de NextAuth en `auth.ts` (no se llama desde el cliente).
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

// Patrón para llamadas autenticadas al backend (a futuro): como el JWT vive en
// una cookie httpOnly gestionada por NextAuth, el navegador NO puede leerlo. Las
// páginas de admin que necesiten datos protegidos deben hacer la llamada desde
// el servidor de Next (server component o route handler), obteniendo el token
// con `auth()` y reenviándolo así:
//   const session = await auth()
//   fetch(url, { headers: { Authorization: `Bearer ${session.user.backendToken}` } })

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