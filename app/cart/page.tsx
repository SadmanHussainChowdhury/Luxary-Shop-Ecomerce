'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type CartItem = { slug: string; title: string; price: number; image?: string; quantity: number }

const STORAGE_KEY = 'up_premium_cart_v1'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setItems(loadCart())
  }, [])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  function updateQuantity(slug: string, q: number) {
    setItems((prev) => {
      const next = prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, Math.min(99, q)) } : i))
      saveCart(next)
      return next
    })
  }

  function removeItem(slug: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug)
      saveCart(next)
      return next
    })
  }

  async function checkout() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(({ slug, quantity }) => ({ slug, quantity })) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (typeof window !== 'undefined' && data.url) {
        window.location.href = data.url
      }
    } catch (e: any) {
      setMessage(e.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-ocean-lightGray min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-ocean-darkGray">Your Cart</h1>
        {message && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</div>}
        {items.length === 0 ? (
          <div className="bg-white border border-ocean-border rounded p-8 text-center">
            <p className="text-ocean-gray mb-4">Your cart is empty.</p>
            <Link href="/products" className="inline-flex items-center justify-center rounded bg-ocean-red px-6 py-2 text-white font-medium hover:bg-ocean-darkRed">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div key={item.slug} className="bg-white border border-ocean-border rounded flex items-center gap-4 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-ocean-border bg-ocean-lightest text-sm font-semibold text-ocean-gray">
                    {index + 1}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop'}
                    alt={item.title}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-ocean-darkGray">{item.title}</div>
                      <div className="font-bold text-ocean-red">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.slug, Number(e.target.value))}
                        className="w-20 rounded border border-ocean-border px-3 py-2 text-sm"
                      />
                      <button onClick={() => removeItem(item.slug)} className="text-ocean-red hover:underline text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-ocean-border rounded p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-ocean-border">
                <span className="text-ocean-gray">Subtotal</span>
                <span className="text-xl font-bold text-ocean-red">${subtotal.toFixed(2)}</span>
              </div>
              <p className="mb-4 text-sm text-ocean-gray">Taxes and shipping calculated at checkout.</p>
              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-r from-premium-gold to-premium-amber text-white py-3 px-4 rounded-lg font-bold text-center hover:shadow-xl transition disabled:opacity-50"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


