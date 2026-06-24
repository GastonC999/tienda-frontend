'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  roles: Role[]
}

// Links del panel con los roles que pueden verlos. EDITOR solo accede a
// Productos e Imágenes; Órdenes y Estadísticas quedan restringidas a ADMIN,
// igual que en la autorización del backend (SecurityConfig.java).
const NAV: NavItem[] = [
  { label: 'Productos', href: '/admin/products', roles: ['ADMIN', 'EDITOR'] },
  { label: 'Órdenes', href: '/admin/orders', roles: ['ADMIN'] },
  { label: 'Estadísticas', href: '/admin/stats', roles: ['ADMIN'] },
  { label: 'Imágenes', href: '/admin/images', roles: ['ADMIN', 'EDITOR'] },
]

interface SidebarProps {
  role: Role
  open: boolean
  onClose: () => void
}

export default function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const items = NAV.filter(item => item.roles.includes(role))

  return (
    <>
      {/* Overlay para mobile: oscurece el contenido y cierra al tocar fuera. */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/60 transition-opacity duration-300 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden
      />

      <aside
        className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col transition-transform duration-300 md:static md:translate-x-0"
        style={{
          backgroundColor: '#581A1B',
          borderRight: '1px solid rgba(200, 144, 42, 0.2)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div
          className="flex h-16 items-center px-6 text-lg font-semibold"
          style={{
            color: '#E0B65C',
            borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
          }}
        >
          Moccana Admin
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {items.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? 'rgba(200, 144, 42, 0.18)' : 'transparent',
                  color: active ? '#E0B65C' : 'rgba(200, 144, 42, 0.8)',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
