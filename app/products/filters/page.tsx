'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AliExpressProductCard } from '@/components/AliExpressProductCard'

export default function ProductsFiltersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'new',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  })

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories?active=true')
        const data = await res.json()
        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [filters])

  async function loadProducts() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()
    setItems(data.items || [])
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="bg-white border border-ocean-border rounded p-4">
            <h2 className="font-bold text-ocean-darkGray mb-4">Filters</h2>
            
            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full rounded border border-ocean-border px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.slug} value={cat.name}>
                    {cat.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full rounded border border-ocean-border px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full rounded border border-ocean-border px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full rounded border border-ocean-border px-3 py-2 text-sm"
              >
                <option value="new">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-ocean-darkGray">
                {loading ? 'Loading...' : `${items.length} Products`}
              </h1>
            </div>
            {loading ? (
              <div className="text-center py-12 text-ocean-gray">Loading products...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-ocean-gray">No products found</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {items.map((p) => (
                  <AliExpressProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

