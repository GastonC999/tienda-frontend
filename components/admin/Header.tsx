'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import type { AuthUser } from '@/types'

interface HeaderProps {
  user: AuthUser
  onToggleSidebar: () => void
}

export default function Header({ user, onToggleSidebar }: HeaderProps) {
  const router = useRouter()
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <header
      className="flex h-16 items-center justify-between px-4 sm:px-6"
      style={{
        backgroundColor: '#581A1B',
        borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
      }}
    >
      {/* Hamburguesa: solo en mobile, abre/cierra el sidebar. */}
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={onToggleSidebar}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 md:hidden"
        style={{
          backgroundColor: 'rgba(200, 144, 42, 0.15)',
          border: '1px solid rgba(200, 144, 42, 0.4)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#CD8C1F" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="19" y2="6" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </svg>
      </button>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-sm font-medium" style={{ color: '#E0B65C' }}>
            {user.email}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
            style={{ backgroundColor: 'rgba(200, 144, 42, 0.18)', color: '#CD8C1F' }}
          >
            {user.role}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
          style={{
            backgroundColor: 'rgba(200, 144, 42, 0.15)',
            border: '1px solid rgba(200, 144, 42, 0.4)',
            color: '#CD8C1F',
          }}
        >
          Salir
        </button>
      </div>
    </header>
  )
}
