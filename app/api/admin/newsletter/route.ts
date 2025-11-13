import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { NewsletterSubscription } from '@/models/NewsletterSubscription'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') // 'active' | 'inactive' | 'all'
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    
    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }

    if (search) {
      query.email = { $regex: search, $options: 'i' }
    }

    // Get subscriptions
    const subscriptions = await NewsletterSubscription.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count
    const total = await NewsletterSubscription.countDocuments(query)

    // Get active count
    const activeCount = await NewsletterSubscription.countDocuments({ isActive: true })
    const inactiveCount = await NewsletterSubscription.countDocuments({ isActive: false })

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        active: activeCount,
        inactive: inactiveCount,
      },
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching newsletter subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscriptions', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body || !body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await connectToDatabase()

    const subscription = await NewsletterSubscription.findOneAndUpdate(
      { email: body.email.toLowerCase() },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    )

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Subscription deactivated successfully',
      subscription 
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deactivating newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate subscription', details: error.message },
      { status: 500 }
    )
  }
}

