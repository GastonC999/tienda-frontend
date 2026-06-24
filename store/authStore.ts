import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '@/types'

interface AuthStore {
  user: AuthUser | null
  setSession: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setSession: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
)
