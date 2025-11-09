import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import FlashSaleCountdown from '@/components/FlashSaleCountdown'
import HeroSection from '@/components/HeroSection'
import CategoryGrid from '@/components/CategoryGrid'
import FeaturedBanner from '@/components/FeaturedBanner'
import Testimonials from '@/components/Testimonials'
import DynamicFeaturedProductsSection from '@/components/home/DynamicFeaturedProductsSection'
import DynamicPopularProductsSection from '@/components/home/DynamicPopularProductsSection'
import { connectToDatabase } from '@/lib/mongoose'
import { SiteSettings } from '@/models/SiteSettings'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let siteSettings: any = null

  try {
    await connectToDatabase()
    siteSettings = await SiteSettings.findOne().lean()
  } catch (error) {
    console.error('Failed to load site settings for home page:', error)
  }

  const promotionalDefaults = {
    enabled: true,
    text: 'Free Shipping on orders over $50',
    link: '/products',
  }

  const promotionalBanner = {
    ...promotionalDefaults,
    ...(siteSettings?.promotionalBanner || {}),
  }

  const siteTagline = siteSettings?.siteTagline || 'Shop Luxury. Live Premium.'
  const bannerText = promotionalBanner.text?.trim()
  const bannerLink = promotionalBanner.link?.trim()
  const hasBannerText = Boolean(bannerText)

  return (
    <div className="relative">
      <FlashSaleCountdown />
      <HeroSection />
      
      {/* Promotional Banner */}
      {promotionalBanner.enabled && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-ocean-border relative z-10">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-ocean-gray">
                <span className="text-ocean-blue font-semibold whitespace-nowrap">{siteTagline}</span>
                {hasBannerText && (
                  <div className="flex items-center gap-2 text-ocean-gray">
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">{bannerText}</span>
                  </div>
                )}
              </div>
              {bannerLink && (
                <div className="flex items-center gap-3 sm:gap-4 text-ocean-gray">
                  <Link href={bannerLink} className="hover:text-ocean-blue whitespace-nowrap">
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Featured Banner */}
      <FeaturedBanner />

      {/* Featured Products */}
      <DynamicFeaturedProductsSection />

      {/* Popular Products */}
      <DynamicPopularProductsSection />

      {/* Testimonials */}
      <Testimonials />
      <Newsletter />
    </div>
  )
}
