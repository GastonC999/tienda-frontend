import type { DefaultSession } from 'next-auth'
import type { Role } from '@/types'

// Extiende los tipos de NextAuth para incluir el rol y el token del backend.
declare module 'next-auth' {
  interface User {
    role: Role
    backendToken: string
  }

  interface Session {
    user: {
      role: Role
      backendToken: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    backendToken: string
  }
}
