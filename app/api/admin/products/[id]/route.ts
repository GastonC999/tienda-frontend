import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateProduct, deleteProduct } from '@/lib/api'
import type { ProductInput } from '@/types'

// BFF: editar producto. Cualquier sesión válida (ADMIN o EDITOR) puede editar,
// igual que el alta. El token del backend se reenvía desde la sesión.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  let input: ProductInput
  try {
    input = (await req.json()) as ProductInput
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    const product = await updateProduct(productId, input, session.user.backendToken)
    return NextResponse.json(product)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar el producto'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

// BFF: eliminar producto. Restringido a ADMIN, espejo de la autorización del
// backend y de middleware.ts. El Sidebar/tabla ya ocultan el botón a EDITOR;
// acá lo bloqueamos también por si llaman al endpoint directo (defensa en
// profundidad).
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Solo un ADMIN puede eliminar' }, { status: 403 })
  }

  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    await deleteProduct(productId, session.user.backendToken)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al eliminar el producto'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
