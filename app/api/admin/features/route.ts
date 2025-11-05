import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { FeatureBanner } from '@/models/FeatureBanner'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()
    
    const features = await FeatureBanner.find().sort({ order: 1 }).lean()
    
    return NextResponse.json({ features })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch features', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body?.title || !body?.description || !body?.icon || !body?.href) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    const feature = await FeatureBanner.create({
      title: body.title,
      description: body.description,
      icon: body.icon,
      color: body.color || 'from-premium-gold to-premium-amber',
      href: body.href,
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
    })
    
    return NextResponse.json({ id: feature._id.toString(), message: 'Feature created successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create feature', details: error.message },
      { status: 500 }
    )
  }
}

