import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateOrderStatus } from '@/lib/api'
import type { OrderStatus } from '@/types'

// Estados válidos, espejo del enum del backend. Sirve para validar el body antes
// de reenviarlo.
const VALID_STATUS: OrderStatus[] = ['PENDING', 'PAID', 'CANCELLED']

// BFF: cambiar el estado de una orden. Restringido a ADMIN (espejo de la
// autorización del backend y de middleware.ts). El navegador llama acá (mismo
// origen) y este handler reenvía el token del backend leído de la sesión.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Solo un ADMIN puede cambiar el estado' }, { status: 403 })
  }

  const { id } = await params
  const orderId = Number(id)
  if (!Number.isInteger(orderId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  let status: OrderStatus
  try {
    const body = (await req.json()) as { status?: OrderStatus }
    if (!body.status || !VALID_STATUS.includes(body.status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }
    status = body.status
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    const order = await updateOrderStatus(orderId, status, session.user.backendToken)
    return NextResponse.json(order)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar el estado'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
