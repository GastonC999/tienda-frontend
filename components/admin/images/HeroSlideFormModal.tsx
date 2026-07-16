'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { HeroSlide, HeroSlideInput } from '@/types'

// Modal de edición de un slide del Hero. Sólo edición (el backend no permite
// alta ni baja). La subida de imagen va al route handler /api/upload y muestra
// el preview con la URL devuelta antes de guardar. Al guardar, delega en
// onSubmit (el HeroSlideManager hace el fetch al BFF, el toast y el refresh).
interface HeroSlideFormModalProps {
  slide: HeroSlide
  onClose: () => void
  onSubmit: (input: HeroSlideInput) => Promise<boolean>
}

export default function HeroSlideFormModal({
  slide,
  onClose,
  onSubmit,
}: HeroSlideFormModalProps) {
  const [title, setTitle] = useState(slide.title ?? '')
  const [subtitle, setSubtitle] = useState(slide.subtitle ?? '')
  const [cta, setCta] = useState(slide.cta ?? '')
  const [href, setHref] = useState(slide.href ?? '')
  const [imageUrl, setImageUrl] = useState(slide.imageUrl ?? '')
  const [fileName, setFileName] = useState('')

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Sube el archivo elegido al BFF y guarda la URL para el preview.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setFileName(file.name)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la imagen')
      setImageUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) return setError('El título es obligatorio')
    if (!imageUrl) return setError('Subí una imagen de fondo')

    setSaving(true)
    const ok = await onSubmit({
      title: title.trim(),
      subtitle: subtitle.trim(),
      cta: cta.trim(),
      href: href.trim(),
      imageUrl,
      orden: slide.orden,
    })
    // Si falló, dejamos el modal abierto para reintentar (el toast ya avisó).
    if (!ok) setSaving(false)
  }

  const labelStyle = { color: 'rgba(200, 144, 42, 0.8)' }
  const inputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(200, 144, 42, 0.3)',
    color: '#E0B65C',
  }

  return (
    // Overlay: cierra al tocar fuera; el contenido detiene la propagación.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="fade-in-up max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
        style={{
          backgroundColor: '#581A1B',
          border: '1px solid rgba(200, 144, 42, 0.25)',
        }}
      >
        <h2 className="mb-5 text-lg font-semibold" style={{ color: '#E0B65C' }}>
          Editar slide
        </h2>

        <label className="mb-1 block text-sm" style={labelStyle}>
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mb-4 w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />

        <label className="mb-1 block text-sm" style={labelStyle}>
          Subtítulo
        </label>
        <textarea
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          rows={2}
          className="mb-4 w-full resize-y rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm" style={labelStyle}>
              Texto del botón (CTA)
            </label>
            <input
              type="text"
              value={cta}
              onChange={e => setCta(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm" style={labelStyle}>
              Destino del botón
            </label>
            <input
              type="text"
              value={href}
              onChange={e => setHref(e.target.value)}
              placeholder="/products?category=Café"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        <label className="mb-1 block text-sm" style={labelStyle}>
          Imagen de fondo
        </label>
        <div className="mb-4 flex items-start gap-4">
          <div className="shrink-0">
            <div
              className="relative h-20 w-32 overflow-hidden rounded-lg"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  unoptimized
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-[10px]"
                  style={{ color: 'rgba(200, 144, 42, 0.5)' }}
                >
                  Sin imagen
                </span>
              )}
            </div>
            {/* Nombre del archivo debajo de la foto */}
            <p
              className="mt-2 w-32 truncate text-[11px]"
              style={{ color: 'rgba(200, 144, 42, 0.6)' }}
              title={fileName || undefined}
            >
              {fileName || 'Sin archivos seleccionados'}
            </p>
          </div>
          <div>
            {/* input nativo oculto: el label actúa como botón discreto */}
            <label
              className="inline-block cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(200, 144, 42, 0.3)',
                color: 'rgba(200, 144, 42, 0.8)',
              }}
            >
              Seleccionar archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {uploading && (
              <p className="mt-2 text-xs" style={{ color: '#CD8C1F' }}>
                Subiendo imagen…
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm" style={{ color: '#E0857C' }}>
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(200, 144, 42, 0.3)',
              color: 'rgba(200, 144, 42, 0.8)',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60"
            style={{
              backgroundColor: 'rgba(200, 144, 42, 0.18)',
              border: '1px solid rgba(200, 144, 42, 0.4)',
              color: '#CD8C1F',
            }}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
