'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface Category {
  _id: string
  name: string
  slug: string
  displayName: string
  icon?: string
  color?: string
}

function getIcon(iconName?: string) {
  if (!iconName) {
    return Icons.Grid
  }
  const iconMap = Icons as unknown as Record<string, React.ComponentType<LucideProps>>
  const IconComponent = iconMap[iconName]
  return IconComponent || Icons.Grid
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories?active=true')
        if (!res.ok) {
          throw new Error(`Failed to load categories: ${res.statusText}`)
        }
        const data = await res.json()
        const categoryList = Array.isArray(data.categories) ? data.categories : []
        setCategories(categoryList)
        setError(null)
      } catch (error: any) {
        console.error('Failed to load categories:', error)
        setError(error.message || 'Failed to load categories.')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-red-600">
          {error}
        </div>
      )
    }

    if (categories.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-ocean-border bg-white/90 px-6 py-10 text-center">
          <h3 className="text-xl font-semibold text-ocean-darkGray mb-2">No categories found</h3>
          <p className="text-ocean-gray mb-4">
            Create categories in the admin panel to showcase them here.
          </p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Manage Categories
            <span>→</span>
          </Link>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat, i) => {
          const Icon = getIcon(cat.icon)
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
                  {cat.displayName || cat.name}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    )
  }

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

        {renderContent()}
      </div>
    </section>
  )
}

