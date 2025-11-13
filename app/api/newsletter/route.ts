import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { NewsletterSubscription } from '@/models/NewsletterSubscription'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    await connectToDatabase()

    const normalizedEmail = email.toLowerCase().trim()

    // Check if email already exists
    const existing = await NewsletterSubscription.findOne({ email: normalizedEmail })

    if (existing) {
      // If exists but unsubscribed, reactivate it
      if (!existing.isActive) {
        existing.isActive = true
        existing.subscribedAt = new Date()
        existing.unsubscribedAt = undefined
        await existing.save()
        return NextResponse.json({ 
          success: true, 
          message: 'Successfully re-subscribed to newsletter!' 
        })
      }
      // Already subscribed
      return NextResponse.json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter!' 
      })
    }

    // Create new subscription
    await NewsletterSubscription.create({
      email: normalizedEmail,
      subscribedAt: new Date(),
      isActive: true,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter!' 
      })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

