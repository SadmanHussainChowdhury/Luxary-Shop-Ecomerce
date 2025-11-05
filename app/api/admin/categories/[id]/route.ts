import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Category } from '@/models/Category'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const category = await Category.findById(resolvedParams.id).lean()
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ category })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const category = await Category.findById(resolvedParams.id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if slug is being changed and if it conflicts with another category
    if (body.slug && body.slug !== category.slug) {
      const exists = await Category.findOne({ slug: body.slug, _id: { $ne: resolvedParams.id } })
      if (exists) {
        return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 })
      }
    }

    // Update fields
    if (body.name !== undefined) category.name = body.name
    if (body.slug !== undefined) category.slug = body.slug
    if (body.displayName !== undefined) category.displayName = body.displayName
    if (body.icon !== undefined) category.icon = body.icon
    if (body.color !== undefined) category.color = body.color
    if (body.description !== undefined) category.description = body.description
    if (body.isActive !== undefined) category.isActive = body.isActive
    if (body.order !== undefined) category.order = body.order

    await category.save()

    return NextResponse.json({ category })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const category = await Category.findById(resolvedParams.id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    await Category.deleteOne({ _id: resolvedParams.id })

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category', details: error.message },
      { status: 500 }
    )
  }
}

