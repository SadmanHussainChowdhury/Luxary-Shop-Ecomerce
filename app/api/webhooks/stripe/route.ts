import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true })
  }
  const sig = req.headers.get('stripe-signature') as string
  const raw = await req.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    await connectToDatabase()
    const order = await Order.findOne({ stripeSessionId: session.id })
    if (order && order.status === 'awaiting_payment') {
      order.status = 'paid'
      await order.save()
    }
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } }


