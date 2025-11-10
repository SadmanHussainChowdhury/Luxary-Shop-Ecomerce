'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, RefreshCw, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

const ORDERS_STORAGE_KEY_PREFIX = 'worldclass_orders_'
const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'

function getOrdersStorageKey(): string {
  if (typeof window === 'undefined') return ''
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) return ''
    const parsed = JSON.parse(stored)
    const email = parsed?.email || ''
    if (!email) return ''
    return `${ORDERS_STORAGE_KEY_PREFIX}${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  } catch {
    return ''
  }
}

const SAMPLE_ORDERS = [
  {
    _id: 'SO-482391',
    createdAt: '2024-05-12T10:32:00.000Z',
    total: 249.99,
    status: 'delivered',
    items: [
      { title: 'Ultra HD Smart TV', quantity: 1, price: 199.99 },
      { title: 'Premium HDMI Cable', quantity: 2, price: 25 },
    ],
    shippingAddress: '221B Baker Street, London, UK',
  },
  {
    _id: 'SO-482112',
    createdAt: '2024-04-30T15:20:00.000Z',
    total: 129.0,
    status: 'processing',
    items: [
      { title: 'Luxury Silk Scarf', quantity: 1, price: 79 },
      { title: 'Designer Wallet', quantity: 1, price: 50 },
    ],
    shippingAddress: '742 Evergreen Terrace, Springfield',
  },
  {
    _id: 'SO-481993',
    createdAt: '2024-04-18T09:15:00.000Z',
    total: 89.5,
    status: 'shipped',
    items: [
      { title: 'Wireless Earbuds Pro', quantity: 1, price: 89.5 },
    ],
    shippingAddress: '31 Spooner Street, Quahog',
  },
]

function loadOrders() {
  if (typeof window === 'undefined') return []
  try {
    const storageKey = getOrdersStorageKey()
    if (!storageKey) return []
    const stored = localStorage.getItem(storageKey)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return []
  } catch {
    return []
  }
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const flag = localStorage.getItem('worldclass_signed_in') === 'true'
    setSignedIn(flag)
    if (flag) {
      setOrders(loadOrders())
    }
  }, [])

  useEffect(() => {
    if (!signedIn) return
    const orderId = searchParams.get('order')
    if (orderId) {
      setExpanded(orderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, signedIn])

  const stats = useMemo(() => {
    const deliveries = orders.filter((o) => o.status === 'delivered').length
    const open = orders.filter((o) => o.status !== 'delivered').length
    return { total: orders.length, deliveries, open }
  }, [orders])

  function resetOrders() {
    if (typeof window === 'undefined') return
    const storageKey = getOrdersStorageKey()
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(SAMPLE_ORDERS))
      setOrders(SAMPLE_ORDERS)
      setExpanded(null)
      toast.success('Demo orders restored')
    }
  }

  function clearOrders() {
    if (typeof window === 'undefined') return
    const storageKey = getOrdersStorageKey()
    if (storageKey) {
      localStorage.removeItem(storageKey)
      setOrders([])
      setExpanded(null)
      toast.success('Orders cleared')
    }
  }

  if (signedIn === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-ocean-gray">Loading orders…</div>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="bg-ocean-lightest min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-ocean-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Sign In Required</h2>
          <p className="text-ocean-gray mb-6">Sign in to view your order history and tracking updates.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded font-medium hover:bg-ocean-deep"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ocean-lightest min-h-screen">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-darkGray">My Orders</h1>
            <p className="text-ocean-gray">Track purchases and view order history. Stored locally for demo purposes.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetOrders}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-ocean-border bg-white hover:bg-ocean-lightest font-medium text-sm"
            >
              <RefreshCw size={16} /> Restore Sample
            </button>
            <button
              onClick={clearOrders}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 font-medium text-sm text-red-600"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-ocean-border rounded-xl p-4">
            <div className="text-sm text-ocean-gray">Total Orders</div>
            <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-ocean-blue">
              <ShoppingBag size={20} /> {stats.total}
            </div>
          </div>
          <div className="bg-white border border-ocean-border rounded-xl p-4">
            <div className="text-sm text-ocean-gray">Delivered</div>
            <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-green-600">
              <Truck size={20} /> {stats.deliveries}
            </div>
          </div>
          <div className="bg-white border border-ocean-border rounded-xl p-4">
            <div className="text-sm text-ocean-gray">Open Orders</div>
            <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-orange-500">
              <Package size={20} /> {stats.open}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-ocean-border rounded-2xl p-10 text-center">
            <ShoppingBag size={56} className="mx-auto mb-4 text-ocean-gray" />
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-2">No orders yet</h2>
            <p className="text-ocean-gray mb-6">
              Place your first order to see it appear here. All data is stored safely in your browser.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ocean-blue text-white font-semibold hover:bg-ocean-deep"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isOpen = expanded === order._id
              const createdAt = new Date(order.createdAt)
              const dateDisplay = createdAt.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
              const timeDisplay = createdAt.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-ocean-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded((prev) => (prev === order._id ? null : order._id))}
                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-left hover:bg-ocean-lightest transition"
                  >
                    <div>
                      <div className="text-sm text-ocean-gray uppercase">Order</div>
                      <div className="text-lg font-semibold text-ocean-darkGray">#{order._id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ocean-gray uppercase">Date</div>
                      <div className="font-medium text-ocean-darkGray">{dateDisplay}</div>
                      <div className="text-xs text-ocean-gray">{timeDisplay}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ocean-gray uppercase">Total</div>
                      <div className="font-bold text-ocean-blue">${order.total.toFixed(2)}</div>
                    </div>
                    <div className="text-sm font-semibold text-ocean-darkGray capitalize">
                      Status: <span className="text-ocean-blue">{order.status}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 space-y-4">
                      <div>
                        <h3 className="font-semibold text-ocean-darkGray mb-2">Items</h3>
                        <div className="space-y-2">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between border border-ocean-border rounded-lg px-3 py-2">
                              <div>
                                <div className="font-medium text-ocean-darkGray">{item.title}</div>
                                <div className="text-xs text-ocean-gray">Qty {item.quantity}</div>
                              </div>
                              <div className="font-semibold text-ocean-darkGray">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.shippingAddress && (
                        <div>
                          <h3 className="font-semibold text-ocean-darkGray mb-2">Shipping Address</h3>
                          <p className="text-ocean-gray text-sm leading-relaxed">{order.shippingAddress}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
