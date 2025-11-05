import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    const order = await Order.findById(resolvedParams.id)
      .populate('userId', 'name email')
      .lean()
    
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    // Transform to use 'user' instead of 'userId'
    const transformedOrder = {
      ...order,
      user: order.userId || null,
      userId: undefined,
    }
    
    return NextResponse.json(transformedOrder)
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    const allowed: any = {}
    if (body.status) allowed.status = body.status
    const updated = await Order.findByIdAndUpdate(resolvedParams.id, allowed, { new: true })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 })
  }
}


