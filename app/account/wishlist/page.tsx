'use client'

import { useEffect, useState } from 'react'
import { AliExpressProductCard } from '@/components/AliExpressProductCard'
import { Heart } from 'lucide-react'
import Link from 'next/link'

const STORAGE_KEY = 'worldclass_wishlist_v1'
const AUTH_STORAGE_KEY = 'worldclass_signed_in'

function loadWishlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const flag = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    setSignedIn(flag)
    if (flag) {
      setWishlist(loadWishlist())
      loadWishlistProducts()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadWishlistProducts() {
    setLoading(true)
    const slugs = loadWishlist()
    if (slugs.length === 0) {
      setItems([])
      setLoading(false)
      return
    }

    const promises = slugs.map((slug) =>
      fetch(`/api/products/${slug}`).then((res) => res.json()).catch(() => null)
    )
    const products = (await Promise.all(promises)).filter(Boolean)
    setItems(products)
    setLoading(false)
  }

  if (signedIn === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-ocean-gray">Loading wishlist…</div>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="bg-ocean-lightest min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-ocean-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Sign In Required</h2>
          <p className="text-ocean-gray mb-6">Sign in to view and manage your wishlist.</p>
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

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-ocean-darkGray mb-6">My Wishlist</h1>
          <div className="text-center py-12 text-ocean-gray">Loading wishlist...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ocean-lightest min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-ocean-darkGray mb-6 flex items-center gap-3">
          <Heart className="fill-ocean-blue text-ocean-blue" size={32} />
          My Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="bg-white border border-ocean-border rounded p-12 text-center">
            <Heart size={64} className="mx-auto mb-4 text-ocean-gray" />
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-2">Your wishlist is empty</h2>
            <p className="text-ocean-gray mb-6">Start adding products you love to your wishlist!</p>
            <Link
              href="/products"
              className="inline-block bg-ocean-blue text-white px-6 py-3 rounded font-medium hover:bg-ocean-deep"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((p) => (
              <AliExpressProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

