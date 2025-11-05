import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Testimonial } from '@/models/Testimonial'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1 })
      .limit(10)
      .lean()
    
    return NextResponse.json({ testimonials })
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials', details: error.message },
      { status: 500 }
    )
  }
}

