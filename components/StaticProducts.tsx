'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Eye } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

export type ProductLike = {
  _id?: string
  id?: string | number
  title: string
  slug: string
  price?: number
  salePrice?: number
  originalPrice?: number
  compareAtPrice?: number
  image?: string
  images?: { url: string; alt?: string }[]
  rating?: number
  averageRating?: number
  avgRating?: number
  numReviews?: number
  reviews?: number
  badge?: string
  tags?: string[]
  isFeatured?: boolean
  discount?: number
}

function resolveImage(product: ProductLike, fallbackImage: string, imageError: boolean): string {
  if (imageError) {
    return fallbackImage
  }

  if (product.image) {
    return product.image
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]?.url || fallbackImage
  }

  return fallbackImage
}

function resolveBadge(product: ProductLike): string | null {
  if (product.badge) return product.badge
  if (product.isFeatured) return 'FEATURED'
  if (product.tags?.includes('popular')) return 'POPULAR'
  return null
}

export function HomeProductCard({ product, index }: { product: ProductLike; index: number }) {
  const price =
    typeof product.price === 'number'
      ? product.price
      : typeof product.salePrice === 'number'
      ? product.salePrice
      : 0

  const originalPriceCandidate =
    typeof product.originalPrice === 'number'
      ? product.originalPrice
      : typeof product.compareAtPrice === 'number'
      ? product.compareAtPrice
      : undefined

  const originalPrice =
    originalPriceCandidate && originalPriceCandidate > price
      ? originalPriceCandidate
      : undefined

  const showDiscount = price > 0 && originalPrice && originalPrice > price
  const savings = showDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const ratingRaw =
    typeof product.rating === 'number'
      ? product.rating
      : typeof product.averageRating === 'number'
      ? product.averageRating
      : typeof product.avgRating === 'number'
      ? product.avgRating
      : 0

  const rating = Math.min(5, Math.max(0, Number(ratingRaw) || 0))
  const reviewsRaw =
    typeof product.numReviews === 'number'
      ? product.numReviews
      : typeof product.reviews === 'number'
      ? product.reviews
      : 0
  const reviews = Math.max(0, Math.floor(reviewsRaw))

  const [imageError, setImageError] = React.useState(false)
  const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop'
  const imageUrl = resolveImage(product, fallbackImage, imageError)
  const badge = resolveBadge(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-ocean-border"
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-premium-gold to-premium-amber text-white text-xs font-bold rounded-full shadow-lg">
            {badge}
          </span>
        </div>
      )}
      
      {/* Discount Badge */}
      {showDiscount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{savings}%
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full h-64 bg-ocean-lightest overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => {
              if (!imageError) {
                setImageError(true)
              }
            }}
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none z-10" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg text-ocean-darkGray mb-2 line-clamp-2 group-hover:text-premium-gold transition">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(rating) ? 'fill-premium-gold text-premium-gold' : 'fill-ocean-border text-ocean-border'}
              />
            ))}
          </div>
          <span className="text-xs text-ocean-gray">
            ({reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent">
            {price > 0 ? `$${price.toFixed(2)}` : 'Contact for price'}
          </span>
          {showDiscount && originalPrice && (
            <span className="text-sm text-ocean-gray line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <AddToCartButton
            slug={product.slug}
            title={product.title}
            price={price}
            image={imageUrl}
          />
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center px-4 py-2 border-2 border-ocean-border rounded-lg hover:bg-ocean-lightest transition"
            title="View Details"
          >
            <Eye size={18} className="text-ocean-gray" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

