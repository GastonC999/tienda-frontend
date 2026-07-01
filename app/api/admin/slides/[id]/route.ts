import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateHeroSlide } from '@/lib/api'
import type { HeroSlideInput } from '@/types'

// BFF: editar un slide del Hero. Cualquier sesión válida (ADMIN o EDITOR) puede
// editar, igual que el ABM de productos. No hay alta ni baja de slides: el
// backend sólo expone PUT. El token del backend se reenvía desde la sesión.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const slideId = Number(id)
  if (!Number.isInteger(slideId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  let input: HeroSlideInput
  try {
    input = (await req.json()) as HeroSlideInput
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    const slide = await updateHeroSlide(slideId, input, session.user.backendToken)
    return NextResponse.json(slide)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar el slide'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
