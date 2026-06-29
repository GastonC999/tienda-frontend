import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mi tienda',
  description: 'Tienda online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: '#1A0D0E' }}>{children}</body>
    </html>
  )
}