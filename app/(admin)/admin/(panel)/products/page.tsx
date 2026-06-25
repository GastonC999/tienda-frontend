import { auth } from '@/auth'
import { getProducts } from '@/lib/api'
import type { Product } from '@/types'
import ProductManager from '@/components/admin/products/ProductManager'

// Listado de productos para el ABM. El GET es público, así que se hace en el
// servidor (como en el storefront). El rol sale de la sesión y define si se
// muestran las acciones de eliminar. force-dynamic asegura datos frescos tras
// cada mutación (router.refresh()).
export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const session = await auth()
  const products: Product[] = await getProducts()

  return <ProductManager products={products} role={session!.user.role} />
}
