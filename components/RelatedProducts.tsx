'use client'

import { useRef } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

// Carousel de productos relacionados (misma categoría). Usa scroll-snap nativo
// —sin librerías— y reutiliza ProductCard. Los botones de flecha desplazan el
// riel; el scroll táctil/con trackpad funciona igual sin ellos.
export default function RelatedProducts({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null)

  if (products.length === 0) return null

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: '#F5E6C8' }}>
          Productos relacionados
        </h2>
        {products.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="w-8 h-8 rounded-md transition-colors flex items-center justify-center text-lg leading-none"
              style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              className="w-8 h-8 rounded-md transition-colors flex items-center justify-center text-lg leading-none"
              style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div
        ref={railRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {products.map(product => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-64 sm:w-72"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
