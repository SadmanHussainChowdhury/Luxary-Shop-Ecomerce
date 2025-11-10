'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { User, ShoppingBag, Heart, Settings, LogOut, Activity, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getActivities, getActivityStats, trackActivity, clearActivities } from '@/lib/activity-tracker'

const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const ORDERS_STORAGE_KEY_PREFIX = 'worldclass_orders_'
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

export default function AccountPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [activityStats, setActivityStats] = useState<any>({
    productViews: 0,
    cartAdds: 0,
    total: 0,
    signIns: 0,
    orders: 0,
    searches: 0,
  })

  function refreshAccountData() {
    if (typeof window === 'undefined') return
    const profile = loadProfile()
    const orders = loadOrders()
    const activities = getActivities(20)
    const stats = getActivityStats()
    
    setProfile(profile)
    setOrders(orders)
    setActivities(activities)
    setActivityStats(stats)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const flag = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    setSignedIn(flag)
    if (flag) {
      refreshAccountData()
      
      // Track page view
      trackActivity('page_view', { page: '/account' })
      
      // Refresh data after tracking (in case tracking added new activity)
      setTimeout(() => {
        refreshAccountData()
      }, 100)
    }
  }, [])

  function handleSignOut() {
    if (typeof window === 'undefined') return
    trackActivity('sign_out', { page: '/account' })
    localStorage.removeItem(AUTH_STORAGE_KEY)
    toast.success('Signed out')
    setSignedIn(false)
  }

  function handleClearActivityCache() {
    if (typeof window === 'undefined') return
    clearActivities()
    // Refresh all data after clearing
    refreshAccountData()
    toast.success('Activity cache cleared')
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                <div className="border border-ocean-border rounded p-4">
                  <div className="text-2xl font-bold text-premium-gold mb-1">
                    {activityStats?.productViews || 0}
                  </div>
                  <div className="text-sm text-ocean-gray">Product Views</div>
                </div>
                <div className="border border-ocean-border rounded p-4">
                  <div className="text-2xl font-bold text-premium-gold mb-1">
                    {activityStats?.cartAdds || 0}
                  </div>
                  <div className="text-sm text-ocean-gray">Cart Adds</div>
                </div>
              </div>

              <div className="mb-6">
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

              {/* Activity Tracking Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={20} className="text-premium-gold" />
                    <h3 className="font-semibold text-ocean-darkGray">Recent Activity</h3>
                  </div>
                  {activities.length > 0 && (
                    <button
                      onClick={handleClearActivityCache}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 transition"
                      title="Clear activity cache"
                    >
                      <Trash2 size={14} />
                      Clear Cache
                    </button>
                  )}
                </div>
                {activities.length === 0 ? (
                  <div className="text-ocean-gray py-8 text-center text-sm">
                    No activity tracked yet. Start browsing to see your activity history.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {activities.slice(0, 10).map((activity: any) => {
                      const activityDate = new Date(activity.timestamp)
                      const timeDisplay = activityDate.toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      
                      const getActivityLabel = () => {
                        switch (activity.type) {
                          case 'sign_in':
                            return 'Signed in'
                          case 'sign_out':
                            return 'Signed out'
                          case 'product_view':
                            return `Viewed product: ${activity.details?.productSlug || 'Unknown'}`
                          case 'cart_add':
                            return `Added to cart: ${activity.details?.productTitle || activity.details?.productSlug || 'Unknown'}`
                          case 'wishlist_add':
                            return `Added to wishlist: ${activity.details?.productSlug || 'Unknown'}`
                          case 'wishlist_remove':
                            return `Removed from wishlist: ${activity.details?.productSlug || 'Unknown'}`
                          case 'search':
                            return `Searched for: "${activity.details?.searchQuery || 'Unknown'}"`
                          case 'order_placed':
                            return `Placed order: #${activity.details?.orderId || 'Unknown'}`
                          case 'page_view':
                            return `Visited: ${activity.details?.page || 'Unknown'}`
                          default:
                            return activity.type.replace('_', ' ')
                        }
                      }
                      
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 border border-ocean-border rounded text-sm bg-ocean-lightest/50"
                        >
                          <div className="flex-1">
                            <div className="text-ocean-darkGray font-medium">{getActivityLabel()}</div>
                            <div className="text-xs text-ocean-gray">{timeDisplay}</div>
                          </div>
                        </div>
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

