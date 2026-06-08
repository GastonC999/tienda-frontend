const API_URL = 'http://localhost:8080/api'

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