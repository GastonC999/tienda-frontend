import Image from 'next/image'

const FOOTER_TEXT = 'rgba(200, 144, 42, 0.6)'

export default function Footer({ minimal = false }: { minimal?: boolean }) {
  return (
    <footer style={{ backgroundColor: '#581A1B', borderTop: '1px solid rgba(200, 144, 42, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Image src="/mocanna-logo.webp" alt="Moccana" width={120} height={40} className="object-contain mb-4" />
            <p className="text-sm" style={{ color: FOOTER_TEXT }}>
              Café y cannabis medicinal de calidad
            </p>
          </div>

          {!minimal && (
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: '#CD8C1F' }}>
                Contáctanos
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-opacity hover:opacity-80"
                  style={{ color: FOOTER_TEXT }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>  
              </div>
            </div>
          )}
        </div>

        <div
          className="mt-4 pt-3 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid rgba(200, 144, 42, 0.15)', color: 'rgba(200, 144, 42, 0.4)' }}
        >
          <span>© 2025 Moccana. Todos los derechos reservados.</span>
          <span>Uso responsable</span>
        </div>
      </div>
    </footer>
  )
}