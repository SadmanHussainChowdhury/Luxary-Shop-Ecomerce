import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { Order } from '@/models/Order'
import { Coupon } from '@/models/Coupon'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const items: { slug: string; quantity: number }[] = body?.items || []
    const customer = body?.customer
    const paymentMethod = body?.paymentMethod || 'card'
    const total = body?.total
    const couponCode = body?.couponCode

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!customer || !customer.name || !customer.email || !customer.address) {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 })
    }

    await connectToDatabase()
    const slugs = items.map((i) => i.slug)
    const products = await Product.find({ slug: { $in: slugs } })

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Some products not found' }, { status: 404 })
    }

    // Check inventory and create order items
    const orderItems = []
    for (const item of items) {
      const p: any = products.find((x) => x.slug === item.slug)
      if (!p) {
        return NextResponse.json({ error: `Product not found: ${item.slug}` }, { status: 404 })
      }

      const quantity = Math.max(1, Math.min(99, item.quantity || 1))
      
      // Check stock availability
      if (p.countInStock < quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${p.title}. Only ${p.countInStock} available.` 
        }, { status: 400 })
      }

      orderItems.push({
        productId: p._id,
        slug: p.slug,
        title: p.title,
        price: p.price,
        quantity,
        image: p.images?.[0]?.url,
      })
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0)
    const shipping = body?.shipping || 10.00
    const tax = body?.tax || subtotal * 0.08

    // Apply coupon if provided
    let discountAmount = 0
    let appliedCoupon = null
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase().trim(),
        status: 'active',
      })

      if (coupon) {
        const now = new Date()
        if (now >= coupon.validFrom && now <= coupon.validUntil) {
          if (!coupon.minPurchase || subtotal >= coupon.minPurchase) {
            if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
              if (coupon.type === 'percentage') {
                discountAmount = (subtotal * coupon.value) / 100
                if (coupon.maxDiscount) {
                  discountAmount = Math.min(discountAmount, coupon.maxDiscount)
                }
              } else {
                discountAmount = Math.min(coupon.value, subtotal)
              }
              appliedCoupon = coupon
            }
          }
        }
      }
    }

    // Calculate final total
    const calculatedTotal = Math.max(0, subtotal + shipping + tax - discountAmount)

    // Determine order status based on payment method
    const paymentMethodLower = (paymentMethod || '').toLowerCase()
    const isMobilePayment = ['bkash', 'nagad', 'rocket'].includes(paymentMethodLower)
    const isCashDelivery = paymentMethodLower === 'cash' || paymentMethodLower.includes('delivery')
    const status = (isCashDelivery || isMobilePayment) ? 'awaiting_payment' : 'paid'

    // Create order
    const order = await Order.create({
      items: orderItems,
      subtotal,
      shipping,
      tax,
      discountAmount,
      total: calculatedTotal,
      status,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        country: customer.country || 'United States',
      },
      paymentMethod,
      couponCode: appliedCoupon?.code,
    })

    // Update coupon usage count
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, {
        $inc: { usedCount: 1 },
      })
    }

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity },
      })
    }

    // Send order confirmation email
    try {
      const emailTemplate = emailTemplates.orderConfirmation(order)
      await sendEmail({
        to: customer.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      message: 'Order created successfully',
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}


