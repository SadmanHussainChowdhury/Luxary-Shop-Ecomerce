import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Coupon } from '@/models/Coupon'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { code, subtotal, items } = body

    if (!code || !subtotal) {
      return NextResponse.json({ error: 'Code and subtotal are required' }, { status: 400 })
    }

    await connectToDatabase()

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase().trim(),
      status: 'active',
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    // Check if coupon is expired
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    // Check minimum purchase
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return NextResponse.json({ 
        error: `Minimum purchase of $${coupon.minPurchase} required` 
      }, { status: 400 })
    }

    // Note: Category restrictions would require fetching product categories from the database
    // For now, we'll skip category validation in the validate endpoint
    // Category validation can be done at checkout time when we have full product data

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      }
    } else {
      discountAmount = Math.min(coupon.value, subtotal)
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: Math.round(discountAmount * 100) / 100,
        description: coupon.description,
      },
    })
  } catch (error: any) {
    console.error('Validate coupon error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}

