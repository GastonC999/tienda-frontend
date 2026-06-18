import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
      <body>
        <Navbar />
        <main className="fade-in-up min-h-screen max-w-6xl mx-auto" style={{ padding: '40px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}