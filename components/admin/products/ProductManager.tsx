'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, ProductInput, Role } from '@/types'
import { useToast } from '@/components/admin/ToastProvider'
import ProductsTable from './ProductsTable'
import ProductFormModal from './ProductFormModal'
import ConfirmDialog from './ConfirmDialog'

// Orquestador del ABM de productos (client). Recibe el listado y el rol desde
// el server component. Mantiene el estado del modal de formulario y del diálogo
// de confirmación, y centraliza las llamadas a los route handlers BFF, los
// toasts de feedback y el router.refresh() que re-fetchea el listado del server.
interface ProductManagerProps {
  products: Product[]
  role: Role
}

// Estado del modal de formulario: cerrado, alta o edición de un producto.
type FormState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; product: Product }

export default function ProductManager({ products, role }: ProductManagerProps) {
  const router = useRouter()
  const toast = useToast()

  const [form, setForm] = useState<FormState>({ mode: 'closed' })
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  // Crear o editar según el modo del formulario. Devuelve true si salió bien
  // (el modal se cierra) o false para que el modal quede abierto y reintentar.
  const handleSubmit = async (input: ProductInput): Promise<boolean> => {
    const editing = form.mode === 'edit' ? form.product : null
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
    const method = editing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error')

      toast.success(editing ? 'Producto actualizado' : 'Producto creado')
      setForm({ mode: 'closed' })
      router.refresh()
      return true
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ocurrió un error')
      return false
    }
  }

  // Eliminar el producto en confirmación. Restringido a ADMIN (el botón ya no
  // se muestra a EDITOR y el endpoint lo revalida con 403).
  const handleDelete = async () => {
    if (!deleting) return
    setDeletePending(true)
    try {
      const res = await fetch(`/api/admin/products/${deleting.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar')

      toast.success('Producto eliminado')
      setDeleting(null)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar')
    } finally {
      setDeletePending(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: '#E0B65C' }}>
          Productos
        </h1>
        <button
          type="button"
          onClick={() => setForm({ mode: 'create' })}
          className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: 'rgba(200, 144, 42, 0.18)',
            border: '1px solid rgba(200, 144, 42, 0.4)',
            color: '#CD8C1F',
          }}
        >
          ＋ Nuevo producto
        </button>
      </div>

      <ProductsTable
        products={products}
        role={role}
        onEdit={product => setForm({ mode: 'edit', product })}
        onDelete={product => setDeleting(product)}
      />

      {form.mode !== 'closed' && (
        <ProductFormModal
          product={form.mode === 'edit' ? form.product : undefined}
          onClose={() => setForm({ mode: 'closed' })}
          onSubmit={handleSubmit}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Seguro que querés eliminar “${deleting.name}”? Esta acción no se puede deshacer.`}
          loading={deletePending}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
