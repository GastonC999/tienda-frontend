import Link from 'next/link'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>
}) {
  const { orderId } = await searchParams

  return (
    <div className="max-w-md mx-auto text-center py-24">
      <div className="text-5xl mb-6">✓</div>
      <h1 className="text-2xl font-semibold mb-2">¡Orden confirmada!</h1>
      <p className="text-gray-400 mb-2">Tu orden fue procesada correctamente.</p>
      <p className="text-sm text-gray-300 mb-8">Número de orden: #{orderId}</p>
      <Link
        href="/products"
        className="text-sm underline underline-offset-4 text-gray-600 hover:text-black"
      >
        Seguir comprando
      </Link>
    </div>
  )
}