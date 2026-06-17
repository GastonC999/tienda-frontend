import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#581A1B', borderTop: '1px solid rgba(200, 144, 42, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Image src="/logo.webp" alt="Moccana" width={120} height={40} className="object-contain mb-4" />
            <p className="text-sm" style={{ color: 'rgba(200, 144, 42, 0.6)' }}>
              Café y cannabis medicinal de calidad
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: '#C8902A' }}>
                Tienda
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/products" className="text-sm" style={{ color: 'rgba(200, 144, 42, 0.6)' }}>
                  Productos
                </Link>
                <Link href="/cart" className="text-sm" style={{ color: 'rgba(200, 144, 42, 0.6)' }}>
                  Carrito
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid rgba(200, 144, 42, 0.15)', color: 'rgba(200, 144, 42, 0.4)' }}
        >
          <span>© 2025 Moccana. Todos los derechos reservados.</span>
          <span>Uso responsable</span>
        </div>
      </div>
    </footer>
  )
}