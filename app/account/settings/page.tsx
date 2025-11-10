'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Heart, RefreshCw, Save } from 'lucide-react'
import Link from 'next/link'

const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const WISHLIST_STORAGE_KEY = 'worldclass_wishlist_v1'
const ORDERS_STORAGE_KEY_PREFIX = 'worldclass_orders_'

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

const DEFAULT_PROFILE = {
  name: 'Guest Shopper',
  email: 'guest@example.com',
  phone: '',
  newsletter: true,
  smsAlerts: false,
}

const SAMPLE_WISHLIST = ['ultra-hd-smart-tv', 'luxury-perfume-set']

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

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const flag = localStorage.getItem('worldclass_signed_in') === 'true'
    setSignedIn(flag)
    if (flag) {
      setProfile(loadProfile())
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]')
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0)
      const ordersKey = getOrdersStorageKey()
      const orders = ordersKey ? JSON.parse(localStorage.getItem(ordersKey) || '[]') : []
      setOrdersCount(Array.isArray(orders) ? orders.length : 0)
    }
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (typeof window === 'undefined') return
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    toast.success('Profile settings saved locally')
  }

  function restoreWishlist() {
    if (typeof window === 'undefined') return
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(SAMPLE_WISHLIST))
    setWishlistCount(SAMPLE_WISHLIST.length)
    toast.success('Demo wishlist restored')
  }

  function clearWishlist() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(WISHLIST_STORAGE_KEY)
    setWishlistCount(0)
    toast.success('Wishlist cleared')
  }

  function restoreOrders() {
    if (typeof window === 'undefined') return
    const ordersKey = getOrdersStorageKey()
    if (ordersKey) {
      localStorage.setItem(ordersKey, JSON.stringify(SAMPLE_ORDERS))
      setOrdersCount(SAMPLE_ORDERS.length)
      toast.success('Demo orders restored')
    }
  }

  function clearOrders() {
    if (typeof window === 'undefined') return
    const ordersKey = getOrdersStorageKey()
    if (ordersKey) {
      localStorage.removeItem(ordersKey)
      setOrdersCount(0)
      toast.success('Orders cleared')
    }
  }

  if (signedIn === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-ocean-gray">Loading settings…</div>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="bg-ocean-lightest min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-ocean-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Sign In Required</h2>
          <p className="text-ocean-gray mb-6">Sign in to manage your profile, wishlist, and order demo data.</p>
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
        <div>
          <h1 className="text-3xl font-bold text-ocean-darkGray">Account Settings</h1>
          <p className="text-ocean-gray">Update your profile details and manage locally stored demo data.</p>
        </div>

        <motion.form
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-2xl p-6 space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-ocean-darkGray mb-1">Profile Information</h2>
            <p className="text-sm text-ocean-gray">Changes are saved in your browser so you can customise this demo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-ocean-darkGray">
              Full Name
              <input
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                required
                className="px-4 py-3 rounded-lg border-2 border-ocean-border bg-white/60 focus:outline-none focus:border-premium-gold"
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ocean-darkGray">
              Email Address
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                required
                className="px-4 py-3 rounded-lg border-2 border-ocean-border bg-white/60 focus:outline-none focus:border-premium-gold"
                placeholder="name@example.com"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ocean-darkGray">
              Phone Number
              <input
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="px-4 py-3 rounded-lg border-2 border-ocean-border bg-white/60 focus:outline-none focus:border-premium-gold"
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-ocean-darkGray">
              <input
                type="checkbox"
                name="newsletter"
                checked={profile.newsletter}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-ocean-border text-premium-gold focus:ring-premium-gold"
              />
              Subscribe to product news & premium deals
            </label>
            <label className="flex items-center gap-3 text-sm text-ocean-darkGray">
              <input
                type="checkbox"
                name="smsAlerts"
                checked={profile.smsAlerts}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-ocean-border text-premium-gold focus:ring-premium-gold"
              />
              Get SMS alerts about order updates
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-ocean-blue text-white font-semibold hover:bg-ocean-deep"
          >
            <Save size={18} /> Save Changes
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-2xl p-6 space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-ocean-darkGray mb-1">Demo Data</h2>
            <p className="text-sm text-ocean-gray">
              Manage the locally stored wishlist and order history used to power this interactive demo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-ocean-border rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Heart className="text-ocean-blue" />
                <div>
                  <div className="font-semibold text-ocean-darkGray">Wishlist Items</div>
                  <div className="text-sm text-ocean-gray">Currently {wishlistCount} saved products</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={restoreWishlist}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-ocean-border bg-white hover:bg-ocean-lightest text-sm font-medium"
                >
                  <RefreshCw size={16} /> Restore Sample
                </button>
                <button
                  onClick={clearWishlist}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-sm font-medium text-red-600"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="border border-ocean-border rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <ShoppingInfoIcon />
                <div>
                  <div className="font-semibold text-ocean-darkGray">Order History</div>
                  <div className="text-sm text-ocean-gray">Currently {ordersCount} recorded orders</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={restoreOrders}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-ocean-border bg-white hover:bg-ocean-lightest text-sm font-medium"
                >
                  <RefreshCw size={16} /> Restore Sample
                </button>
                <button
                  onClick={clearOrders}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-sm font-medium text-red-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ShoppingInfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-ocean-blue"
    >
      <path
        d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H20C21.1046 6 22 6.89543 22 8V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V8C2 6.89543 2.89543 6 4 6H7V4ZM9 4H15V6H9V4ZM4 8V19H20V8H4Z"
        fill="currentColor"
      />
    </svg>
  )
}
