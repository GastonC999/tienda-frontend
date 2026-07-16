'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { HeroSlide, HeroSlideInput } from '@/types'
import { useToast } from '@/components/ToastProvider'
import HeroSlideFormModal from './HeroSlideFormModal'

// Orquestador de la edición del carousel Hero (client). Recibe los slides desde
// el server component. Muestra la lista de slides con preview, mantiene el
// estado del modal de edición y centraliza la llamada al route handler BFF, el
// toast de feedback y el router.refresh() que re-fetchea la lista del server.
interface HeroSlideManagerProps {
  slides: HeroSlide[]
}

export default function HeroSlideManager({ slides }: HeroSlideManagerProps) {
  const router = useRouter()
  const toast = useToast()

  const [editing, setEditing] = useState<HeroSlide | null>(null)

  // Guarda los cambios del slide en edición. Devuelve true si salió bien (el
  // modal se cierra) o false para que quede abierto y se pueda reintentar.
  const handleSubmit = async (input: HeroSlideInput): Promise<boolean> => {
    if (!editing) return false
    try {
      const res = await fetch(`/api/admin/slides/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error')

      toast.success('Slide actualizado')
      setEditing(null)
      router.refresh()
      return true
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ocurrió un error')
      return false
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: '#E0B65C' }}>
          Imágenes del carousel
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'rgba(200, 144, 42, 0.6)' }}>
          Editá los textos y la imagen de fondo de cada slide del Hero. Los cambios se
          reflejan en la home al instante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {slides.map(slide => (
          <div
            key={slide.id}
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: '#581A1B',
              border: '1px solid rgba(200, 144, 42, 0.25)',
            }}
          >
            {/* Preview de la imagen de fondo con overlay para legibilidad. */}
            <div className="relative h-40 w-full" style={{ backgroundColor: '#3D0A0A' }}>
              {slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-xs"
                  style={{ color: 'rgba(200, 144, 42, 0.5)' }}
                >
                  Sin imagen
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-bold text-white">{slide.title}</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {slide.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <span className="text-xs" style={{ color: 'rgba(200, 144, 42, 0.6)' }}>
                Botón: {slide.cta || '—'}
              </span>
              <button
                type="button"
                onClick={() => setEditing(slide)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(200, 144, 42, 0.18)',
                  border: '1px solid rgba(200, 144, 42, 0.4)',
                  color: '#CD8C1F',
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <HeroSlideFormModal
          slide={editing}
          onClose={() => setEditing(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
