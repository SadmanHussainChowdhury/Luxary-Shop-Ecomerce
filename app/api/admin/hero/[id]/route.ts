import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { HeroContent } from '@/models/HeroContent'
import { requireAdmin } from '@/lib/auth-server'

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2400&q=80'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const hero = await HeroContent.findById(resolvedParams.id).lean()
    if (!hero) {
      return NextResponse.json({ error: 'Hero content not found' }, { status: 404 })
    }
    
    return NextResponse.json({ hero })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch hero content', details: error.message },
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
    
    const hero = await HeroContent.findByIdAndUpdate(resolvedParams.id, body, { new: true })
    if (!hero) {
      return NextResponse.json({ error: 'Hero content not found' }, { status: 404 })
    }
    
    return NextResponse.json({ hero, message: 'Hero content updated successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to update hero content', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    await HeroContent.findByIdAndDelete(resolvedParams.id)
    
    return NextResponse.json({ ok: true, message: 'Hero content deleted successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to delete hero content', details: error.message },
      { status: 500 }
    )
  }
}

