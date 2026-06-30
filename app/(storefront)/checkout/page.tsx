'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
  })
  const confirmed = useRef(false)

  if (items.length === 0 && !confirmed.current) {
    router.push('/cart')
    return null
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.customerName || !form.customerEmail) {
      alert('Completá todos los campos')
      return
    }

    setLoading(true)

    try {
      // 1. Crear la orden en nuestro backend
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/orders`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          total: totalPrice(),
          items: items.map(item => ({
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })

      if (!orderRes.ok) throw new Error('Error al crear la orden')
      const order = await orderRes.json()

      // 2. Crear la preferencia de pago en MercadoPago
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/payments/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          items.map(item => ({
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      })

      if (!paymentRes.ok) throw new Error('Error al crear el pago')
      const { initPoint } = await paymentRes.json()

      // 3. Limpiar carrito y redirigir a MercadoPago
      confirmed.current = true
      clearCart()
      window.location.href = initPoint

    } catch (error) {
      alert('Hubo un error al procesar la orden. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8" style={{ color: '#F5E6C8' }}>Checkout</h1>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#581A1B', border: '1px solid rgba(200, 144, 42, 0.2)' }}>
        <h2 className="font-medium mb-4" style={{ color: '#F5E6C8' }}>Tus datos</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'rgba(245, 230, 200, 0.6)' }}>Nombre</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#3D0A0A', border: '1px solid rgba(200, 144, 42, 0.3)', color: '#F5E6C8' }}
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'rgba(245, 230, 200, 0.6)' }}>Email</label>
            <input
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              placeholder="juan@email.com"
              type="email"
              className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#3D0A0A', border: '1px solid rgba(200, 144, 42, 0.3)', color: '#F5E6C8' }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#581A1B', border: '1px solid rgba(200, 144, 42, 0.2)' }}>
        <h2 className="font-medium mb-4" style={{ color: '#F5E6C8' }}>Resumen</h2>
        <div className="divide-y" style={{ borderColor: 'rgba(200, 144, 42, 0.15)' }}>
          {items.map(item => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span style={{ color: 'rgba(245, 230, 200, 0.7)' }}>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium" style={{ color: '#F5E6C8' }}>
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-baseline pt-4 mt-2" style={{ borderTop: '1px solid rgba(200, 144, 42, 0.2)' }}>
          <span className="text-sm" style={{ color: 'rgba(245, 230, 200, 0.6)' }}>Total</span>
          <span className="text-xl font-semibold" style={{ color: '#CD8C1F' }}>
            ${totalPrice().toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#CD8C1F', color: '#3D0A0A' }}
      >
        {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
      </button>
    </div>
  )
}