import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.orderId || !body?.paymentIntentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { orderId, paymentIntentId } = body

    await connectToDatabase()

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify payment intent with Stripe
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        
        if (paymentIntent.status !== 'succeeded') {
          return NextResponse.json(
            { error: 'Payment not completed' },
            { status: 400 }
          )
        }

        // Update order status to paid
        order.status = 'paid'
        order.stripePaymentIntentId = paymentIntentId
        await order.save()

        return NextResponse.json({
          success: true,
          message: 'Payment confirmed successfully',
          order: order,
        })
      } catch (stripeError: any) {
        console.error('Stripe verification error:', stripeError)
        return NextResponse.json(
          { error: 'Failed to verify payment with Stripe' },
          { status: 500 }
        )
      }
    } else {
      // If Stripe is not configured, just mark as paid (for development)
      order.status = 'paid'
      order.stripePaymentIntentId = paymentIntentId
      await order.save()

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed (Stripe not configured)',
        order: order,
      })
    }
  } catch (error: any) {
    console.error('Confirm payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}

