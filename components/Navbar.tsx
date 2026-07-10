'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { CATEGORIES } from '@/lib/categories'

// Espacio mínimo (px) que debe quedar entre el logo y los enlaces; al perderlo,
// se colapsa al menú hamburguesa.
const MIN_GAP = 24

export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  const items = useCartStore(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  const rowRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Decide si los enlaces siguen entrando junto al logo. Los enlaces se miden
  // siempre con su ancho natural (incluso colapsados, vía position:absolute),
  // por lo que el cálculo es estable y no genera oscilaciones.
  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const measure = () => {
      if (!logoRef.current || !linksRef.current) return
      const styles = getComputedStyle(row)
      const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
      const available = row.clientWidth - padX
      const needed = logoRef.current.offsetWidth + linksRef.current.offsetWidth + MIN_GAP
      const next = needed > available
      setCompact(next)
      // Si la barra deja de estar colapsada, aseguramos el panel cerrado.
      if (!next) setMenuOpen(false)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(row)
    return () => observer.disconnect()
  }, [mounted, totalItemsKey(items)])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  // El logo lleva a "/"; si ya estamos en la home el <Link> no re-navega, así que
  // forzamos el scroll al top para que "vuelva al principio" en cualquier caso.
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Link "Productos" con estilos de hover reutilizados en desktop y mobile.
  const productsLink = (onNavigate?: () => void) => (
    <Link
      href="/products"
      onClick={onNavigate}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap"
      style={{
        backgroundColor: 'rgba(200, 144, 42, 0)',
        color: 'rgba(200, 144, 42, 0.8)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.18)'
        e.currentTarget.style.color = '#E0B65C'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0)'
        e.currentTarget.style.color = 'rgba(200, 144, 42, 0.8)'
      }}
    >
      Productos
    </Link>
  )

  // Enlaces del header, reutilizados en el bloque de escritorio y en el panel mobile.
  // En desktop, "Productos" abre un dropdown de categorías al pasar el mouse; en el
  // panel mobile (isMobile) el hover no aplica, así que queda como link simple.
  const renderLinks = (onNavigate?: () => void, isMobile = false) => (
    <>
      {isMobile ? (
        productsLink(onNavigate)
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setProductsOpen(true)}
          onMouseLeave={() => setProductsOpen(false)}
        >
          {productsLink(onNavigate)}
          {/* Dropdown de categorías: aparece bajo "Productos" al hacer hover. */}
          <div
            className="absolute left-0 top-full pt-2 transition-all duration-200"
            style={{
              minWidth: '13rem',
              opacity: productsOpen ? 1 : 0,
              visibility: productsOpen ? 'visible' : 'hidden',
              transform: productsOpen ? 'translateY(0)' : 'translateY(-6px)',
              pointerEvents: productsOpen ? 'auto' : 'none',
            }}
          >
            <div
              className="flex flex-col gap-1 rounded-2xl p-2"
              style={{
                backgroundColor: '#581A1B',
                border: '1px solid rgba(200, 144, 42, 0.3)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
              }}
            >
              <Link
                href="/products"
                onClick={() => setProductsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                style={{ color: 'rgba(200, 144, 42, 0.8)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.18)'
                  e.currentTarget.style.color = '#E0B65C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'rgba(200, 144, 42, 0.8)'
                }}
              >
                Todos los productos
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setProductsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm transition-all duration-200"
                  style={{ color: 'rgba(200, 144, 42, 0.8)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.18)'
                    e.currentTarget.style.color = '#E0B65C'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'rgba(200, 144, 42, 0.8)'
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <Link
        href="/cart"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap"
        style={{
          backgroundColor: 'rgba(200, 144, 42, 0.15)',
          border: '1px solid rgba(200, 144, 42, 0.4)',
          color: '#CD8C1F',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.35)'
          e.currentTarget.style.color = '#E0B65C'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.15)'
          e.currentTarget.style.color = '#CD8C1F'
        }}
      >
        <span>Carrito</span>
        {mounted && totalItems > 0 && (
          <span
            className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
            style={{ backgroundColor: '#CD8C1F', color: '#581A1B' }}
          >
            {totalItems}
          </span>
        )}
      </Link>
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap"
        style={{
          backgroundColor: 'rgba(200, 144, 42, 0)',
          color: 'rgba(200, 144, 42, 0.8)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0.18)'
          e.currentTarget.style.color = '#E0B65C'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'rgba(200, 144, 42, 0)'
          e.currentTarget.style.color = 'rgba(200, 144, 42, 0.8)'
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Ingresar</span>
      </Link>
    </>
  )

  // Variante minimal (p. ej. login): solo el logo, sin enlaces ni menú.
  if (minimal) {
    return (
      <nav
        className="fade-in sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(88, 26, 27 , 1)' : '#581A1B',
          borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center">
          <Link href="/" onClick={scrollToTop}>
            <Image
              src="/mocanna-logo.webp"
              alt="Moccana"
              width={140}
              height={48}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav
      className="fade-in sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(88, 26, 27 , 1)' : '#581A1B',
        borderBottom: '1px solid rgba(200, 144, 42, 0.2)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div
        ref={rowRef}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between"
      >
        <Link href="/" ref={logoRef} onClick={scrollToTop}>
          <Image
            src="/mocanna-logo.webp"
            alt="Moccana"
            width={140}
            height={48}
            className="object-contain"
          />
        </Link>

        {/* Enlaces en línea. Se miden siempre con su ancho natural; cuando no
            entran (compact) se ocultan sin desmontar para no perder la medición. */}
        <div
          ref={linksRef}
          aria-hidden={compact}
          className="flex items-center gap-8"
          style={
            compact
              ? {
                  position: 'absolute',
                  right: 0,
                  visibility: 'hidden',
                  pointerEvents: 'none',
                }
              : undefined
          }
        >
          {renderLinks()}
        </div>

        {/* Botón hamburguesa: solo cuando los enlaces no entran. */}
        {compact && (
          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
            style={{
              backgroundColor: 'rgba(200, 144, 42, 0.15)',
              border: '1px solid rgba(200, 144, 42, 0.4)',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="#CD8C1F"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line
                x1="3"
                y1="6"
                x2="19"
                y2="6"
                style={{
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease',
                  transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                }}
              />
              <line
                x1="3"
                y1="11"
                x2="19"
                y2="11"
                style={{
                  transition: 'opacity 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <line
                x1="3"
                y1="16"
                x2="19"
                y2="16"
                style={{
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease',
                  transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                }}
              />
            </svg>
          </button>
        )}
      </div>

      {/* Panel desplegable: solo en modo compacto. */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: compact && menuOpen ? '200px' : '0',
          opacity: compact && menuOpen ? 1 : 0,
          backgroundColor: scrolled ? 'rgba(88, 26, 27 , 1)' : '#581A1B',
          borderTop: compact && menuOpen ? '1px solid rgba(200, 144, 42, 0.2)' : 'none',
        }}
      >
        <div className="px-4 sm:px-6 py-4 flex flex-col gap-3">
          {renderLinks(() => setMenuOpen(false), true)}
        </div>
      </div>
    </nav>
  )
}

// Clave estable para re-medir cuando cambia la cantidad total del carrito
// (el badge altera el ancho de los enlaces).
function totalItemsKey(items: { quantity: number }[]) {
  return items.reduce((acc, i) => acc + i.quantity, 0)
}
