'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { buildProductQuery } from '@/lib/productFilters'

// Buscador por nombre. Mantiene su propio estado mientras el usuario escribe y
// refleja el valor en la URL (`q`) con debounce, usando router.replace para no
// llenar el historial con cada tecla.
export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlValue = searchParams.get('q') ?? ''
  const [value, setValue] = useState(urlValue)

  // Sincroniza el input cuando la URL cambia por fuera (back/forward, limpiar).
  // Patrón recomendado de React: ajustar estado durante el render comparando con
  // el valor previo, en vez de un useEffect con setState.
  const [prevUrlValue, setPrevUrlValue] = useState(urlValue)
  if (urlValue !== prevUrlValue) {
    setPrevUrlValue(urlValue)
    setValue(urlValue)
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function pushValue(next: string) {
    const query = buildProductQuery(searchParams, { q: next.trim() || null })
    router.replace(`${pathname}${query}`, { scroll: false })
  }

  function handleChange(next: string) {
    setValue(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushValue(next), 300)
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setValue('')
    pushValue('')
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="relative w-full">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-3xl leading-none"
        style={{ color: 'rgba(200, 144, 42, 0.7)' }}
        aria-hidden
      >
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="Buscar productos…"
        aria-label="Buscar productos por nombre"
        className="w-full rounded-lg py-2 pl-9 pr-9 text-sm outline-none"
        style={{
          backgroundColor: '#3D0A0A',
          color: '#F5E6C8',
          border: '2px solid rgba(200, 144, 42, 0.4)',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm"
          style={{ color: 'rgba(245, 230, 200, 0.6)' }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
