import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { FlashSale } from '@/models/FlashSale'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    const flashSale = await FlashSale.findById(resolvedParams.id).lean()
    if (!flashSale) {
      return NextResponse.json({ error: 'Flash sale not found' }, { status: 404 })
    }
    
    return NextResponse.json({ flashSale })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch flash sale', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    // If activating this flash sale, deactivate others
    if (body.isActive) {
      await FlashSale.updateMany({ _id: { $ne: resolvedParams.id } }, { isActive: false })
    }
    
    const flashSale = await FlashSale.findByIdAndUpdate(
      resolvedParams.id,
      { ...body, endDate: body.endDate ? new Date(body.endDate) : undefined },
      { new: true }
    )
    if (!flashSale) {
      return NextResponse.json({ error: 'Flash sale not found' }, { status: 404 })
    }
    
    return NextResponse.json({ flashSale, message: 'Flash sale updated successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to update flash sale', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin()
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    
    await FlashSale.findByIdAndDelete(resolvedParams.id)
    
    return NextResponse.json({ ok: true, message: 'Flash sale deleted successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to delete flash sale', details: error.message },
      { status: 500 }
    )
  }
}

