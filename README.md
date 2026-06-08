# Frontend — Mi Tienda

Stack: Next.js 15 · TypeScript · Tailwind CSS · Zustand

## Requisitos
- Node.js 20+

## Instalación
npm install

## Desarrollo
npm run dev → http://localhost:3000

## Estructura
app/
  layout.tsx          # Layout global (Navbar + Footer)
  page.tsx            # Home
  products/
    page.tsx          # Catálogo
    [id]/page.tsx     # Detalle de producto
  cart/page.tsx       # Carrito
components/           # Navbar, Footer, ProductCard, AddToCartButton
store/cartStore.ts    # Estado global del carrito (Zustand + localStorage)
lib/api.ts            # Llamadas al backend
types/index.ts        # Interfaces TypeScript

## Variables de entorno
El backend se consume desde http://localhost:8080/api (definido en lib/api.ts)

## Notas
- Componentes que usan Zustand necesitan 'use client'
- El backend tiene que estar corriendo para ver los productos