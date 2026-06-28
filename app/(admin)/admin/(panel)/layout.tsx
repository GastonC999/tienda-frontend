import { auth } from '@/auth'
import AdminShell from '@/components/admin/AdminShell'

// Layout del panel (grupo (panel)): solo /admin/products, /admin/orders, etc.
// pasan por el cascarón. /admin/login queda fuera de este grupo, evitando un
// bucle de redirección. La sesión se lee en el servidor con auth(); el
// middleware ya garantiza que existe, así que el guard es defensivo.
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session!.user

  return (
    <AdminShell user={{ email: user.email ?? '', role: user.role }}>
      {children}
    </AdminShell>
  )
}
