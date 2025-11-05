'use client'

import Link from 'next/link'
import { Sparkles, TrendingUp } from 'lucide-react'
import { featuredProducts, popularProducts, ProductCard } from './StaticProducts'

export function FeaturedProductsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-ocean-lightest to-white relative z-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-premium-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-premium-amber/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-premium-gold/10 rounded-full mb-4">
            <Sparkles className="text-premium-gold" size={20} />
            <span className="text-premium-gold font-bold text-sm">PREMIUM SELECTION</span>
          </div>
          <h2 className="text-5xl font-bold text-ocean-darkGray mb-3">
            <span className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <p className="text-xl text-ocean-gray max-w-2xl mx-auto">
            Hand-picked premium selections with unbeatable prices - Limited time offers!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/products"
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

export function PopularProductsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter relative z-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-4">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-green-600 font-bold text-sm">TRENDING NOW</span>
          </div>
          <h2 className="text-5xl font-bold text-ocean-darkGray mb-3">
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
              Popular Products
            </span>
          </h2>
          <p className="text-xl text-ocean-gray max-w-2xl mx-auto">
            Most loved by customers worldwide - Amazing deals with incredible savings!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {popularProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

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

