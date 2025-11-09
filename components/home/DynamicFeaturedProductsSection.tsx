'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { HomeProductCard, type ProductLike } from '@/components/StaticProducts'

type FetchState = {
  loading: boolean
  error: string | null
  products: ProductLike[]
}

export default function DynamicFeaturedProductsSection() {
  const [state, setState] = useState<FetchState>({
    loading: true,
    error: null,
    products: [],
  })

  useEffect(() => {
    let isMounted = true

    async function loadFeaturedProducts() {
      try {
        const res = await fetch('/api/products?featured=true&pageSize=10', {
          next: { revalidate: 0 },
        })

        if (!res.ok) {
          throw new Error(`Failed to load featured products: ${res.statusText}`)
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
        console.error('Error loading featured products:', error)
        setState({
          loading: false,
          error: error.message || 'Failed to load featured products.',
          products: [],
        })
      }
    }

    loadFeaturedProducts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-white via-ocean-lightest to-white relative z-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-premium-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-premium-amber/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-premium-gold/10 rounded-full mb-4">
            <Sparkles className="text-premium-gold" size={20} />
            <span className="text-premium-gold font-bold text-sm">PREMIUM SELECTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-darkGray mb-3">
            <span className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <p className="text-base sm:text-lg text-ocean-gray max-w-2xl mx-auto">
            Hand-picked premium selections with unbeatable prices - Limited time offers!
          </p>
        </div>

        {state.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        {state.loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : state.products.length === 0 ? (
          <div className="mb-12 rounded-2xl border border-dashed border-ocean-border bg-white/80 px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-ocean-darkGray mb-2">No featured products yet</h3>
            <p className="text-ocean-gray mb-4">
              Highlight premium items by marking them as featured in your admin panel.
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
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
            href="/products?featured=true"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            View All Featured Products
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

