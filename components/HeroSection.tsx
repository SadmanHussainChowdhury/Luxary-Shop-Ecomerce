'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react'
import Link from 'next/link'
import PremiumButton from './PremiumButton'
import { useState, useEffect } from 'react'

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1526481280695-3c46967acf66?auto=format&fit=crop&w=2400&q=80'

export default function HeroSection() {
  const [hero, setHero] = useState<any>(null)

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch('/api/hero')
        const data = await res.json()
        if (data.hero) {
          setHero(data.hero)
        }
      } catch (error) {
        console.error('Failed to load hero:', error)
      }
    }
    loadHero()
  }, [])

  // Default hero content if none loaded
  const heroContent = hero || {
    title: 'Shop Luxury.',
    subtitle: 'Live Premium.',
    description: 'Discover exclusive premium products with world-class quality. Free shipping worldwide and 30-day money-back guarantee.',
    primaryButtonText: 'Shop Now →',
    primaryButtonLink: '/products',
    secondaryButtonText: 'View Premium Collection',
    secondaryButtonLink: '/products/premium',
    stats: [
      { label: 'Happy Customers', value: '1M+' },
      { label: 'Premium Products', value: '50K+' },
      { label: 'Average Rating', value: '4.9★' },
    ],
    badgeText: "World's #1 Premium Ecommerce",
    backgroundImage: DEFAULT_HERO_IMAGE,
  }

  const backgroundImage = heroContent.backgroundImage || DEFAULT_HERO_IMAGE

  if (!heroContent) return null
  return (
    <section className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden bg-blue-950">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/65 to-blue-950/90" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.25), transparent 60%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.2), transparent 55%)' }} />

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-4 sm:space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
            >
              <Star className="fill-premium-amber text-premium-amber" size={18} />
              <span className="text-sm font-medium">{heroContent.badgeText}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              {heroContent.title}
              <br />
              {heroContent.subtitle && (
                <span className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold bg-clip-text text-transparent">
                  {heroContent.subtitle}
                </span>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-lg"
            >
              {heroContent.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <PremiumButton
                href={heroContent.primaryButtonLink || '/products'}
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-xl font-bold hover:shadow-2xl transition"
              >
                {heroContent.primaryButtonText || 'Shop Now →'}
              </PremiumButton>
              {heroContent.secondaryButtonText && (
                <Link
                  href={heroContent.secondaryButtonLink || '/products/premium'}
                  className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition"
                >
                  <span className="hidden sm:inline">{heroContent.secondaryButtonText}</span>
                  <span className="sm:hidden">Premium →</span>
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            {heroContent.stats && heroContent.stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6"
              >
                {heroContent.stats.map((stat: any, i: number) => (
                  <div key={i}>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-premium-amber">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 md:mt-0"
          >
            {[
              { icon: Truck, title: 'Free Shipping', color: 'from-blue-500 to-blue-600' },
              { icon: Shield, title: 'Secure Payment', color: 'from-green-500 to-green-600' },
              { icon: Star, title: 'Premium Quality', color: 'from-premium-gold to-premium-amber' },
              { icon: ShoppingBag, title: 'Easy Returns', color: 'from-purple-500 to-purple-600' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white hover:bg-white/20 transition"
              >
                <feature.icon size={24} className="sm:w-8 sm:h-8 mb-2 sm:mb-3 text-premium-amber" />
                <div className="font-bold text-sm sm:text-base md:text-lg">{feature.title}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

