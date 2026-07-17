import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// 404 global: captura cualquier URL sin match. Se renderiza dentro del root layout,
// por lo que trae su propia cabecera (Navbar minimal: solo el logo → home) y el
// Footer de la tienda para mantener la identidad Moccana.
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#1A0D0E' }}>
      <Navbar minimal />

      <main className="fade-in-up flex-1 flex flex-col items-center justify-center text-center px-6">
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

      <Footer />
    </div>
  )
}
