import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Category } from '@/models/Category'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()
    
    const categories = await Category.find({})
      .sort({ order: 1, name: 1 })
      .lean()
    
    return NextResponse.json({ categories })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await req.json().catch(() => null)
    if (!body?.name || !body?.slug || !body?.displayName) {
      return NextResponse.json({ error: 'Missing required fields: name, slug, displayName' }, { status: 400 })
    }

    const exists = await Category.findOne({ slug: body.slug })
    if (exists) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 })
    }

    const category = await Category.create({
      name: body.name,
      slug: body.slug,
      displayName: body.displayName,
      icon: body.icon || '',
      color: body.color || '',
      description: body.description || '',
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category', details: error.message },
      { status: 500 }
    )
  }
}

