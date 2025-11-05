'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AliExpressProductCard } from '@/components/AliExpressProductCard'
import { Gift, Sparkles, Zap, Clock, Fire, Tag, ArrowDown } from 'lucide-react'
import Link from 'next/link'

export default function ExclusiveDealsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('new')

  useEffect(() => {
    loadProducts()
  }, [sort])

  async function loadProducts() {
    setLoading(true)
    try {
      // Fetch products and calculate discounts
      const res = await fetch('/api/products?pageSize=100')
      const data = await res.json()
      
      // Filter products with significant discounts (simulated - in real app, use discount field)
      const productsWithDeals = (data.items || []).map((p: any) => ({
        ...p,
        discount: Math.floor(Math.random() * 50) + 20, // 20-70% discount
        originalPrice: p.price * (1 + Math.random() * 0.5 + 0.3), // 30-80% markup
      })).filter((p: any) => p.discount >= 30) // Only show products with 30%+ discount
      
      setItems(productsWithDeals.slice(0, 50))
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Premium Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              {/* Animated Gift Icons */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Gift size={64} className="text-white fill-white drop-shadow-2xl" />
                <Sparkles size={48} className="text-white fill-white drop-shadow-2xl" />
                <Gift size={64} className="text-white fill-white drop-shadow-2xl" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
                Exclusive Deals
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-4 max-w-3xl mx-auto font-light">
                Limited Time Offers
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Unlock incredible savings on premium products. These exclusive deals are available 
                for a limited time only. Don't miss out on these amazing discounts!
              </p>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/30"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock size={24} className="text-white" />
                  <span className="text-xl font-bold">Deal Ends In:</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Days', value: '03' },
                    { label: 'Hours', value: '12' },
                    { label: 'Mins', value: '45' },
                    { label: 'Secs', value: '30' },
                  ].map((time, i) => (
                    <div key={i} className="bg-white/30 rounded-lg p-3">
                      <div className="text-3xl font-bold mb-1">{time.value}</div>
                      <div className="text-xs text-white/80">{time.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Deal Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
                {[
                  { icon: ArrowDown, value: 'Up to', label: '70% OFF' },
                  { icon: Fire, value: 'Hot', label: 'Deals' },
                  { icon: Zap, value: 'Limited', label: 'Time' },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  if (!Icon) return null
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                    >
                      <Icon size={32} className="mx-auto mb-3 text-white" />
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
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
          <div className="bg-white border-2 border-purple-300 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Tag size={24} className="text-purple-600" />
                <span className="text-lg font-bold text-ocean-darkGray">
                  {items.length} Exclusive Deals
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
                >
                  <option value="new">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white border border-ocean-border rounded-2xl">
              <Gift size={64} className="mx-auto text-ocean-gray mb-4" />
              <p className="text-xl text-ocean-gray mb-4">No exclusive deals available</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl transition"
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
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-1">
                      <Fire size={14} />
                      {product.discount}% OFF
                    </div>
                  )}
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

