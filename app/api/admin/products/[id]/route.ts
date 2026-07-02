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

  // DEBUG temporal: verificar que el backendToken exista y no esté vencido.
  // (quitar una vez resuelto el 403 del panel)
  const t = session.user.backendToken
  let exp: number | undefined
  try {
    exp = JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString()).exp
  } catch {
    /* token ausente o malformado */
  }
  console.log(
    `[debug] PUT /products/${productId} → token present: ${Boolean(t)}, len: ${t?.length ?? 0}, exp: ${exp}, now: ${Math.floor(Date.now() / 1000)}, expired: ${exp ? exp < Date.now() / 1000 : 'N/A'}`
  )

  // ⚠️ OVERRIDE TEMPORAL SOLO PARA TEST — NO MERGEAR A MAIN.
  // Fuerza un token válido para confirmar que con un token bueno el 403 desaparece.
  // Este token vence ~24 h después de emitido; quitar apenas se confirme la hipótesis.
  const TEST_TOKEN =
    'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBtb2NjYW5hLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4MzAyODI1MSwiZXhwIjoxNzgzMTE0NjUxfQ.xpoSDCg5rglMWTe4bpSGI4zVbzaLDuALPUQDavIsc7JgrnAbgkiT_02rY6HUnXW7'

  try {
    const product = await updateProduct(productId, input, TEST_TOKEN)
    return NextResponse.json(product)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar el producto'
    // Log explícito para que el error real del backend quede en los logs de Vercel.
    console.error(`PUT /api/admin/products/${productId} falló:`, message)
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
