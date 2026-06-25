import { auth } from '@/auth'
import { getOrders } from '@/lib/api'
import type { Order } from '@/types'
import OrderManager from '@/components/admin/orders/OrderManager'

// Listado de órdenes para el admin. El GET está protegido, así que se hace en
// el servidor con el token de la sesión (a diferencia del listado de productos,
// que es público). El middleware ya restringe esta ruta a ADMIN. force-dynamic
// asegura datos frescos tras cada cambio de estado (router.refresh()).
export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const session = await auth()
  const orders: Order[] = await getOrders(session!.user.backendToken)

  return <OrderManager orders={orders} />
}
