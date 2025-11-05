import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { FlashSale } from '@/models/FlashSale'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    const flashSale = await FlashSale.findOne({ 
      isActive: true,
      endDate: { $gt: new Date() }
    }).sort({ createdAt: -1 }).lean()
    
    // If no active flash sale, return null
    if (!flashSale) {
      return NextResponse.json({ flashSale: null })
    }
    
    return NextResponse.json({ flashSale })
  } catch (error: any) {
    console.error('Error fetching flash sale:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flash sale', details: error.message },
      { status: 500 }
    )
  }
}

