import {
  AuthUser,
  HeroSlide,
  HeroSlideInput,
  Order,
  OrderStatus,
  Product,
  ProductInput,
  Stats,
} from '@/types'

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

// ---------------------------------------------------------------------------
// Hero carousel (home). El GET es público como el de productos; el admin sólo
// edita los slides existentes (no hay alta ni baja en el backend). La mutación
// va por el route handler BFF, que reenvía el token.
// ---------------------------------------------------------------------------

// Público. cache: 'no-store' para que los cambios del admin se reflejen en la
// home sin necesidad de redeploy.
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const res = await fetch(`${API_URL}/slides`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Error al obtener los slides')
  return res.json()
}

// ---------------------------------------------------------------------------
// Mutaciones autenticadas (ABM de productos + subida de imagen).
//
// IMPORTANTE: estas funciones reciben el `token` del backend por parámetro y NO
// deben llamarse desde el navegador. El token vive en una cookie httpOnly que
// el cliente no puede leer, así que sólo las invocan los route handlers de Next
// (app/api/admin/* y app/api/upload), que obtienen el token con auth() en el
// servidor y lo reenvían acá. Es el patrón BFF descrito arriba.
// ---------------------------------------------------------------------------

// Cabeceras comunes para llamadas autenticadas con cuerpo JSON.
function authJsonHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function createProduct(
  input: ProductInput,
  token: string
): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: authJsonHeaders(token),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('No se pudo crear el producto')
  return res.json()
}

export async function updateProduct(
  id: number,
  input: ProductInput,
  token: string
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: authJsonHeaders(token),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('No se pudo actualizar el producto')
  return res.json()
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('No se pudo eliminar el producto')
}

// Edita un slide del Hero. Protegido (ADMIN/EDITOR): se invoca desde el route
// handler BFF con el token del backend.
export async function updateHeroSlide(
  id: number,
  input: HeroSlideInput,
  token: string
): Promise<HeroSlide> {
  const res = await fetch(`${API_URL}/slides/${id}`, {
    method: 'PUT',
    headers: authJsonHeaders(token),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('No se pudo actualizar el slide')
  return res.json()
}

// ---------------------------------------------------------------------------
// Órdenes (gestión del admin). El GET está protegido (solo ADMIN), así que a
// diferencia de getProducts() recibe el token y se invoca desde el servidor.
// El cambio de estado va por el route handler BFF, igual que el ABM.
// ---------------------------------------------------------------------------

export async function getOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Error al obtener las órdenes')
  return res.json()
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
  token: string
): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: authJsonHeaders(token),
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('No se pudo actualizar el estado')
  return res.json()
}

// ---------------------------------------------------------------------------
// Estadísticas (dashboard del admin). El endpoint está protegido (solo ADMIN),
// así que igual que getOrders recibe el token y se invoca desde el servidor.
// Devuelve todas las métricas ya calculadas por el backend en un solo request.
// ---------------------------------------------------------------------------

export async function getStats(token: string): Promise<Stats> {
  const res = await fetch(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Error al obtener las estadísticas')
  return res.json()
}

// Reenvía el archivo (multipart) al backend, que lo sube a Cloudinary y
// devuelve la URL pública. El FormData ya viene armado desde el route handler.
export async function uploadImage(
  file: FormData,
  token: string
): Promise<{ url: string }> {
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: file,
  })
  if (!res.ok) throw new Error('No se pudo subir la imagen')
  return res.json()
}