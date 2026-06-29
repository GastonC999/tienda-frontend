import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { login } from '@/lib/api'
import type { Role } from '@/types'

// Configuración central de NextAuth. Usa un Credentials provider que delega la
// validación en el backend (vía login() de lib/api.ts). El token del backend y
// el rol se guardan dentro del JWT de NextAuth, que viaja en una cookie httpOnly
// (el navegador no puede leerla por JavaScript → protege contra XSS).
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async credentials => {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) return null
        try {
          const user = await login(email, password)
          // Lo retornado se serializa dentro del JWT (callback jwt).
          return { email: user.email, role: user.role, backendToken: user.token }
        } catch {
          // Credenciales inválidas u otro error → login fallido.
          return null
        }
      },
    }),
  ],
  callbacks: {
    // En el primer login, `user` está presente: copiamos rol y token al JWT.
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role
        token.backendToken = (user as { backendToken: string }).backendToken
      }
      return token
    },
    // Exponemos rol y token del backend en la sesión que leen los componentes.
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role
        session.user.backendToken = token.backendToken as string
      }
      return session
    },
  },
})
