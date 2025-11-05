import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { FeatureBanner } from '@/models/FeatureBanner'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const features = await FeatureBanner.find({ isActive: true })
      .sort({ order: 1 })
      .lean()
    
    return NextResponse.json({ features })
  } catch (error: any) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features', details: error.message },
      { status: 500 }
    )
  }
}

