'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Share2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import AddToCartButton from './AddToCartButton'
import WishlistButton from './WishlistButton'
import Link from 'next/link'

interface QuickViewModalProps {
  product: {
    _id: string
    title: string
    slug: string
    price: number
    description?: string
    images?: { url: string; alt?: string }[]
    rating?: number
    numReviews?: number
  }
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const imageUrl = product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop'

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition"
              >
                <X size={20} />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image Section */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-ocean-lightest relative group">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <WishlistButton slug={product.slug} />
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {product.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`aspect-square rounded overflow-hidden border-2 transition ${
                            i === selectedImage ? 'border-premium-gold' : 'border-ocean-border'
                          }`}
                        >
                          <img src={img.url} alt={img.alt || product.title} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-ocean-darkGray mb-2">{product.title}</h2>
                    <p className="text-ocean-gray">{product.description || 'Premium quality product'}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    <span className="text-xl text-ocean-gray line-through">
                      ${(product.price * 1.5).toFixed(2)}
                    </span>
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-premium-gold font-bold">{product.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating!) ? 'text-premium-amber' : 'text-ocean-border'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-ocean-gray text-sm">
                        ({product.numReviews || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-3 pt-4">
                    <AddToCartButton
                      slug={product.slug}
                      title={product.title}
                      price={product.price}
                      image={imageUrl}
                    />
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex-1 px-6 py-3 border-2 border-premium-gold text-premium-gold rounded-lg font-bold hover:bg-premium-gold hover:text-white transition text-center"
                      onClick={onClose}
                    >
                      View Full Details
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-ocean-border">
                    <h3 className="font-bold mb-3">Key Features</h3>
                    <ul className="space-y-2 text-sm text-ocean-gray">
                      <li className="flex items-center gap-2">
                        <span className="text-premium-gold">✓</span> Free Worldwide Shipping
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-premium-gold">✓</span> 30-Day Money Back Guarantee
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-premium-gold">✓</span> Premium Quality Materials
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-premium-gold">✓</span> 24/7 Customer Support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

