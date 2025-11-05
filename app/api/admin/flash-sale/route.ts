import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { FlashSale } from '@/models/FlashSale'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()
    
    const flashSales = await FlashSale.find().sort({ createdAt: -1 }).lean()
    
    return NextResponse.json({ flashSales })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch flash sales', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body?.title || !body?.endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    // Deactivate all other flash sales
    await FlashSale.updateMany({}, { isActive: false })
    
    const flashSale = await FlashSale.create({
      title: body.title,
      buttonText: body.buttonText || 'Shop Now →',
      buttonLink: body.buttonLink || '/products?tag=flash',
      endDate: new Date(body.endDate),
      isActive: body.isActive !== undefined ? body.isActive : true,
    })
    
    return NextResponse.json({ id: flashSale._id.toString(), message: 'Flash sale created successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create flash sale', details: error.message },
      { status: 500 }
    )
  }
}

