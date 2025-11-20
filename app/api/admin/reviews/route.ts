import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Review } from '@/models/Review'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'all'

    const query: any = {}
    if (filter === 'approved') {
      query.isApproved = true
    } else if (filter === 'pending') {
      query.isApproved = false
    }

    const reviews = await Review.find(query)
      .populate('productId', 'title slug')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ reviews })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

