'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type Props = {
  slug: string
  title: string
  price: number
  image?: string
}

const STORAGE_KEY = 'up_premium_cart_v1'

function loadCart(): any[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveCart(items: any[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

export default function AddToCartButton({ slug, title, price, image }: Props) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  function add() {
    setAdding(true)
    const items = loadCart()
    const existing = items.find((i) => i.slug === slug)
    if (existing) existing.quantity = Math.min(99, (existing.quantity || 1) + 1)
    else items.push({ slug, title, price, image, quantity: 1 })
    saveCart(items)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setAdding(false)
    toast.success(`${title} added to cart`, { duration: 1400 })
    try { window.dispatchEvent(new Event('cart:updated')) } catch {}
  }

  return (
    <motion.button
      onClick={add}
      disabled={adding}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(217, 119, 6, 0.4)' }}
      whileTap={{ scale: 0.96 }}
      className="relative w-full bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 overflow-hidden group"
      style={{
        backgroundSize: '200% 100%',
        animation: added ? 'shimmer 0.5s' : 'none',
      }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: added ? '200%' : '200%' }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {added ? (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              ✓
            </motion.span>
            Added!
          </>
        ) : adding ? (
          'Adding…'
        ) : (
          'Add to Cart'
        )}
      </span>
    </motion.button>
  )
}


