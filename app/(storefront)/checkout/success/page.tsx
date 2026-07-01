import Link from 'next/link'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>
}) {
  const { orderId } = await searchParams

  return (
    <div className="max-w-md mx-auto text-center py-24">
      <div className="text-5xl mb-6" style={{ color: '#CD8C1F' }}>✓</div>
      <h1 className="text-2xl font-semibold mb-2" style={{ color: '#F5E6C8' }}>¡Orden confirmada!</h1>
      <p className="mb-2" style={{ color: 'rgba(245, 230, 200, 0.6)' }}>Tu orden fue procesada correctamente.</p>
      <p className="text-sm mb-8" style={{ color: 'rgba(245, 230, 200, 0.4)' }}>Número de orden: #{orderId}</p>
      <Link
        href="/products"
        className="text-sm underline underline-offset-4 transition-colors hover:opacity-80"
        style={{ color: '#CD8C1F' }}
      >
        Seguir comprando
      </Link>
    </div>
  )
}