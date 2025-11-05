import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { SiteSettings } from '@/models/SiteSettings'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()
    
    let settings = await SiteSettings.findOne().lean()
    
    if (!settings) {
      settings = await SiteSettings.create({
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
      })
    }
    
    return NextResponse.json({ settings })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    // Update or create settings
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true }
    )
    
    return NextResponse.json({ settings, message: 'Settings updated successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { error: 'Failed to update site settings', details: error.message },
      { status: 500 }
    )
  }
}

