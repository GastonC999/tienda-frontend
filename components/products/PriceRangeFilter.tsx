'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { buildProductQuery } from '@/lib/productFilters'

// Slider de rango de precio construido con dos <input type="range"> superpuestos
// (sin dependencias externas). El estado se mantiene local mientras se arrastra y
// se vuelca a la URL (`minPrice`/`maxPrice`) con debounce. Si un extremo coincide
// con el bound del catálogo se omite el param, para mantener la URL limpia.
export default function PriceRangeFilter({
  min,
  max,
}: {
  min: number
  max: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const disabled = min >= max

  const urlMin = searchParams.get('minPrice')
  const urlMax = searchParams.get('maxPrice')

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const initialLow = urlMin !== null ? clamp(Number(urlMin)) : min
  const initialHigh = urlMax !== null ? clamp(Number(urlMax)) : max

  const [low, setLow] = useState(initialLow)
  const [high, setHigh] = useState(initialHigh)

  // Resincroniza con la URL cuando cambia por fuera (back/forward, limpiar, o al
  // recalcularse los bounds). Ajuste durante el render comparando con una firma
  // previa, en vez de un useEffect con setState.
  const signature = `${urlMin}|${urlMax}|${min}|${max}`
  const [prevSignature, setPrevSignature] = useState(signature)
  if (signature !== prevSignature) {
    setPrevSignature(signature)
    setLow(urlMin !== null ? clamp(Number(urlMin)) : min)
    setHigh(urlMax !== null ? clamp(Number(urlMax)) : max)
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function commit(nextLow: number, nextHigh: number) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const query = buildProductQuery(searchParams, {
        minPrice: nextLow > min ? String(nextLow) : null,
        maxPrice: nextHigh < max ? String(nextHigh) : null,
      })
      router.replace(`${pathname}${query}`, { scroll: false })
    }, 300)
  }

  function handleLow(v: number) {
    const next = Math.min(v, high)
    setLow(next)
    commit(next, high)
  }

  function handleHigh(v: number) {
    const next = Math.max(v, low)
    setHigh(next)
    commit(low, next)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Posición porcentual del tramo activo para pintar la barra.
  const range = max - min || 1
  const leftPct = useMemo(() => ((low - min) / range) * 100, [low, min, range])
  const rightPct = useMemo(() => ((high - min) / range) * 100, [high, min, range])

  const fmt = (n: number) => `$${n.toLocaleString('es-AR')}`

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs" style={{ color: 'rgba(245, 230, 200, 0.7)' }}>
        <span>Precio</span>
        <span>
          {fmt(low)} – {fmt(high)}
        </span>
      </div>

      {disabled ? (
        <p className="text-xs" style={{ color: 'rgba(245, 230, 200, 0.4)' }}>
          Sin rango disponible
        </p>
      ) : (
        <div className="relative h-6">
          {/* Riel de fondo */}
          <div
            className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: 'rgba(200, 144, 42, 0.25)' }}
          />
          {/* Tramo seleccionado */}
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{
              left: `${leftPct}%`,
              right: `${100 - rightPct}%`,
              backgroundColor: '#CD8C1F',
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={low}
            onChange={e => handleLow(Number(e.target.value))}
            aria-label="Precio mínimo"
            className="price-range-thumb pointer-events-none absolute left-0 top-0 h-6 w-full appearance-none bg-transparent"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={high}
            onChange={e => handleHigh(Number(e.target.value))}
            aria-label="Precio máximo"
            className="price-range-thumb pointer-events-none absolute left-0 top-0 h-6 w-full appearance-none bg-transparent"
          />
        </div>
      )}

      {/* Los thumbs nativos se estilizan y se rehabilitan al puntero (el input
          contenedor tiene pointer-events-none para que ambos sliders convivan). */}
      <style>{`
        .price-range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 9999px;
          background: #CD8C1F;
          border: 2px solid #3D0A0A;
          cursor: pointer;
        }
        .price-range-thumb::-moz-range-thumb {
          pointer-events: auto;
          height: 16px;
          width: 16px;
          border-radius: 9999px;
          background: #CD8C1F;
          border: 2px solid #3D0A0A;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
