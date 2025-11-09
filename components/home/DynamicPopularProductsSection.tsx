'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { HomeProductCard, type ProductLike } from '@/components/StaticProducts'

type FetchState = {
  loading: boolean
  error: string | null
  products: ProductLike[]
}

export default function DynamicPopularProductsSection() {
  const [state, setState] = useState<FetchState>({
    loading: true,
    error: null,
    products: [],
  })

  useEffect(() => {
    let isMounted = true

    async function loadPopularProducts() {
      try {
        const res = await fetch('/api/products?sort=rating&pageSize=10', {
          next: { revalidate: 0 },
        })

        if (!res.ok) {
          throw new Error(`Failed to load popular products: ${res.statusText}`)
        }

        const data = await res.json()
        if (!isMounted) return

        setState({
          loading: false,
          error: null,
          products: Array.isArray(data.items) ? data.items : [],
        })
      } catch (error: any) {
        if (!isMounted) return
        console.error('Error loading popular products:', error)
        setState({
          loading: false,
          error: error.message || 'Failed to load popular products.',
          products: [],
        })
      }
    }

    loadPopularProducts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter relative z-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-4">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-green-600 font-bold text-sm">TRENDING NOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-darkGray mb-3">
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
              Popular Products
            </span>
          </h2>
          <p className="text-base sm:text-lg text-ocean-gray max-w-2xl mx-auto">
            Most loved by customers worldwide - Amazing deals with incredible savings!
          </p>
        </div>

        {state.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        {state.loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : state.products.length === 0 ? (
          <div className="mb-12 rounded-2xl border border-dashed border-ocean-border bg-white/80 px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-ocean-darkGray mb-2">No popular products yet</h3>
            <p className="text-ocean-gray mb-4">
              Add products with strong reviews or sales to populate this area.
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            >
              Go to Products Management
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-5 sm:gap-6 mb-8">
            {state.products.map((product, index) => (
              <HomeProductCard key={(product as any)._id || product.id || product.slug || index} product={product} index={index} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/products?sort=rating"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            View All Popular Products
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

