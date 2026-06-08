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
        <p className="text-gray-400 text-lg mb-4">Producto no encontrado</p>
        <Link href="/products" className="text-sm underline underline-offset-4">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/products"
        className="text-sm text-gray-400 hover:text-black transition-colors mb-8 inline-block"
      >
        ← Volver
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400 mb-2">{product.category}</p>
          <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
          <p className="text-gray-500 mb-8">{product.description}</p>
          <p className="text-2xl font-semibold mb-8">
            ${product.price.toLocaleString('es-AR')}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}