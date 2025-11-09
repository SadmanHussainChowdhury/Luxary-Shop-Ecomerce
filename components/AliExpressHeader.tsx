'use client'

import { Search, Grid, Sparkles, Crown, Menu, X } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CartButton from './CartButton'

type SiteSettings = {
  siteName?: string
  siteTagline?: string
  promotionalBanner?: {
    enabled?: boolean
    text?: string
    link?: string
  }
}

type CategorySummary = {
  _id?: string
  name: string
  slug?: string
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

export default function WorldClassHeader() {
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<CategorySummary[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'admin'
  const activeCategory = searchParams.get('category') || ''

  const siteName = siteSettings?.siteName?.trim() || 'Luxury Shop'
  const siteTagline = siteSettings?.siteTagline?.trim() || 'Shop Luxury. Live Premium.'
  const promotionalBanner = siteSettings?.promotionalBanner || {}
  const promoEnabled = promotionalBanner.enabled ?? true
  const promoText = promotionalBanner.text?.trim() || ''
  const promoLink = promotionalBanner.link?.trim() || '/products'
  const promoSegments = promoText ? promoText.split('•').map((segment) => segment.trim()).filter(Boolean) : []

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true)
        const res = await fetch('/api/categories?active=true')
        if (!res.ok) {
          throw new Error(`Failed to load categories: ${res.statusText}`)
        }
        const data = await res.json()
        const dynamicCategories: CategorySummary[] = Array.isArray(data.categories) ? data.categories : []
        setCategories(dynamicCategories)
        setCategoryError(null)
      } catch (error: any) {
        console.error('Failed to load categories:', error)
        setCategoryError(error.message || 'Failed to load categories.')
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const res = await fetch('/api/site-settings', { next: { revalidate: 0 } })
        if (!res.ok) {
          throw new Error(`Failed to load site settings: ${res.statusText}`)
        }
        const data = await res.json()
        setSiteSettings(data)
        setSettingsError(null)
      } catch (error: any) {
        console.error('Failed to load site settings:', error)
        setSettingsError(error.message || 'Failed to load site settings.')
        setSiteSettings(null)
      }
    }

    loadSiteSettings()
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
              <span className="hidden sm:inline">{siteTagline}</span>
              <span className="sm:hidden">{siteName}</span>
            </motion.div>
            {promoEnabled && promoSegments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-premium-gold font-semibold">
                {promoSegments.map((segment, index) => (
                  <span key={index} className="flex items-center gap-2 whitespace-nowrap">
                    <span className="hidden md:inline text-ocean-gray">•</span>
                    {segment}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
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
            {promoEnabled && promoLink && (
              <Link
                href={promoLink}
                className="px-3 py-1 bg-white text-premium-gold border border-premium-gold/40 rounded-lg font-semibold hover:bg-premium-gold hover:text-white transition-all w-full sm:w-auto text-center"
              >
                Shop Promo
              </Link>
            )}
          </div>
        </div>
        {settingsError && (
          <div className="py-2 text-center text-xs text-red-600">
            {settingsError}
          </div>
        )}

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

          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
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
                {siteName}
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

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-auto">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:block text-ocean-blue hover:text-ocean-deep text-sm font-medium whitespace-nowrap"
              >
                Admin
              </Link>
            )}
            <Link
              href="/account"
              className="hidden sm:block text-ocean-darkGray hover:text-ocean-blue text-sm whitespace-nowrap"
            >
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
                  <div className="grid gap-2">
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
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ocean-darkGray hover:text-ocean-blue py-2"
                    >
                      Home
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ocean-darkGray hover:text-ocean-blue py-2"
                    >
                      Account
                    </Link>
                    {promoEnabled && (
                      <Link
                        href={promoLink || '/products'}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-ocean-blue hover:text-ocean-deep py-2"
                      >
                        Shop Promo
                      </Link>
                    )}
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ocean-blue hover:text-ocean-deep py-2"
                    >
                      Sign Up & Save $10
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ocean-darkGray hover:text-ocean-blue py-2"
                    >
                      Sign In
                    </Link>
                  </div>
                  <div className="pt-3 border-t border-ocean-border">
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
            {categoriesLoading ? (
              <span className="text-xs text-ocean-gray">Loading categories…</span>
            ) : categoryError ? (
              <span className="text-xs text-red-500">{categoryError}</span>
            ) : categories.length === 0 ? (
              <Link
                href="/admin/categories"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-premium-gold/40 text-premium-gold/80 hover:text-premium-gold hover:border-premium-gold/60 transition"
              >
                <Sparkles size={16} />
                <span className="font-medium">Add categories in admin</span>
              </Link>
            ) : (
              categories.map((category) => {
                const Icon = getIcon(category.icon)
                const isActive = activeCategory === category.name || activeCategory === category.slug
                return (
                  <Link
                    key={category.slug || category._id || category.name}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap group ${
                      isActive
                        ? 'text-premium-gold bg-gradient-to-r from-premium-gold/10 to-premium-amber/10'
                        : 'text-ocean-darkGray hover:text-premium-gold hover:bg-gradient-to-r hover:from-premium-gold/5 hover:to-premium-amber/5'
                    }`}
                  >
                    <Icon size={16} className="group-hover:text-premium-gold transition-colors" />
                    <span className="font-medium">{category.displayName || category.name}</span>
                  </Link>
                )
              })
            )}
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
          {categoriesLoading ? (
            <span className="px-2 text-[10px] text-ocean-gray">Loading…</span>
          ) : categoryError ? (
            <span className="px-2 text-[10px] text-red-500">{categoryError}</span>
          ) : categories.length === 0 ? (
            <Link
              href="/admin/categories"
              className="flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-dashed border-premium-gold/40 text-premium-gold/80 whitespace-nowrap"
            >
              <Sparkles size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-[10px] sm:text-xs text-center">Add categories</span>
            </Link>
          ) : (
            categories.map((category) => {
              const Icon = getIcon(category.icon)
              const isActive = activeCategory === category.name || activeCategory === category.slug
              return (
                <Link
                  key={category.slug || category._id || category.name}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all whitespace-nowrap group min-w-[60px] sm:min-w-[70px] ${
                    isActive
                      ? 'text-premium-gold bg-gradient-to-r from-premium-gold/10 to-premium-amber/10'
                      : 'text-ocean-darkGray hover:text-premium-gold'
                  }`}
                >
                  <Icon size={18} className="sm:w-5 sm:h-5 group-hover:text-premium-gold transition-colors" />
                  <span className="font-medium text-[10px] sm:text-xs text-center">{category.displayName || category.name}</span>
                </Link>
              )
            })
          )}
        </nav>
      </div>
    </header>
  )
}

