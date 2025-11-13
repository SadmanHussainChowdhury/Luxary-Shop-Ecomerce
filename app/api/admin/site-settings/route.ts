import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { SiteSettings } from '@/models/SiteSettings'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

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
          { name: 'Cash on Delivery', enabled: true },
        ],
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
    
    // Ensure paymentMethods is properly formatted
    if (body.paymentMethods && Array.isArray(body.paymentMethods)) {
      body.paymentMethods = body.paymentMethods.map((pm: any) => ({
        name: pm.name || '',
        enabled: pm.enabled !== undefined ? pm.enabled : true,
        icon: pm.icon || undefined,
      }))
    }
    
    // Update or create settings
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    )
    
    // Verify the update was successful
    if (!settings) {
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
    
    // Fetch fresh settings to ensure we return the latest data
    const updatedSettings = await SiteSettings.findOne().lean()
    
    // Return updated settings with no-cache headers
    return NextResponse.json(
      { settings: updatedSettings || settings, message: 'Settings updated successfully' },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
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

