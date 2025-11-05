'use client'

import { AliExpressProductCard } from '@/components/AliExpressProductCard'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(searchParams.get('sort') || 'new')

  useEffect(() => {
    loadProducts()
  }, [searchParams, sort])

  async function loadProducts() {
    setLoading(true)
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (key !== 'sort') params.set(key, value)
    })
    if (sort) params.set('sort', sort)
    
    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()
    setItems(data.items || [])
    setLoading(false)
  }

  function handleSortChange(newSort: string) {
    setSort(newSort)
    const url = new URL(window.location.href)
    url.searchParams.set('sort', newSort)
    window.history.pushState({}, '', url.toString())
    loadProducts()
  }

  return (
    <div className="bg-ocean-lightest min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ocean-darkGray">All Products</h1>
            <p className="text-ocean-gray">Explore our complete collection</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded border border-ocean-border px-3 py-2 text-sm"
            >
              <option value="new">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <Link
              href="/products/filters"
              className="px-4 py-2 text-sm border border-ocean-border rounded hover:bg-ocean-lighter"
            >
              More Filters
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-ocean-gray">Loading products...</div>
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

