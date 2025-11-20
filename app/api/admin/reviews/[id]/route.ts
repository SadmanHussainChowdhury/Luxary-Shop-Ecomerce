import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Review } from '@/models/Review'
import { Product } from '@/models/Product'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin()
    const resolvedParams = await Promise.resolve(params)
    const reviewId = resolvedParams.id
    const body = await req.json().catch(() => null)

    if (!body || typeof body.isApproved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    await connectToDatabase()
    const review = await Review.findById(reviewId)

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    review.isApproved = body.isApproved
    await review.save()

    // Recalculate product rating
    const allReviews = await Review.find({
      productId: review.productId,
      isApproved: true,
    }).lean()

    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0
    const numReviews = allReviews.length

    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews,
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review updated successfully',
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update review error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    )
  }
}

