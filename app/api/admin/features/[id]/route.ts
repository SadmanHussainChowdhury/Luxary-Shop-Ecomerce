import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { FeatureBanner } from '@/models/FeatureBanner'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const feature = await FeatureBanner.findById(resolvedParams.id).lean()
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }
    
    return NextResponse.json({ feature })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch feature', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const feature = await FeatureBanner.findByIdAndUpdate(resolvedParams.id, body, { new: true })
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }
    
    return NextResponse.json({ feature, message: 'Feature updated successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to update feature', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    await FeatureBanner.findByIdAndDelete(resolvedParams.id)
    
    return NextResponse.json({ ok: true, message: 'Feature deleted successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to delete feature', details: error.message },
      { status: 500 }
    )
  }
}

