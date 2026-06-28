import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Rutas del panel restringidas a ADMIN (igual que la autorización del backend
// en SecurityConfig.java). El Sidebar ya oculta estos links a un EDITOR; acá
// además bloqueamos el acceso por URL directa.
const ADMIN_ONLY = ['/admin/orders', '/admin/stats']

// "Guardia" en el servidor: corre antes de servir cualquier ruta /admin/*.
export default auth(req => {
  const { pathname, origin } = req.nextUrl

  // El login es público (si no, se produciría un bucle de redirección).
  if (pathname === '/admin/login') return NextResponse.next()

  // Sin sesión → al login.
  if (!req.auth) {
    return NextResponse.redirect(new URL('/admin/login', origin))
  }

  // EDITOR intentando entrar a una ruta solo-ADMIN por URL → a su panel.
  if (
    req.auth.user?.role !== 'ADMIN' &&
    ADMIN_ONLY.some(p => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.redirect(new URL('/admin/products', origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
