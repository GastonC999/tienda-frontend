'use client'

import type { Stats } from '@/types'
import StatCard from './StatCard'
import SalesLineChart from './SalesLineChart'
import CategoryBarChart from './CategoryBarChart'
import TopProductsTable from './TopProductsTable'

// Orquestador presentacional del dashboard. Recibe las métricas ya calculadas
// por el backend desde el server component y deriva los valores de las cards.
// Layout: fila de 3 cards → fila de 2 gráficos → tabla de top productos.
interface StatsDashboardProps {
  stats: Stats
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  const pendientes = stats.ordersByStatus.PENDING ?? 0
  const completadas = stats.ordersByStatus.PAID ?? 0
  const ventasTotales = `$${stats.totalRevenue.toLocaleString('es-AR')}`

  // El backend devuelve revenueByCategory como objeto { categoría: revenue };
  // recharts necesita un array de puntos.
  const categorias = Object.entries(stats.revenueByCategory).map(
    ([category, revenue]) => ({ category, revenue })
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold" style={{ color: '#E0B65C' }}>
        Estadísticas
      </h1>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Ventas totales" value={ventasTotales} />
        <StatCard label="Órdenes pendientes" value={pendientes.toLocaleString('es-AR')} />
        <StatCard label="Órdenes completadas" value={completadas.toLocaleString('es-AR')} />
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalesLineChart data={stats.dailyOrders} />
        <CategoryBarChart data={categorias} />
      </div>

      {/* Top 5 productos */}
      <div className="mt-6">
        <TopProductsTable products={stats.topProducts} />
      </div>
    </div>
  )
}
