'use client'

import { useState } from 'react'
import type { AuthUser } from '@/types'
import Sidebar from './Sidebar'
import Header from './Header'
import ToastProvider from './ToastProvider'

type SessionUser = Pick<AuthUser, 'email' | 'role'>

// Cascarón del panel admin: arma el layout Sidebar + Header + contenido. La
// protección (redirigir a /admin/login si no hay sesión) la maneja el middleware
// en el servidor; acá solo recibimos el usuario ya autenticado por props.
export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: '#000000' }}>
        <Sidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={user} onToggleSidebar={() => setSidebarOpen(o => !o)} />
          <main className="fade-in flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}
