import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { Order } from '@/models/Order'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const items: { slug: string; quantity: number }[] = body?.items || []
    const customer = body?.customer
    const paymentMethod = body?.paymentMethod || 'card'
    const total = body?.total

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!customer || !customer.name || !customer.email || !customer.address) {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 })
    }

    await connectToDatabase()
    const slugs = items.map((i) => i.slug)
    const products = await Product.find({ slug: { $in: slugs } }).lean()

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Some products not found' }, { status: 404 })
    }

    // Create order items
    const orderItems = items.map((i) => {
      const p: any = products.find((x) => x.slug === i.slug)
      if (!p) throw new Error(`Product not found: ${i.slug}`)
      return {
        productId: p._id,
        slug: p.slug,
        title: p.title,
        price: p.price,
        quantity: Math.max(1, Math.min(99, i.quantity || 1)),
        image: p.images?.[0]?.url,
      }
    })

    // Calculate total if not provided
    const calculatedTotal = total || orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0)

    // Determine order status based on payment method
    // Cash on delivery and mobile payment methods (bKash, Nagad, Rocket) require manual verification
    const paymentMethodLower = (paymentMethod || '').toLowerCase()
    const isMobilePayment = ['bkash', 'nagad', 'rocket'].includes(paymentMethodLower)
    const isCashDelivery = paymentMethodLower === 'cash' || paymentMethodLower.includes('delivery')
    const status = (isCashDelivery || isMobilePayment) ? 'awaiting_payment' : 'paid'

    // Create order
    const order = await Order.create({
      items: orderItems,
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
    })

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


