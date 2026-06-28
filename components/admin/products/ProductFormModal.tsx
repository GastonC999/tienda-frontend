'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/categories'
import type { Product, ProductInput } from '@/types'

// Modal de alta/edición de producto. Si recibe `product` está en modo editar
// (precarga los campos y la imagen); si no, es alta. La subida de imagen va al
// route handler /api/upload y muestra el preview con la URL devuelta antes de
// guardar. Al guardar, delega en onSubmit (el ProductManager hace el fetch al
// BFF, el toast y el refresh).
interface ProductFormModalProps {
  product?: Product
  onClose: () => void
  onSubmit: (input: ProductInput) => Promise<boolean>
}

export default function ProductFormModal({
  product,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const isEdit = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [category, setCategory] = useState<string>(product?.category ?? CATEGORIES[0])
  const [image, setImage] = useState(product?.image ?? '')

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Sube el archivo elegido al BFF y guarda la URL para el preview.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la imagen')
      setImage(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const priceNum = Number(price)
    if (!name.trim()) return setError('El nombre es obligatorio')
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return setError('El precio debe ser mayor a 0')
    if (!category) return setError('Elegí una categoría')
    if (!image) return setError('Subí una imagen')

    setSaving(true)
    const ok = await onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      image,
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
          {isEdit ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <label className="mb-1 block text-sm" style={labelStyle}>
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mb-4 w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />

        <label className="mb-1 block text-sm" style={labelStyle}>
          Descripción
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="mb-4 w-full resize-y rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm" style={labelStyle}>
              Precio
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm" style={labelStyle}>
              Categoría
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} style={{ backgroundColor: '#581A1B' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="mb-1 block text-sm" style={labelStyle}>
          Imagen
        </label>
        <div className="mb-4 flex items-center gap-4">
          <div
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
          >
            {image ? (
              <Image
                src={image}
                alt="Preview"
                fill
                unoptimized
                sizes="80px"
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
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs"
              style={{ color: 'rgba(200, 144, 42, 0.8)' }}
            />
            {uploading && (
              <p className="mt-1 text-xs" style={{ color: '#CD8C1F' }}>
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
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  )
}
