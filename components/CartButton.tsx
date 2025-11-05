'use client'

import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

const STORAGE_KEY = 'up_premium_cart_v1'

function loadCount(): number {
  try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as any[]).reduce((s, i) => s + (i.quantity || 1), 0) } catch { return 0 }
}

export default function CartButton() {
  const [count, setCount] = useState(0)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    setCount(loadCount())
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) { setCount(loadCount()); setBump(true); setTimeout(() => setBump(false), 300) } }
    const onUpdated = () => { setCount(loadCount()); setBump(true); setTimeout(() => setBump(false), 300) }
    window.addEventListener('storage', onStorage)
    window.addEventListener('cart:updated', onUpdated as any)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cart:updated', onUpdated as any) }
  }, [])

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2 text-ocean-darkGray hover:text-ocean-blue">
      <ShoppingCart size={20} />
      <span className="hidden sm:inline text-sm">Cart</span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className={`absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ocean-blue px-1 text-xs text-white ${bump ? 'animate-ping [animation-duration:600ms]' : ''}`}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}


