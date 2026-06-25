import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createProduct } from '@/lib/api'
import type { ProductInput } from '@/types'

// BFF: crear producto. El navegador llama acá (mismo origen) y este handler,
// que corre en el servidor, lee el token del backend de la sesión y lo reenvía.
// Así el token nunca sale de la cookie httpOnly hacia el cliente.
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let input: ProductInput
  try {
    input = (await req.json()) as ProductInput
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    const product = await createProduct(input, session.user.backendToken)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al crear el producto'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
