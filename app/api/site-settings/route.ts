import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { SiteSettings } from '@/models/SiteSettings'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    let settings = await SiteSettings.findOne().lean()
    
    // If no settings exist, return defaults
    if (!settings) {
      settings = {
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

