import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Category } from '@/models/Category'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') !== 'false'
    
    const filter: Record<string, any> = {}
    if (activeOnly) {
      filter.isActive = true
    }
    
    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .lean()
    
    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    )
  }
}

