import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { HeroContent } from '@/models/HeroContent'

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1526481280695-3c46967acf66?auto=format&fit=crop&w=2400&q=80'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const hero = await HeroContent.findOne({ isActive: true })
      .sort({ order: 1 })
      .lean()
    
    // If no hero exists, return defaults
    if (!hero) {
      return NextResponse.json({
        hero: {
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
        },
      })
    }
    
    return NextResponse.json({
      hero: {
        ...hero,
        backgroundImage: (hero as { backgroundImage?: string }).backgroundImage || DEFAULT_HERO_IMAGE,
      },
    })
  } catch (error: any) {
    console.error('Error fetching hero content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero content', details: error.message },
      { status: 500 }
    )
  }
}

