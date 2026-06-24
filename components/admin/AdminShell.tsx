'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Sidebar from './Sidebar'
import Header from './Header'

// Devuelve false durante el SSR y el primer render de hidratación, y true
// después. Permite esperar a que la sesión persistida se rehidrate desde
// localStorage sin provocar un mismatch de hidratación.
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

// Cascarón del panel admin: protege las rutas (redirige a /login si no hay
// sesión) y arma el layout Sidebar + Header + contenido.
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user)
  const router = useRouter()
  const hydrated = useHydrated()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (hydrated && !user) router.replace('/login')
  }, [hydrated, user, router])

  if (!hydrated || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#000000', color: 'rgba(200, 144, 42, 0.6)' }}
      >
        Cargando…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#000000' }}>
      <Sidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <main className="fade-in flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
