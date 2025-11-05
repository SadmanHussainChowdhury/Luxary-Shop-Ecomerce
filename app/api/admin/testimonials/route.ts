import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Testimonial } from '@/models/Testimonial'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()
    
    const testimonials = await Testimonial.find().sort({ order: 1 }).lean()
    
    return NextResponse.json({ testimonials })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch testimonials', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body?.name || !body?.role || !body?.text || !body?.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    const testimonial = await Testimonial.create({
      name: body.name,
      role: body.role,
      image: body.image,
      text: body.text,
      rating: body.rating || 5,
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
    })
    
    return NextResponse.json({ id: testimonial._id.toString(), message: 'Testimonial created successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create testimonial', details: error.message },
      { status: 500 }
    )
  }
}

