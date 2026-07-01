'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HeroSlide } from '@/types'

// 🔧 Ajustes manuales del Hero — modificá estos valores libremente.
//    Controlan el ancho y el padding ANTES de que entre la lógica responsive.
const HERO_CONFIG = {
  maxWidth: '60rem', // ancho máximo (72rem = max-w-6xl, igual que las categorías)
  paddingX: '1.5rem', // separación horizontal del contenido interno
  paddingY: '32px', // separación vertical del contenido interno
  minHeight: '60vh', // alto mínimo del carrusel
  borderRadius: '1.5rem', // radio de las esquinas (0 para esquinas rectas)
}

// El Hero recibe los slides desde el server (getHeroSlides). Cada slide muestra
// su imagen de fondo (imageUrl) con una capa oscura encima para legibilidad del
// texto. Conserva la rotación automática y los dots de navegación.
export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => goTo((current + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [current, slides.length])

  function goTo(index: number) {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }

  // Guarda defensiva: sin slides no renderizamos el carousel.
  if (slides.length === 0) return null

  const slide = slides[current]

  return (
    <div
      className="relative w-full mx-auto overflow-hidden transition-all duration-700"
      style={{
        minHeight: HERO_CONFIG.minHeight,
        maxWidth: HERO_CONFIG.maxWidth,
        borderRadius: HERO_CONFIG.borderRadius,
        backgroundColor: '#3D0A0A',
      }}
    >
      {/* Imagen de fondo */}
      {slide.imageUrl && (
        <Image
          src={slide.imageUrl}
          alt={slide.title}
          fill
          unoptimized
          priority
          sizes="(max-width: 960px) 100vw, 60rem"
          className={`object-cover transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {/* Capa oscura para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 pointer-events-none" />

      <div
        className={`relative mx-auto flex flex-col justify-center transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
        style={{
          minHeight: HERO_CONFIG.minHeight,
          paddingLeft: HERO_CONFIG.paddingX,
          paddingRight: HERO_CONFIG.paddingX,
          paddingTop: HERO_CONFIG.paddingY,
          paddingBottom: HERO_CONFIG.paddingY,
        }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h1>

        <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {slide.subtitle}
        </p>

        {slide.href && slide.cta && (
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold w-fit transition-all hover:gap-4"
            style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
          >
            {slide.cta} →
          </Link>
        )}

        {/* Dots */}
        <div className="flex gap-2 mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: i === current ? '#CD8C1F' : 'rgba(200, 144, 42, 0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
