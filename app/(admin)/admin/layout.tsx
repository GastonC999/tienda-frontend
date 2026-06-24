import AdminShell from '@/components/admin/AdminShell'

// Solo las rutas /admin/* pasan por el cascarón protegido. /login queda fuera
// (vive en el grupo (admin) pero sin este layout), evitando un bucle de
// redirección.
export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
