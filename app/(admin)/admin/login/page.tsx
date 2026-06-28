'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // NextAuth valida contra el backend y guarda la sesión en una cookie httpOnly.
    const res = await signIn('credentials', { email, password, redirect: false })
    if (!res || res.error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }
    // Redirección según rol: ADMIN al panel de Estadísticas, EDITOR a Productos.
    const session = await getSession()
    router.replace(session?.user?.role === 'ADMIN' ? '/admin/stats' : '/admin/products')
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: '#000000' }}
    >
      <form
        onSubmit={handleSubmit}
        className="fade-in-up w-full max-w-sm rounded-2xl p-8"
        style={{
          backgroundColor: '#581A1B',
          border: '1px solid rgba(200, 144, 42, 0.25)',
        }}
      >
        <h1 className="mb-6 text-center text-xl font-semibold" style={{ color: '#E0B65C' }}>
          Moccana Admin
        </h1>

        <label className="mb-1 block text-sm" style={{ color: 'rgba(200, 144, 42, 0.8)' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mb-4 w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(200, 144, 42, 0.3)',
            color: '#E0B65C',
          }}
        />

        <label className="mb-1 block text-sm" style={{ color: 'rgba(200, 144, 42, 0.8)' }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mb-4 w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(200, 144, 42, 0.3)',
            color: '#E0B65C',
          }}
        />

        {error && (
          <p className="mb-4 text-sm" style={{ color: '#E0857C' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-60"
          style={{
            backgroundColor: 'rgba(200, 144, 42, 0.18)',
            border: '1px solid rgba(200, 144, 42, 0.4)',
            color: '#CD8C1F',
          }}
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
