'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Gráfico de barras: ventas (revenue) por categoría. Solo cuenta órdenes PAID
// (lo impone el backend). Recibe el objeto revenueByCategory ya transformado a
// array. Recharts solo corre en el navegador → 'use client'.
interface CategoryDatum {
  category: string
  revenue: number
}

interface CategoryBarChartProps {
  data: CategoryDatum[]
}

const GOLD = '#E0B65C'
const GRID = 'rgba(200, 144, 42, 0.15)'
const AXIS = 'rgba(200, 144, 42, 0.7)'

function formatMoney(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

export default function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{
        backgroundColor: '#581A1B',
        border: '1px solid rgba(200, 144, 42, 0.2)',
      }}
    >
      <h2 className="mb-4 text-sm font-medium" style={{ color: GOLD }}>
        Ventas por categoría
      </h2>
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: AXIS }}>
          Sin ventas registradas.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="category" tick={{ fill: AXIS, fontSize: 12 }} stroke={GRID} />
            <YAxis
              tickFormatter={formatMoney}
              tick={{ fill: AXIS, fontSize: 12 }}
              stroke={GRID}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'rgba(200, 144, 42, 0.08)' }}
              formatter={(value) => [formatMoney(Number(value)), 'Ventas']}
              contentStyle={{
                backgroundColor: '#000000',
                border: `1px solid ${GRID}`,
                borderRadius: 8,
                color: GOLD,
              }}
              labelStyle={{ color: GOLD }}
            />
            <Bar dataKey="revenue" name="Ventas" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
