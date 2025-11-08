'use client'

import { Search, Grid, Zap, Shirt, Home, Headphones, ShoppingBag, Watch, Heart, Activity, Sparkles, Crown, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CartButton from './CartButton'

// Icon mapping
const iconMap: Record<string, any> = {
  Grid, Zap, Shirt, Home, Headphones, ShoppingBag, Watch, Heart, Activity
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

export default function WorldClassHeader() {
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'admin'
  const activeCategory = searchParams.get('category') || ''

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
      }
    }
    loadCategories()
  }, [])

  return (
    <header className="relative bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-b border-premium-gold/20 sticky top-0 z-50 shadow-lg shadow-premium-gold/5">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-2.5 text-[11px] sm:text-sm border-b border-premium-gold/20 bg-gradient-to-r from-premium-gold/5 via-premium-amber/5 to-premium-gold/5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-ocean-darkGray">
            <motion.div
              className="flex items-center gap-2 text-premium-gold font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={14} className="fill-premium-gold text-premium-gold" />
              <span className="hidden sm:inline">Limited Time: Up to 70% OFF</span>
              <span className="sm:hidden">70% OFF</span>
            </motion.div>
            <span className="hidden md:inline text-ocean-gray">•</span>
            <span className="hidden md:inline text-premium-gold font-semibold">Free Shipping Worldwide</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <Link 
              href="/register" 
              className="px-3 py-1 bg-gradient-to-r from-premium-gold/20 to-premium-amber/20 hover:from-premium-gold/30 hover:to-premium-amber/30 rounded-lg font-semibold text-premium-gold transition-all border border-premium-gold/30 w-full sm:w-auto text-center"
            >
              Sign Up & Save $10
            </Link>
            <Link 
              href="/login" 
              className="hover:text-premium-gold font-medium transition-colors text-center"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 py-3 sm:py-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ocean-darkGray hover:text-premium-gold transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0">
            {/* Sparkle decorations */}
            <motion.div
              className="absolute -left-2 -top-2"
              animate={{ 
                rotate: [0, 360],
                scale: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles size={16} className="text-premium-gold fill-premium-gold" />
            </motion.div>
            <motion.div
              className="absolute -right-2 -bottom-2"
              animate={{ 
                rotate: [360, 0],
                scale: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Sparkles size={14} className="text-premium-amber fill-premium-amber" />
            </motion.div>

            {/* Crown icon - hidden on small screens */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="hidden sm:block"
            >
              <Crown size={28} className="text-premium-gold fill-premium-gold drop-shadow-lg" />
            </motion.div>

            {/* Logo text with enhanced styling */}
            <div className="relative">
              <motion.span 
                className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-premium-gold via-premium-amber via-yellow-500 to-premium-gold bg-clip-text text-transparent tracking-tight relative z-10"
                whileHover={{ scale: 1.08 }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ 
                  backgroundSize: '200% 100%',
                }}
              >
                Luxury Shop
              </motion.span>
              
              {/* Shimmer effect overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2
                }}
                style={{ width: '50%', height: '100%' }}
              />
            </div>

            {/* Premium badge with enhanced effects - hidden on very small screens */}
            <motion.div
              className="relative hidden xs:block"
              whileHover={{ scale: 1.1 }}
              animate={{ 
                y: [0, -3, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.span
                className="relative inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 border-premium-gold/50 bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold overflow-hidden"
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(217, 119, 6, 0.5)',
                    '0 0 20px rgba(217, 119, 6, 0.8)',
                    '0 0 10px rgba(217, 119, 6, 0.5)'
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Animated background shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ width: '50%' }}
                />
                <Sparkles size={10} className="relative z-10 text-white" />
                <span className="relative z-10 tracking-widest">PREMIUM</span>
              </motion.span>
            </motion.div>
          </Link>

          {/* Search bar - hidden on mobile, shown in mobile menu */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <form 
              className="flex w-full"
              onSubmit={(e) => {
                e.preventDefault()
                const query = search.trim()
                if (query) {
                  router.push(`/products?q=${encodeURIComponent(query)}`)
                } else {
                  router.push('/products')
                }
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for anything"
                className="flex-1 px-3 sm:px-4 py-2 text-sm border border-ocean-blue rounded-l focus:outline-none focus:ring-2 focus:ring-ocean-blue"
              />
              <motion.button 
                type="submit" 
                className="bg-gradient-to-r from-premium-gold to-premium-amber text-white px-4 sm:px-6 py-2 rounded-r hover:shadow-lg transition-shadow flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </motion.button>
            </form>
          </div>

          <div className="hidden sm:flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {isAdmin && (
              <Link href="/admin" className="text-ocean-blue hover:text-ocean-deep text-xs sm:text-sm font-medium whitespace-nowrap">
                Admin
              </Link>
            )}
            <Link href="/account" className="text-ocean-darkGray hover:text-ocean-blue text-xs sm:text-sm whitespace-nowrap">
              Account
            </Link>
            <CartButton />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-ocean-border bg-white"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <form 
                  className="flex"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const query = search.trim()
                    setMobileMenuOpen(false)
                    if (query) {
                      router.push(`/products?q=${encodeURIComponent(query)}`)
                    } else {
                      router.push('/products')
                    }
                  }}
                >
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for anything"
                    className="flex-1 px-4 py-2 border border-ocean-blue rounded-l focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                  />
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-premium-gold to-premium-amber text-white px-4 py-2 rounded-r"
                  >
                    <Search size={20} />
                  </button>
                </form>

                {/* Mobile Links */}
                <div className="flex flex-col gap-3 pt-2">
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ocean-blue hover:text-ocean-deep font-medium py-2"
                    >
                      Admin
                    </Link>
                  )}
                  <Link 
                    href="/account" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-ocean-darkGray hover:text-ocean-blue py-2"
                  >
                    Account
                  </Link>
                  <div className="pt-2 border-t border-ocean-border">
                    <CartButton />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories - Desktop */}
        <nav className="hidden lg:flex items-center gap-4 py-3 text-sm border-t border-ocean-border overflow-x-auto">
          {/* All Categories Link */}
          <Link
            href="/products"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap group ${
              pathname === '/products' && !activeCategory
                ? 'text-premium-gold bg-gradient-to-r from-premium-gold/10 to-premium-amber/10'
                : 'text-ocean-darkGray hover:text-premium-gold hover:bg-gradient-to-r hover:from-premium-gold/5 hover:to-premium-amber/5'
            }`}
          >
            <Grid size={16} className="group-hover:text-premium-gold transition-colors" />
            <span className="font-medium">All Categories</span>
          </Link>
          
          {/* Category Links */}
          <div className="flex items-center gap-4 flex-1">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Grid
              const isActive = activeCategory === category.name || activeCategory === category.slug
              return (
                <Link
                  key={category.slug || category._id}
                  href={`/products?category=${category.name}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap group ${
                    isActive
                      ? 'text-premium-gold bg-gradient-to-r from-premium-gold/10 to-premium-amber/10'
                      : 'text-ocean-darkGray hover:text-premium-gold hover:bg-gradient-to-r hover:from-premium-gold/5 hover:to-premium-amber/5'
                  }`}
                >
                  <Icon size={16} className="group-hover:text-premium-gold transition-colors" />
                  <span className="font-medium">{category.displayName}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile Categories - Scrollable */}
        <nav className="lg:hidden flex items-center gap-2 py-3 text-xs sm:text-sm border-t border-ocean-border overflow-x-auto scrollbar-hide">
          <Link
            href="/products"
            className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all whitespace-nowrap group min-w-[60px] sm:min-w-[70px] ${
              pathname === '/products' && !activeCategory
                ? 'text-premium-gold bg-gradient-to-r from-premium-gold/10 to-premium-amber/10'
                : 'text-ocean-darkGray hover:text-premium-gold'
            }`}
          >
            <Grid size={18} className="sm:w-5 sm:h-5 group-hover:text-premium-gold transition-colors" />
            <span className="font-medium text-[10px] sm:text-xs text-center">All</span>
          </Link>
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Grid
            const isActive = activeCategory === category.name || activeCategory === category.slug
            return (
              <Link
                key={category.slug || category._id}
                href={`/products?category=${category.name}`}
                className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all whitespace-nowrap group min-w-[60px] sm:min-w-[70px] ${
                  isActive
                    ? 'text-premium-gold bg-gradient-to-r from-premium-gold/10 to-premium-amber/10'
                    : 'text-ocean-darkGray hover:text-premium-gold'
                }`}
              >
                <Icon size={18} className="sm:w-5 sm:h-5 group-hover:text-premium-gold transition-colors" />
                <span className="font-medium text-[10px] sm:text-xs text-center">{category.displayName}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
