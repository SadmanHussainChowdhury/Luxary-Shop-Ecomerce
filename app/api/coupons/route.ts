import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Coupon } from '@/models/Coupon'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

// GET - List all coupons (admin only)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const query: any = {}
    if (status) {
      query.status = status
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean()

    // Add status field if missing (for backward compatibility)
    const couponsWithStatus = coupons.map((coupon: any) => {
      const now = new Date()
      const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null
      
      let status = coupon.isActive === false ? 'inactive' : 'active'
      if (validUntil && now > validUntil) {
        status = 'expired'
      }
      
      return {
        ...coupon,
        status,
      }
    })

    return NextResponse.json({ coupons: couponsWithStatus })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get coupons error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

// POST - Create a new coupon (admin only)
export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      usageLimit,
      userLimit,
      validFrom,
      validUntil,
      categories,
      description,
    } = body

    if (!code || !type || !value || !validUntil) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectToDatabase()

    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() })
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      type,
      value,
      minPurchase,
      maxDiscount,
      usageLimit,
      userLimit,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: new Date(validUntil),
      categories: Array.isArray(categories) ? categories : [],
      description,
      status: 'active',
    })

    return NextResponse.json({
      success: true,
      coupon,
      message: 'Coupon created successfully',
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Create coupon error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create coupon' },
      { status: 500 }
    )
  }
}

