'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyOrder } from '@/types'

// Gráfico de línea: órdenes por día en los últimos 30 días. El backend expone
// cantidad de órdenes por día (orderCount), no la suma de pesos, así que la
// etiqueta refleja eso. Recharts solo corre en el navegador → 'use client'.
interface SalesLineChartProps {
  data: DailyOrder[]
}

const GOLD = '#E0B65C'
const GRID = 'rgba(200, 144, 42, 0.15)'
const AXIS = 'rgba(200, 144, 42, 0.7)'

// Formatea "2026-06-25" a "25/06" para el eje X.
function formatDay(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export default function SalesLineChart({ data }: SalesLineChartProps) {
  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{
        backgroundColor: '#581A1B',
        border: '1px solid rgba(200, 144, 42, 0.2)',
      }}
    >
      <h2 className="mb-4 text-sm font-medium" style={{ color: GOLD }}>
        Órdenes por día (últimos 30 días)
      </h2>
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: AXIS }}>
          Sin datos en los últimos 30 días.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDay}
              tick={{ fill: AXIS, fontSize: 12 }}
              stroke={GRID}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: AXIS, fontSize: 12 }}
              stroke={GRID}
            />
            <Tooltip
              labelFormatter={(label) => formatDay(String(label))}
              formatter={(value) => [Number(value), 'Órdenes']}
              contentStyle={{
                backgroundColor: '#000000',
                border: `1px solid ${GRID}`,
                borderRadius: 8,
                color: GOLD,
              }}
              labelStyle={{ color: GOLD }}
            />
            <Line
              type="monotone"
              dataKey="orderCount"
              name="Órdenes"
              stroke={GOLD}
              strokeWidth={2}
              dot={{ r: 3, fill: GOLD }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
