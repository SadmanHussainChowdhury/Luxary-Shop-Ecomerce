import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { requireAdmin } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin()
    
    const body = await req.json().catch(() => null)
    if (!body?.title || !body?.slug || typeof body?.price !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectToDatabase()

  const exists = await Product.findOne({ slug: body.slug })
  if (exists) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const product = await Product.create({
    title: body.title,
    slug: body.slug,
    description: body.description || '',
    price: body.price,
    images: body.images || [],
    category: body.category || '',
    brand: body.brand || '',
    countInStock: typeof body.countInStock === 'number' ? body.countInStock : 0,
    isFeatured: body.isFeatured === true,
  })

    return NextResponse.json({ id: product._id.toString() })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}


