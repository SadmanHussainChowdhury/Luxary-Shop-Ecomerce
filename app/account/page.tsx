'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      // Load user orders
      fetch('/api/orders/my')
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.items || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-ocean-gray">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="bg-white border border-ocean-border rounded p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Sign In Required</h2>
          <p className="text-ocean-gray mb-6">Please sign in to view your account</p>
          <Link
            href="/login"
            className="inline-block bg-ocean-blue text-white px-6 py-3 rounded font-medium hover:bg-ocean-deep"
          >
            Sign In
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
                {(session?.user?.name?.[0] || 'U').toUpperCase()}
              </div>
              <h3 className="font-bold text-ocean-darkGray">{session?.user?.name || 'User'}</h3>
              <p className="text-sm text-ocean-gray">{session?.user?.email}</p>
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
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 p-3 rounded text-ocean-darkGray hover:bg-ocean-lighter w-full text-left"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
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
                  <div className="text-2xl font-bold text-ocean-blue mb-1">0</div>
                  <div className="text-sm text-ocean-gray">Pending Orders</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-ocean-darkGray mb-4">Recent Orders</h3>
                {loading ? (
                  <div className="text-ocean-gray">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-ocean-gray py-8 text-center">
                    No orders yet. <Link href="/products" className="text-ocean-blue hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order: any) => (
                      <Link
                        key={order._id}
                        href={`/account/orders/${order._id}`}
                        className="flex items-center justify-between p-4 border border-ocean-border rounded hover:shadow transition"
                      >
                        <div>
                          <div className="font-medium text-ocean-darkGray">Order #{order._id.slice(-8)}</div>
                          <div className="text-sm text-ocean-gray">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-ocean-blue">${order.total}</div>
                          <div className="text-xs text-ocean-gray capitalize">{order.status}</div>
                        </div>
                      </Link>
                    ))}
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

