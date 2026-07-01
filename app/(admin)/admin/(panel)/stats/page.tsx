import { auth } from '@/auth'
import { getStats } from '@/lib/api'
import type { Stats } from '@/types'
import StatsDashboard from '@/components/admin/stats/StatsDashboard'

// Dashboard de estadísticas del admin. El endpoint /stats está protegido (solo
// ADMIN), así que se hace en el servidor con el token de la sesión, igual que el
// listado de órdenes. El middleware ya restringe esta ruta a ADMIN. force-dynamic
// asegura métricas frescas en cada visita (sin caché).
export const dynamic = 'force-dynamic'

export default async function AdminStatsPage() {
  const session = await auth()
  const stats: Stats = await getStats(session!.user.backendToken)

  return <StatsDashboard stats={stats} />
}
