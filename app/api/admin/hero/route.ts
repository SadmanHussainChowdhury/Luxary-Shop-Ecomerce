import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { HeroContent } from '@/models/HeroContent'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()
    
    const heroes = await HeroContent.find().sort({ order: 1 }).lean()
    
    return NextResponse.json({ heroes })
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

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body?.title || !body?.subtitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    const hero = await HeroContent.create({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description || '',
      primaryButtonText: body.primaryButtonText || 'Shop Now →',
      primaryButtonLink: body.primaryButtonLink || '/products',
      secondaryButtonText: body.secondaryButtonText || 'View Premium Collection',
      secondaryButtonLink: body.secondaryButtonLink || '/products/premium',
      stats: body.stats || [],
      badgeText: body.badgeText || "World's #1 Premium Ecommerce",
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
    })
    
    return NextResponse.json({ id: hero._id.toString(), message: 'Hero content created successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create hero content', details: error.message },
      { status: 500 }
    )
  }
}

