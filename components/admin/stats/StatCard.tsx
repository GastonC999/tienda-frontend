// Card de métrica del dashboard. Presentacional: muestra una etiqueta y un
// valor grande. Reusa la paleta del panel (fondo vino, acento dorado) igual
// que las tablas de admin.
interface StatCardProps {
  label: string
  value: string
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="rounded-xl px-6 py-5"
      style={{
        backgroundColor: '#581A1B',
        border: '1px solid rgba(200, 144, 42, 0.2)',
      }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: 'rgba(200, 144, 42, 0.7)' }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-3xl font-semibold"
        style={{ color: '#E0B65C' }}
      >
        {value}
      </p>
    </div>
  )
}
