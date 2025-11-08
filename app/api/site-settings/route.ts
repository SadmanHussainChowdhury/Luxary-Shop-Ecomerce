import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { SiteSettings, type ISiteSettings } from '@/models/SiteSettings'

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
        address: '123 Premium Street, Luxury City, LC 12345',
        socialLinks: {},
        footerText: '© 2024 Luxury Shop. All rights reserved.',
        promotionalBanner: {
          enabled: true,
          text: 'New User? Get $10 off! • Free Shipping on orders over $50',
        },
      }

      return NextResponse.json({ settings: defaults })
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings', details: error.message },
      { status: 500 }
    )
  }
}

