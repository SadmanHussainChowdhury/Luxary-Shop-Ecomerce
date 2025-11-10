'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const STORAGE_KEY = 'worldclass_wishlist_v1'

function loadWishlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveWishlist(items: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save wishlist:', error)
  }
}

export default function WishlistButton({ slug }: { slug: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    setIsWishlisted(loadWishlist().includes(slug))
  }, [slug])

  function toggle() {
    const items = loadWishlist()
    if (items.includes(slug)) {
      saveWishlist(items.filter((s) => s !== slug))
      setIsWishlisted(false)
      toast.success('Removed from wishlist')
    } else {
      saveWishlist([...items, slug])
      setIsWishlisted(true)
      toast.success('Added to wishlist')
    }
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition"
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={18}
        className={isWishlisted ? 'fill-ocean-blue text-ocean-blue' : 'text-ocean-gray'}
      />
    </motion.button>
  )
}

