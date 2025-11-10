'use client'

import { useEffect, useState } from 'react'
import { AliExpressProductCard } from './AliExpressProductCard'
import Link from 'next/link'

const STORAGE_KEY = 'worldclass_recent_viewed_v1'

export default function RecentlyViewed() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    loadRecentlyViewed()
  }, [])

  async function loadRecentlyViewed() {
    if (typeof window === 'undefined') return
    try {
      const slugs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').slice(0, 5)
      if (slugs.length === 0) {
        setItems([])
        return
      }

      const promises = slugs.map((slug: string) =>
        fetch(`/api/products/${slug}`)
          .then((res) => res.json())
          .catch(() => null)
      )
      const products = (await Promise.all(promises)).filter(Boolean)
      setItems(products)
    } catch (error) {
      console.error('Failed to load recently viewed:', error)
      setItems([])
    }
  }

  if (items.length === 0) return null

  return (
    <section className="bg-white mt-4">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-ocean-darkGray">Recently Viewed</h2>
          <Link href="/products" className="text-ocean-blue hover:underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((p) => (
            <AliExpressProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

