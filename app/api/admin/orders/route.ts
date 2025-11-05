import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin()
    
    await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Math.min(Number(searchParams.get('pageSize') || '20'), 100)

  const filter: any = {}
  if (status) filter.status = status

  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(filter),
  ])

  // Transform items to use 'user' instead of 'userId'
  const transformedItems = items.map((item: any) => ({
    ...item,
    user: item.userId || null,
    userId: undefined,
  }))

    return NextResponse.json({
      items: transformedItems,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 })
  }
}


