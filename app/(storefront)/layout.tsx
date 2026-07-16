import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ToastProvider from '@/components/ToastProvider'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <Navbar />
      <main className="fade-in-up min-h-screen max-w-6xl mx-auto" style={{ padding: '40px' }}>
        {children}
      </main>
      <Footer />
    </ToastProvider>
  )
}
