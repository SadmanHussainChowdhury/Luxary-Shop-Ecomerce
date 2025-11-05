'use client'

import { AliExpressProductCard } from '@/components/AliExpressProductCard'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const categoryNames: Record<string, string> = {
  'Electronics': 'Electronics',
  'Apparel': 'Fashion',
  'Home': 'Home & Garden',
  'Audio': 'Audio',
  'Bags': 'Bags',
  'Accessories': 'Accessories',
  'Beauty': 'Beauty',
  'Sports': 'Sports',
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(searchParams.get('sort') || 'new')
  const searchQuery = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const categoryName = categoryParam ? categoryNames[categoryParam] || categoryParam : ''

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
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-ocean-darkGray">
              {searchQuery 
                ? `Search Results for "${searchQuery}"`
                : categoryName 
                  ? `${categoryName} Products`
                  : 'All Products'}
            </h1>
            {(categoryName || searchQuery) && (
              <Link
                href="/products"
                className="text-sm text-premium-gold hover:text-premium-amber font-medium underline"
              >
                Clear filters
              </Link>
            )}
          </div>
          <p className="text-sm sm:text-base text-ocean-gray">
            {searchQuery 
              ? `Found ${items.length} products`
              : categoryName
                ? `Showing ${items.length} ${categoryName.toLowerCase()} products`
                : 'Explore our complete collection'}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="flex-1 sm:flex-none rounded border border-ocean-border px-3 py-2 text-xs sm:text-sm"
          >
            <option value="new">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <Link
            href="/products/filters"
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-ocean-border rounded hover:bg-ocean-lighter whitespace-nowrap"
          >
            More Filters
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-ocean-gray">Loading products...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ocean-gray text-lg mb-2">
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products found'}
          </p>
          <p className="text-ocean-gray">Try adjusting your search or filters</p>
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


