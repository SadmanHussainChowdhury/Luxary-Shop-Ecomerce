'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react'
import { toast } from 'sonner'

const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const ORDERS_STORAGE_KEY = 'worldclass_orders_v1'
const AUTH_STORAGE_KEY = 'worldclass_signed_in'

const DEFAULT_PROFILE = {
  name: 'Guest Shopper',
  email: 'guest@example.com',
  phone: '',
}

const SAMPLE_ORDERS = [
  {
    _id: 'SO-482391',
    createdAt: '2024-05-12T10:32:00.000Z',
    total: 249.99,
    status: 'delivered',
  },
  {
    _id: 'SO-482112',
    createdAt: '2024-04-30T15:20:00.000Z',
    total: 129.0,
    status: 'processing',
  },
  {
    _id: 'SO-481993',
    createdAt: '2024-04-18T09:15:00.000Z',
    total: 89.5,
    status: 'shipped',
  },
]

function loadProfile() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) return DEFAULT_PROFILE
    const parsed = JSON.parse(stored)
    return { ...DEFAULT_PROFILE, ...parsed }
  } catch {
    return DEFAULT_PROFILE
  }
}

function loadOrders() {
  if (typeof window === 'undefined') return SAMPLE_ORDERS
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!stored) return SAMPLE_ORDERS
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return SAMPLE_ORDERS
  } catch {
    return SAMPLE_ORDERS
  }
}

export default function AccountPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const flag = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    setSignedIn(flag)
    if (flag) {
      setProfile(loadProfile())
      setOrders(loadOrders())
    }
  }, [])

  function handleSignOut() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_STORAGE_KEY)
    toast.success('Signed out')
    setSignedIn(false)
  }

  if (signedIn === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-ocean-gray">Loading account…</div>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-ocean-lightest">
        <div className="bg-white border border-ocean-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Sign In Required</h2>
          <p className="text-ocean-gray mb-6">Please sign in to access your account dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded font-medium hover:bg-ocean-deep"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ocean-lightest min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-ocean-darkGray mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white border border-ocean-border rounded p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                {(profile.name?.[0] || 'U').toUpperCase()}
              </div>
              <h3 className="font-bold text-ocean-darkGray">{profile.name}</h3>
              <p className="text-sm text-ocean-gray">{profile.email}</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-3 p-3 rounded text-ocean-darkGray hover:bg-ocean-lighter bg-ocean-lighter"
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 p-3 rounded text-ocean-darkGray hover:bg-ocean-lighter"
              >
                <ShoppingBag size={20} />
                <span>Orders</span>
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 p-3 rounded text-ocean-darkGray hover:bg-ocean-lighter"
              >
                <Heart size={20} />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 p-3 rounded text-ocean-darkGray hover:bg-ocean-lighter"
              >
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 p-3 rounded text-ocean-darkGray hover:bg-ocean-lighter w-full text-left"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
              <p className="text-xs text-ocean-gray/80 leading-relaxed pt-2 border-t border-ocean-border/60 mt-4">
                Account data is stored locally in your browser. Visit Settings to update your profile or reset demo data.
              </p>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white border border-ocean-border rounded p-6">
              <h2 className="text-xl font-bold text-ocean-darkGray mb-6">Account Overview</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-ocean-border rounded p-4">
                  <div className="text-2xl font-bold text-ocean-blue mb-1">{orders.length}</div>
                  <div className="text-sm text-ocean-gray">Total Orders</div>
                </div>
                <div className="border border-ocean-border rounded p-4">
                  <div className="text-2xl font-bold text-ocean-blue mb-1">
                    {orders.filter((o) => o.status === 'processing' || o.status === 'pending').length}
                  </div>
                  <div className="text-sm text-ocean-gray">Open Orders</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-ocean-darkGray mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <div className="text-ocean-gray py-8 text-center">
                    No orders yet. <Link href="/products" className="text-ocean-blue hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order: any) => {
                      const createdAt = new Date(order.createdAt)
                      const dateDisplay = createdAt.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      return (
                      <Link
                        key={order._id}
                        href={`/account/orders?order=${order._id}`}
                        className="flex items-center justify-between p-4 border border-ocean-border rounded hover:shadow transition"
                      >
                        <div>
                          <div className="font-medium text-ocean-darkGray">Order #{order._id.slice(-8)}</div>
                          <div className="text-sm text-ocean-gray">{dateDisplay}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-ocean-blue">${Number(order.total || 0).toFixed(2)}</div>
                          <div className="text-xs text-ocean-gray capitalize">{order.status}</div>
                        </div>
                      </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

