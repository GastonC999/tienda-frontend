import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import AddToCartButton from '@/components/AddToCartButton'
import { getProduct } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let product: Product

  try {
    product = await getProduct(Number(id))
  } catch {
    return (
      <div className="text-center py-24">
        <p className="text-lg mb-4" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>Producto no encontrado</p>
        <Link href="/products" className="text-sm underline underline-offset-4" style={{ color: '#CD8C1F' }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/products"
        className="text-sm transition-colors mb-8 inline-block hover:opacity-80"
        style={{ color: 'rgba(245, 230, 200, 0.5)' }}
      >
        ← Volver
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: '#3D0A0A' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm mb-2" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>{product.category}</p>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: '#F5E6C8' }}>{product.name}</h1>
          <p className="mb-8" style={{ color: 'rgba(245, 230, 200, 0.6)' }}>{product.description}</p>
          <p className="text-2xl font-semibold mb-8" style={{ color: '#CD8C1F' }}>
            ${product.price.toLocaleString('es-AR')}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}