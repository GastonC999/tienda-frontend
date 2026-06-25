'use client'

import { createContext, useCallback, useContext, useState } from 'react'

// Sistema de notificaciones flotantes (toasts) del panel admin. Provee un
// contexto con toast.success()/toast.error() para dar feedback de cada
// operación del ABM (crear, editar, eliminar, subir imagen). Se monta una sola
// vez en AdminShell, por lo que cualquier componente del panel puede emitir.

type ToastType = 'success' | 'error'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastApi {
  success: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

// Hook para emitir toasts desde cualquier componente cliente del panel.
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

const AUTO_DISMISS_MS = 3500

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev, { id, type, message }])
      // Auto-cierre: el usuario igual puede cerrarlo antes con la X.
      setTimeout(() => remove(id), AUTO_DISMISS_MS)
    },
    [remove]
  )

  const api: ToastApi = {
    success: msg => push('success', msg),
    error: msg => push('error', msg),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Pila de toasts, esquina inferior derecha, por encima de modales. */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => {
          const accent = t.type === 'success' ? '#CD8C1F' : '#E0857C'
          return (
            <div
              key={t.id}
              role="status"
              className="fade-in pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg"
              style={{
                backgroundColor: '#581A1B',
                border: `1px solid ${accent}`,
                minWidth: 240,
                maxWidth: 360,
              }}
            >
              <span className="mt-0.5 text-sm" style={{ color: accent }}>
                {t.type === 'success' ? '✓' : '✕'}
              </span>
              <p className="flex-1 text-sm" style={{ color: '#E0B65C' }}>
                {t.message}
              </p>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => remove(t.id)}
                className="text-sm leading-none transition-opacity hover:opacity-70"
                style={{ color: 'rgba(200, 144, 42, 0.7)' }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
