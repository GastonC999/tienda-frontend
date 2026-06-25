'use client'

// Diálogo de confirmación reutilizable. Lo usa el ABM antes de eliminar un
// producto (criterio "Confirmación antes de eliminar"). Es controlado: el
// padre decide cuándo mostrarlo y qué hacer en onConfirm.
interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in-up w-full max-w-sm rounded-2xl p-6"
        style={{
          backgroundColor: '#581A1B',
          border: '1px solid rgba(200, 144, 42, 0.25)',
        }}
      >
        <h2 className="mb-2 text-lg font-semibold" style={{ color: '#E0B65C' }}>
          {title}
        </h2>
        <p className="mb-6 text-sm" style={{ color: 'rgba(200, 144, 42, 0.8)' }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
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
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60"
            style={{
              backgroundColor: 'rgba(224, 133, 124, 0.15)',
              border: '1px solid rgba(224, 133, 124, 0.5)',
              color: '#E0857C',
            }}
          >
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
