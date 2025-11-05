'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AddToCartButton from './AddToCartButton'
import WishlistButton from './WishlistButton'
import { CompareButton } from './ProductComparison'
import QuickViewButton from './QuickViewButton'
import { Star } from 'lucide-react'

export interface AliExpressProductCardProps {
  product: {
    _id: string
    title: string
    slug: string
    price: number
    rating?: number
    numReviews?: number
    images?: { url: string; alt?: string }[]
  }
}

export function AliExpressProductCard({ product }: AliExpressProductCardProps) {
  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop'
  const rating = product.rating || 4.5
  const reviews = product.numReviews || 0

  return (
    <motion.div
      className="group relative bg-white/90 backdrop-blur-sm border border-ocean-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
      style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Premium glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/0 via-premium-amber/0 to-premium-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square w-full bg-ocean-lightest relative overflow-hidden">
          {/* Premium shimmer overlay */}
          <div className="absolute inset-0 premium-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <motion.img 
            src={imageUrl} 
            alt={product.title} 
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Premium badge with glow */}
          <motion.div 
            className="absolute top-2 left-2 bg-gradient-to-r from-premium-gold to-premium-amber text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg premium-glow"
            whileHover={{ scale: 1.1 }}
          >
            Free Shipping
          </motion.div>
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <WishlistButton slug={product.slug} />
            <CompareButton slug={product.slug} />
          </div>
          <div className="absolute bottom-2 left-2">
            <QuickViewButton product={product} />
          </div>
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm text-ocean-darkGray line-clamp-2 h-10 mb-2 hover:text-ocean-blue">{product.title}</h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.floor(rating)
              return (
                <Star
                  key={i}
                  size={12}
                  className={filled ? 'text-ocean-light fill-ocean-light' : 'text-ocean-lightest'}
                />
              )
            })}
          </div>
          <span className="text-xs text-ocean-gray ml-1">({reviews})</span>
        </div>

        {/* Price with premium styling */}
        <div className="flex items-baseline gap-2 mb-2">
          <motion.span 
            className="text-xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            ${product.price}
          </motion.span>
          <span className="text-xs text-ocean-gray line-through">${(product.price * 1.5).toFixed(2)}</span>
        </div>

        {/* Orders */}
        <div className="text-xs text-ocean-gray mb-3">{Math.floor(Math.random() * 500 + 100)} orders</div>

        {/* Add to cart button */}
        <AddToCartButton slug={product.slug} title={product.title} price={product.price} image={imageUrl} />
      </div>
    </motion.div>
  )
}

