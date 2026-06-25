import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { uploadImage } from '@/lib/api'

// BFF: subida de imagen. El formulario manda el archivo (multipart) a este
// handler, que reenvía el FormData al backend con el token de la sesión. El
// backend sube a Cloudinary y devuelve la URL pública, que el formulario usa
// para mostrar el preview y guardar en el producto.
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Archivo inválido' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file) {
    return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 })
  }

  try {
    const result = await uploadImage(formData, session.user.backendToken)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al subir la imagen'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
