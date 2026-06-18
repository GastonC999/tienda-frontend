import Image from 'next/image'

const FOOTER_TEXT = 'rgba(200, 144, 42, 0.6)'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#581A1B', borderTop: '1px solid rgba(200, 144, 42, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Image src="/logo-recort.webp" alt="Moccana" width={120} height={40} className="object-contain mb-4" />
            <p className="text-sm" style={{ color: FOOTER_TEXT }}>
              Café y cannabis medicinal de calidad
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: '#C8902A' }}>
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
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition-opacity hover:opacity-80"
                style={{ color: FOOTER_TEXT }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24zm-4.53 4.43c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.38 4.62 2.63 1.02 3.16.82 3.73.77.57-.05 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.37-.31-.16-1.84-.91-2.13-1.01-.29-.1-.5-.16-.71.16-.21.31-.81 1.01-.99 1.22-.18.21-.37.23-.68.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54-.18-.01-.39-.01-.6-.01z" />
                </svg>
              </a>
            </div>
          </div>
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