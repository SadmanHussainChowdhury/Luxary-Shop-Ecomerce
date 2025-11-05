'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AliExpressProductCard } from '@/components/AliExpressProductCard'
import { TrendingUp, Flame, Rocket, Star, Zap, Eye, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function TrendingNowPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('rating')

  useEffect(() => {
    loadProducts()
  }, [sort])

  async function loadProducts() {
    setLoading(true)
    try {
      // Fetch products sorted by rating (trending)
      const res = await fetch('/api/products?sort=rating&pageSize=100')
      const data = await res.json()
      
      // Filter top-rated products (trending)
      const trendingProducts = (data.items || [])
        .filter((p: any) => (p.rating || 4.5) >= 4.0)
        .sort((a: any, b: any) => (b.rating || 4.5) - (a.rating || 4.5))
      
      setItems(trendingProducts.slice(0, 50))
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 120, 0],
            y: [0, 70, 0],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -120, 0],
            y: [0, -70, 0],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Premium Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              {/* Animated Trending Icons */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-6"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <TrendingUp size={64} className="text-white fill-white drop-shadow-2xl" />
                <Flame size={48} className="text-white fill-white drop-shadow-2xl" />
                <Rocket size={64} className="text-white fill-white drop-shadow-2xl" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
                Trending Now
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-4 max-w-3xl mx-auto font-light">
                What's Hot Right Now
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Discover the most popular and highly-rated products that everyone is talking about. 
                These trending items are flying off the shelves - get them while they're hot!
              </p>

              {/* Trending Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
                {[
                  { icon: Flame, value: 'Hot', label: 'Products' },
                  { icon: Star, value: '4.8+', label: 'Rated' },
                  { icon: Eye, value: '10K+', label: 'Views' },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                    >
                      <Icon size={32} className="mx-auto mb-3 text-white fill-white" />
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          {/* Filters Bar */}
          <div className="bg-white border-2 border-blue-300 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Flame size={24} className="text-blue-600 fill-blue-600" />
                <span className="text-lg font-bold text-ocean-darkGray">
                  {items.length} Trending Products
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="new">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white border border-ocean-border rounded-2xl">
              <TrendingUp size={64} className="mx-auto text-ocean-gray mb-4" />
              <p className="text-xl text-ocean-gray mb-4">No trending products found</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl transition"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative"
                >
                  {/* Trending Badge */}
                  <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Flame size={12} className="fill-white" />
                    Trending
                  </div>
                  <AliExpressProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

