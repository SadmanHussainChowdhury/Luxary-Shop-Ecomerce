import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  try {
    await connectToDatabase()
    const resolvedParams = await Promise.resolve(params)
    const product = await Product.findOne({ slug: resolvedParams.slug }).lean()
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch product' }, { status: 500 })
  }
}


