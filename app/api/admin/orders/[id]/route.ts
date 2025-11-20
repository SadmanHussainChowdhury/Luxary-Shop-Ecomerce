import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { requireAdmin } from '@/lib/auth-server'
import { sendEmail, emailTemplates } from '@/lib/email'

export const dynamic = 'force-dynamic'

// GET - Get order details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin()
    const resolvedParams = await Promise.resolve(params)
    const orderId = resolvedParams.id

    await connectToDatabase()
    const order = await Order.findById(orderId).lean()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PATCH - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin()
    const resolvedParams = await Promise.resolve(params)
    const orderId = resolvedParams.id
    const body = await req.json().catch(() => null)

    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    await connectToDatabase()
    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const oldStatus = order.status
    const updates: any = {}

    if (body.status) {
      updates.status = body.status
    }
    if (body.trackingNumber) {
      updates.trackingNumber = body.trackingNumber
    }
    if (body.shippingCarrier) {
      updates.shippingCarrier = body.shippingCarrier
    }
    if (body.estimatedDelivery) {
      updates.estimatedDelivery = new Date(body.estimatedDelivery)
    }

    Object.assign(order, updates)
    await order.save()

    // Send email notifications on status changes
    if (order.customer?.email) {
      try {
        if (body.status === 'paid' && oldStatus !== 'paid') {
          // Order confirmed email already sent on creation, but can resend if needed
        } else if (body.status === 'fulfilled' && oldStatus !== 'fulfilled') {
          const emailTemplate = emailTemplates.orderShipped(order, body.trackingNumber)
          await sendEmail({
            to: order.customer.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          })
        } else if (body.status === 'cancelled' && oldStatus !== 'cancelled') {
          // Could add cancellation email template here
        }
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError)
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order updated successfully',
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}
