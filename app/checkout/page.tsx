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
      const orderRes = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
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
      const paymentRes = await fetch('http://localhost:8080/api/payments/create-preference', {
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
      <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-medium mb-4">Tus datos</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Email</label>
            <input
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              placeholder="juan@email.com"
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-medium mb-4">Resumen</h2>
        <div className="divide-y divide-gray-100">
          {items.map(item => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-gray-200">
          <span className="text-gray-500 text-sm">Total</span>
          <span className="text-xl font-semibold">
            ${totalPrice().toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
      </button>
    </div>
  )
}