import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Review } from '@/models/Review'
import { Product } from '@/models/Product'
import { Order } from '@/models/Order'

export const dynamic = 'force-dynamic'

// GET - Fetch reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const productSlug = searchParams.get('productSlug')
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = parseInt(searchParams.get('skip') || '0', 10)

    if (!productId && !productSlug) {
      return NextResponse.json({ error: 'Product ID or slug is required' }, { status: 400 })
    }

    await connectToDatabase()

    let product: any = null
    if (productSlug) {
      product = await Product.findOne({ slug: productSlug }).lean()
    } else if (productId) {
      product = await Product.findById(productId).lean()
    }

    if (!product || !product._id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const productIdValue = product._id.toString()

    const reviews = await Review.find({ 
      productId: productIdValue,
      isApproved: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Review.countDocuments({ 
      productId: productIdValue,
      isApproved: true 
    })

    return NextResponse.json({
      reviews,
      total,
      hasMore: skip + limit < total,
    })
  } catch (error: any) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST - Create a new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { productId, productSlug, customerName, customerEmail, rating, title, comment, images } = body

    if (!productId && !productSlug) {
      return NextResponse.json({ error: 'Product ID or slug is required' }, { status: 400 })
    }

    if (!customerName || !customerEmail || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid review data' }, { status: 400 })
    }

    await connectToDatabase()

    // Find product
    let product: any
    if (productSlug) {
      product = await Product.findOne({ slug: productSlug }).lean()
    } else {
      product = await Product.findById(productId).lean()
    }

    if (!product || !product._id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if customer has purchased this product (for verified purchase badge)
    const hasPurchased = await Order.exists({
      'customer.email': customerEmail.toLowerCase(),
      'items.productId': product._id,
      status: { $in: ['paid', 'fulfilled'] },
    })

    // Check if customer already reviewed this product
    const existingReview = await Review.findOne({
      productId: product._id,
      customerEmail: customerEmail.toLowerCase(),
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    // Create review
    const review = await Review.create({
      productId: product._id,
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      rating,
      title: title?.trim(),
      comment: comment?.trim(),
      images: Array.isArray(images) ? images : [],
      isVerifiedPurchase: !!hasPurchased,
      isApproved: true, // Auto-approve for now, can add moderation later
    })

    // Update product rating
    const allReviews = await Review.find({ 
      productId: product._id,
      isApproved: true 
    }).lean()

    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0
    const numReviews = allReviews.length

    await Product.findByIdAndUpdate(product._id, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      numReviews,
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully',
    })
  } catch (error: any) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    )
  }
}

