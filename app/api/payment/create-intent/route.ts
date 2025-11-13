import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { Product } from '@/models/Product'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { items, customer, total } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!customer || !customer.name || !customer.email || !customer.address) {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 })
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
        { status: 500 }
      )
    }

    await connectToDatabase()

    // Get product details
    const slugs = items.map((i: any) => i.slug)
    const products = await Product.find({ slug: { $in: slugs } }).lean()

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Some products not found' }, { status: 404 })
    }

    // Create order items
    const orderItems = items.map((i: any) => {
      const p: any = products.find((x: any) => x.slug === i.slug)
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

    // Calculate total
    const calculatedTotal = total || orderItems.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0)
    const shipping = 10.00
    const tax = calculatedTotal * 0.08
    const finalTotal = calculatedTotal + shipping + tax

    // Create order with awaiting_payment status
    const order = await Order.create({
      items: orderItems,
      total: finalTotal,
      status: 'awaiting_payment',
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
      paymentMethod: 'card',
    })

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        customerEmail: customer.email,
        customerName: customer.name,
      },
      description: `Order #${order._id.toString().slice(-6)} - ${orderItems.length} item(s)`,
    })

    // Update order with payment intent ID
    order.stripePaymentIntentId = paymentIntent.id
    await order.save()

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id.toString(),
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

