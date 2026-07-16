import Image from 'next/image'
import Link from 'next/link'

// 404 global: captura cualquier URL sin match. Se renderiza dentro del root layout
// (sin Navbar/Footer), por lo que es autónoma y mantiene la identidad Moccana.
export default function NotFound() {
  return (
    <main
      className="fade-in-up min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: '#1A0D0E' }}
    >
      <Image
        src="/mocanna-logo.webp"
        alt="Moccana"
        width={180}
        height={62}
        priority
        className="mb-10"
      />

      <p className="text-7xl md:text-8xl font-bold" style={{ color: '#CD8C1F' }}>
        404
      </p>

      <h1 className="text-2xl md:text-3xl font-semibold mt-4" style={{ color: '#F5E6C8' }}>
        Página no encontrada
      </h1>

      <p className="mt-3 max-w-md text-sm" style={{ color: 'rgba(245, 230, 200, 0.6)' }}>
        La página que buscás no existe o fue movida. Volvé al inicio o explorá
        nuestro catálogo.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
        <Link
          href="/"
          className="text-sm px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
        >
          Volver al inicio
        </Link>
        <Link
          href="/products"
          className="text-sm px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ border: '1px solid rgba(200, 144, 42, 0.4)', color: '#CD8C1F' }}
        >
          Ver catálogo
        </Link>
      </div>
    </main>
  )
}
