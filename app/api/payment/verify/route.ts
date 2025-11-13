import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { getPaymentGateway, isPaymentGatewayConfigured } from '@/lib/payment-gateways'
import { sendSMS, formatPhoneNumber } from '@/lib/sms'

export const dynamic = 'force-dynamic'

// Verify payment using payment gateway API (if configured)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.orderId || !body?.transactionId || !body?.paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { orderId, transactionId, paymentMethod } = body

    await connectToDatabase()

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if payment gateway is configured
    const isConfigured = isPaymentGatewayConfigured(paymentMethod.toLowerCase() as 'bkash' | 'nagad' | 'rocket')

    if (isConfigured) {
      // Use payment gateway API to verify payment
      const gatewayConfig = {
        apiKey: process.env[`${paymentMethod.toUpperCase()}_API_KEY`],
        apiSecret: process.env[`${paymentMethod.toUpperCase()}_API_SECRET`],
        merchantId: process.env[`${paymentMethod.toUpperCase()}_MERCHANT_ID`],
        environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      }

      const gateway = getPaymentGateway(paymentMethod.toLowerCase() as 'bkash' | 'nagad' | 'rocket', gatewayConfig)
      const verificationResult = await gateway.verifyPayment(transactionId)

      if (!verificationResult.success) {
        return NextResponse.json(
          { error: verificationResult.error || 'Payment verification failed' },
          { status: 400 }
        )
      }

      // Update order status
      order.status = 'paid'
      await order.save()

      // Send SMS notification
      if (order.customer?.phone) {
        try {
          const phoneNumber = formatPhoneNumber(order.customer.phone)
          const message = `Your payment for order #${orderId.slice(-6)} has been verified. Order total: $${order.total.toFixed(2)}. Thank you for your purchase!`
          await sendSMS({ to: phoneNumber, message })
        } catch (smsError) {
          console.error('SMS notification error:', smsError)
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        order: order,
      })
    } else {
      // Manual verification (no API configured)
      return NextResponse.json({
        success: false,
        requiresManualVerification: true,
        message: 'Payment gateway not configured. Please verify manually in admin panel.',
      })
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

