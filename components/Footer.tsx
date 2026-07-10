'use client'

import Image from 'next/image'
import Link from 'next/link'

const FOOTER_TEXT = 'rgba(200, 144, 42, 0.6)'

// Vuelve al inicio: si ya estamos en la home, el <Link href="/"> no re-navega,
// así que forzamos el scroll al top para que el logo siempre "lleve al principio".
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function Footer({ minimal = false }: { minimal?: boolean }) {
  return (
    <footer style={{ backgroundColor: '#581A1B', borderTop: '1px solid rgba(200, 144, 42, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Link href="/" onClick={scrollToTop} aria-label="Ir al inicio" className="inline-block">
              <Image src="/mocanna-logo.webp" alt="Moccana" width={120} height={40} className="object-contain mb-4" />
            </Link>
            <p className="text-sm" style={{ color: FOOTER_TEXT }}>
              Café, cultivo y bienestar
            </p>
          </div>

          {!minimal && (
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: '#CD8C1F' }}>
                Contáctanos
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/5493516859439"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="transition-opacity hover:opacity-80"
                  style={{ color: FOOTER_TEXT }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  href="mailto:mocannagrow@gmail.com"
                  aria-label="Correo electrónico"
                  className="transition-opacity hover:opacity-80"
                  style={{ color: FOOTER_TEXT }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/mocanna.arg/"
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
                  href="https://linktr.ee/mocannagrow"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Linktree"
                  className="transition-opacity hover:opacity-80"
                  style={{ color: FOOTER_TEXT }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M12 8 6 4.5" />
                    <path d="m12 8 6-3.5" />
                    <path d="M12 13 5.5 9.5" />
                    <path d="M12 13l6.5-3.5" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>

        <div
          className="mt-4 pt-3 flex items-center text-xs"
          style={{ borderTop: '1px solid rgba(200, 144, 42, 0.15)', color: 'rgba(200, 144, 42, 0.4)' }}
        >
          <span>© 2025 Moccana. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  )
}