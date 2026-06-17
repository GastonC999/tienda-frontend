'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    title: 'Café de especialidad',
    subtitle: 'Granos seleccionados de origen único, tostados con dedicación',
    cta: 'Ver cafés',
    href: '/products?category=Caf%C3%A9',
    bg: 'from-[#3D0A0A] to-[#581A1B]',
    accent: '#C8902A',
    tag: '☕ Single Origin',
  },
  {
    title: 'Cannabis medicinal',
    subtitle: 'Aceites, tinturas y cremas para tu bienestar',
    cta: 'Ver productos',
    href: '/products?category=Cannabis%20Medicinal',
    bg: 'from-[#0A2A0A] to-[#1A4A1A]',
    accent: '#C8902A',
    tag: '🌿 Uso medicinal',
  },
  {
    title: 'Todo para tu cultivo',
    subtitle: 'Fertilizantes, carpas, luces y más',
    cta: 'Ver cultivo',
    href: '/products?category=Cultivo',
    bg: 'from-[#1A2A0A] to-[#2A4A0A]',
    accent: '#C8902A',
    tag: '🌱 Grow shop',
  },
  {
    title: 'Accesorios',
    subtitle: 'Papeles, picadores, vapers y todo lo que necesitás',
    cta: 'Ver accesorios',
    href: '/products?category=Accesorios',
    bg: 'from-[#1A0A2A] to-[#2A1A3A]',
    accent: '#C8902A',
    tag: '🛠️ Accesorios',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [current])

  function goTo(index: number) {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }

  const slide = SLIDES[current]

  return (
    <div
      className={`relative w-full bg-linear-to-br ${slide.bg} transition-all duration-700`}
      style={{ minHeight: '70vh', marginLeft: '-1rem', marginRight: '-1rem', width: 'calc(100% + 2rem)' }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative circle */}
      <div
        className="absolute right-0 top-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: slide.accent, transform: 'translate(30%, -30%)' }}
      />

      <div
        className={`relative max-w-6xl mx-auto px-4 py-24 flex flex-col justify-center transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
        style={{ minHeight: '70vh' }}
      >
        <span
          className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-6 w-fit"
          style={{ backgroundColor: 'rgba(200, 144, 42, 0.2)', color: '#C8902A', border: '1px solid rgba(200, 144, 42, 0.3)' }}
        >
          {slide.tag}
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h1>

        <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {slide.subtitle}
        </p>

        <Link
          href={slide.href}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold w-fit transition-all hover:gap-4"
          style={{ backgroundColor: '#C8902A', color: '#3D0A0A' }}
        >
          {slide.cta} →
        </Link>

        {/* Dots */}
        <div className="flex gap-2 mt-16">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: i === current ? '#C8902A' : 'rgba(200, 144, 42, 0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}