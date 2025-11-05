import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import FlashSaleCountdown from '@/components/FlashSaleCountdown'
import HeroSection from '@/components/HeroSection'
import CategoryGrid from '@/components/CategoryGrid'
import FeaturedBanner from '@/components/FeaturedBanner'
import Testimonials from '@/components/Testimonials'
import { FeaturedProductsSection, PopularProductsSection } from '@/components/StaticProductSections'

export default async function HomePage() {

  return (
    <div className="relative">
      <FlashSaleCountdown />
      <HeroSection />
      
      {/* Promotional Banner */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-ocean-border relative z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-ocean-gray">
              <span className="text-ocean-blue font-semibold whitespace-nowrap">New User? Get $10 off!</span>
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap">Free Shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-ocean-gray">
              <Link href="/products?tag=premium" className="hover:text-ocean-blue whitespace-nowrap">Premium Items</Link>
              <Link href="/products?category=Electronics" className="hover:text-ocean-blue whitespace-nowrap">Electronics</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Featured Banner */}
      <FeaturedBanner />

      {/* Featured Products - Static High Quality */}
      <FeaturedProductsSection />

      {/* Popular Products - Static High Quality */}
      <PopularProductsSection />

      {/* Testimonials */}
      <Testimonials />
      <Newsletter />
    </div>
  )
}
