'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Smartphone,
  Shirt,
  Home,
  Headphones,
  ShoppingBag,
  Watch,
  Heart,
  Activity,
  Grid,
} from 'lucide-react'

// Icon mapping
const iconMap: Record<string, any> = {
  Grid, Zap: Smartphone, Shirt, Home, Headphones, ShoppingBag, Watch, Heart, Activity
}

// Static fallback categories (like previously added)
const staticCategories = [
  {
    _id: 'static-electronics',
    name: 'Electronics',
    slug: 'electronics',
    displayName: 'Electronics',
    icon: 'Zap',
    color: 'from-blue-500 to-blue-600',
  },
  {
    _id: 'static-fashion',
    name: 'Fashion',
    slug: 'fashion',
    displayName: 'Fashion',
    icon: 'Shirt',
    color: 'from-pink-500 to-pink-600',
  },
  {
    _id: 'static-home',
    name: 'Home & Garden',
    slug: 'home-garden',
    displayName: 'Home & Garden',
    icon: 'Home',
    color: 'from-purple-500 to-purple-600',
  },
  {
    _id: 'static-audio',
    name: 'Audio',
    slug: 'audio',
    displayName: 'Audio',
    icon: 'Headphones',
    color: 'from-green-500 to-green-600',
  },
  {
    _id: 'static-bags',
    name: 'Bags',
    slug: 'bags',
    displayName: 'Bags',
    icon: 'ShoppingBag',
    color: 'from-amber-500 to-amber-600',
  },
  {
    _id: 'static-accessories',
    name: 'Accessories',
    slug: 'accessories',
    displayName: 'Accessories',
    icon: 'Watch',
    color: 'from-red-500 to-red-600',
  },
  {
    _id: 'static-beauty',
    name: 'Beauty',
    slug: 'beauty',
    displayName: 'Beauty',
    icon: 'Heart',
    color: 'from-rose-500 to-rose-600',
  },
  {
    _id: 'static-sports',
    name: 'Sports',
    slug: 'sports',
    displayName: 'Sports',
    icon: 'Activity',
    color: 'from-indigo-500 to-indigo-600',
  },
]

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories?active=true')
        const data = await res.json()
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories)
        } else {
          // Use static categories if no categories in database
          setCategories(staticCategories)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
        // Use static categories on error
        setCategories(staticCategories)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])
  return (
    <section className="py-16 bg-white/60 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ocean-darkGray mb-2 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-ocean-gray text-base sm:text-lg">
            Explore our curated collections
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Grid
            const colorClass = cat.color || 'from-gray-500 to-gray-600'
            return (
              <motion.div
                key={cat._id || cat.slug}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
              >
                <Link
                  href={`/products?category=${cat.name}`}
                  className="flex flex-col items-center p-4 sm:p-6 bg-white border-2 border-ocean-border rounded-xl sm:rounded-2xl hover:border-premium-gold hover:shadow-xl transition group"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition`}>
                    <Icon size={24} className="sm:w-8 sm:h-8 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-ocean-darkGray text-center">
                    {cat.displayName}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

