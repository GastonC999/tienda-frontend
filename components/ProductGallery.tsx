'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'

// Galería del detalle de producto. El modelo actual sólo trae `image`, pero
// derivamos una lista para estar listos cuando el backend envíe `images`.
// La imagen principal cambia al pasar el mouse por una miniatura (preview) y
// también al hacer click (selección fija). Al salir del hover se vuelve a la
// seleccionada.
export default function ProductGallery({ product }: { product: Product }) {
  const images =
    product.images && product.images.length > 0 ? product.images : [product.image]

  const [selected, setSelected] = useState(0)
  const [preview, setPreview] = useState<number | null>(null)

  const activeIndex = preview ?? selected
  const activeSrc = images[activeIndex] ?? images[0]

  const hasMultiple = images.length > 1

  return (
    <div className="flex gap-3">
      {/* Imagen principal */}
      <div
        className="relative flex-1 aspect-square rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#3D0A0A' }}
      >
        <Image
          src={activeSrc}
          alt={product.name}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>

      {/* Rail de miniaturas — sólo si hay más de una imagen */}
      {hasMultiple && (
        <div className="flex flex-col gap-3 w-16 shrink-0">
          {images.map((src, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setPreview(i)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(i)}
                onBlur={() => setPreview(null)}
                onClick={() => setSelected(i)}
                aria-label={`Ver imagen ${i + 1} de ${product.name}`}
                aria-current={isActive}
                className="relative aspect-square rounded-lg overflow-hidden transition-all"
                style={{
                  backgroundColor: '#3D0A0A',
                  border: isActive
                    ? '2px solid #CD8C1F'
                    : '1px solid rgba(200, 144, 42, 0.25)',
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
