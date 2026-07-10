import Link from 'next/link'
import { Product } from '@/types'
import AddToCartButton from '@/components/AddToCartButton'
import Breadcrumb from '@/components/Breadcrumb'
import ProductGallery from '@/components/ProductGallery'
import RelatedProducts from '@/components/RelatedProducts'
import { getProduct, getProducts } from '@/lib/api'

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

  // Relacionados: misma categoría, excluyendo el producto actual. No hay endpoint
  // por categoría, así que traemos todos y filtramos. Si falla, seguimos sin ellos.
  let related: Product[] = []
  try {
    const all: Product[] = await getProducts()
    related = all.filter(p => p.category === product.category && p.id !== product.id)
  } catch {
    related = []
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Productos', href: '/products' },
          { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery product={product} />
        <div className="flex flex-col justify-center">
          <p className="text-sm mb-2" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>{product.category}</p>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: '#F5E6C8' }}>{product.name}</h1>
          <p className="text-2xl font-semibold mb-8" style={{ color: '#CD8C1F' }}>
            ${product.price.toLocaleString('es-AR')}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Descripción extendida */}
      <section className="mt-16 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F5E6C8' }}>
          Descripción
        </h2>
        <p className="leading-relaxed whitespace-pre-line" style={{ color: 'rgba(245, 230, 200, 0.7)' }}>
          {product.description}
        </p>
      </section>

      <RelatedProducts products={related} />
    </div>
  )
}
