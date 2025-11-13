import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { SiteSettings, type ISiteSettings } from '@/models/SiteSettings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const settings = await SiteSettings.findOne().lean<ISiteSettings | null>()

    if (!settings) {
      const defaults: Partial<ISiteSettings> = {
        siteName: 'Luxury Shop',
        siteDescription: 'Premium Online Shopping',
        siteTagline: 'Shop Luxury. Live Premium.',
        contactEmail: 'contact@luxuryshop.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Premium Street',
        city: 'Luxury City',
        state: 'LC',
        zipCode: '12345',
        country: 'United States',
        businessHours: 'Mon-Fri: 9AM-8PM EST',
        socialLinks: {},
        footerText: '© 2024 Luxury Shop. All rights reserved.',
        footerDescription: 'Your premier destination for luxury products. Experience world-class quality and exceptional service.',
        paymentMethods: [
          { name: 'Visa', enabled: true },
          { name: 'Mastercard', enabled: true },
          { name: 'Amex', enabled: true },
          { name: 'PayPal', enabled: true },
          { name: 'Apple Pay', enabled: true },
          { name: 'Google Pay', enabled: true },
          { name: 'bKash', enabled: true },
          { name: 'Nagad', enabled: true },
          { name: 'Rocket', enabled: true },
          { name: 'Cash on Delivery', enabled: true },
        ],
        promotionalBanner: {
          enabled: true,
          text: 'New User? Get $10 off! • Free Shipping on orders over $50',
        },
      }

      return NextResponse.json({ settings: defaults })
    }

    return NextResponse.json(
      { settings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings', details: error.message },
      { status: 500 }
    )
  }
}

