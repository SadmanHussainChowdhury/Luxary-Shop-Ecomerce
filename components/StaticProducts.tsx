'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Eye } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

const featuredProducts = [
  {
    id: 1,
    title: 'Premium Leather Backpack',
    slug: 'premium-leather-backpack',
    price: 129.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 1247,
    badge: 'BEST SELLER',
    discount: 35
  },
  {
    id: 2,
    title: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-headphones',
    price: 199.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 2834,
    badge: 'HOT',
    discount: 43
  },
  {
    id: 3,
    title: 'Smart Watch Pro Series 8',
    slug: 'smart-watch-pro',
    price: 249.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 1892,
    badge: 'NEW',
    discount: 38
  },
  {
    id: 4,
    title: 'Premium Sunglasses Collection',
    slug: 'premium-sunglasses',
    price: 79.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80&auto=format&fit=crop',
    rating: 4.6,
    reviews: 967,
    badge: 'LIMITED',
    discount: 47
  },
  {
    id: 5,
    title: 'Luxury Perfume Set',
    slug: 'luxury-perfume-set',
    price: 89.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 1456,
    badge: 'PREMIUM',
    discount: 50
  },
  {
    id: 11,
    title: 'Premium Camera DSLR Pro',
    slug: 'premium-camera-dslr-pro',
    price: 699.99,
    originalPrice: 1199.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 3421,
    badge: 'PRO',
    discount: 42
  },
  {
    id: 12,
    title: 'Gaming Console Elite',
    slug: 'gaming-console-elite',
    price: 399.99,
    originalPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 5234,
    badge: 'HOT',
    discount: 33
  },
  {
    id: 13,
    title: '4K Ultra HD Smart TV',
    slug: '4k-ultra-hd-smart-tv',
    price: 899.99,
    originalPrice: 1499.99,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 1876,
    badge: 'BEST DEAL',
    discount: 40
  },
  {
    id: 14,
    title: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    price: 149.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 3421,
    badge: 'NEW',
    discount: 40
  }
]

const popularProducts = [
  {
    id: 6,
    title: 'Ultra-Slim Laptop',
    slug: 'ultra-slim-laptop',
    price: 599.99,
    originalPrice: 999.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 3241,
    badge: 'TRENDING',
    discount: 40
  },
  {
    id: 7,
    title: 'Smartphone Pro Max',
    slug: 'smartphone-pro-max',
    price: 449.99,
    originalPrice: 799.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 4521,
    badge: 'POPULAR',
    discount: 44
  },
  {
    id: 8,
    title: 'Fitness Tracker Elite',
    slug: 'fitness-tracker-elite',
    price: 129.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 1876,
    badge: 'BEST VALUE',
    discount: 48
  },
  {
    id: 9,
    title: 'Bluetooth Speaker Premium',
    slug: 'bluetooth-speaker-premium',
    price: 79.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80&auto=format&fit=crop',
    rating: 4.6,
    reviews: 1123,
    badge: 'SALE',
    discount: 47
  },
  {
    id: 10,
    title: 'Designer Watch Collection',
    slug: 'designer-watch-collection',
    price: 179.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 2341,
    badge: 'EXCLUSIVE',
    discount: 40
  },
  {
    id: 16,
    title: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    price: 129.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 2876,
    badge: 'TRENDING',
    discount: 35
  },
  {
    id: 17,
    title: 'Wireless Gaming Mouse Pro',
    slug: 'wireless-gaming-mouse-pro',
    price: 79.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 3456,
    badge: 'POPULAR',
    discount: 38
  },
  {
    id: 18,
    title: 'Action Camera 4K Ultra',
    slug: 'action-camera-4k-ultra',
    price: 249.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=800&q=80&auto=format&fit=crop',
    rating: 4.6,
    reviews: 1890,
    badge: 'HOT',
    discount: 38
  },
  {
    id: 19,
    title: 'Smart Home Security System',
    slug: 'smart-home-security-system',
    price: 299.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 4567,
    badge: 'BEST VALUE',
    discount: 40
  },
  {
    id: 21,
    title: 'Air Purifier HEPA Filter',
    slug: 'air-purifier-hepa-filter',
    price: 199.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 3124,
    badge: 'SALE',
    discount: 43
  },
  {
    id: 22,
    title: 'Smart Fitness Mirror',
    slug: 'smart-fitness-mirror',
    price: 799.99,
    originalPrice: 1299.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 987,
    badge: 'EXCLUSIVE',
    discount: 38
  },
  {
    id: 23,
    title: 'Portable Projector 1080p',
    slug: 'portable-projector-1080p',
    price: 179.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80&auto=format&fit=crop',
    rating: 4.6,
    reviews: 1678,
    badge: 'BEST DEAL',
    discount: 40
  },
  {
    id: 24,
    title: 'VR Headset Gaming Pro',
    slug: 'vr-headset-gaming-pro',
    price: 349.99,
    originalPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 2456,
    badge: 'NEW',
    discount: 42
  }
]

function ProductCard({ product, index }: { product: any, index: number }) {
  const savings = ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)
  const [imageError, setImageError] = React.useState(false)
  
  // Fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop'
  const imageUrl = imageError ? fallbackImage : (product.image || fallbackImage)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-ocean-border"
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-3 py-1 bg-gradient-to-r from-premium-gold to-premium-amber text-white text-xs font-bold rounded-full shadow-lg">
          {product.badge}
        </span>
      </div>
      
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
          -{savings}%
        </span>
      </div>

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
                className={i < Math.floor(product.rating) ? 'fill-premium-gold text-premium-gold' : 'fill-ocean-border text-ocean-border'}
              />
            ))}
          </div>
          <span className="text-xs text-ocean-gray">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-ocean-gray line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <AddToCartButton
            slug={product.slug}
            title={product.title}
            price={product.price}
            image={product.image}
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

export { featuredProducts, popularProducts, ProductCard }

