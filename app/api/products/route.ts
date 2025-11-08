import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  await connectToDatabase()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || undefined
  const sort = searchParams.get('sort') || 'new'
  const tag = searchParams.get('tag') || undefined
  const featured = searchParams.get('featured') || undefined
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Math.min(Number(searchParams.get('pageSize') || '24'), 60)

  const filter: Record<string, any> = {}
  let useTextSearch = false
  
  // Handle search query
  if (q && q.trim()) {
    const searchQuery = q.trim()
    // Use MongoDB text search (requires text index on title and description)
    // If text index is not available, MongoDB will error, so we'll catch it and use regex fallback
    filter.$text = { $search: searchQuery }
    useTextSearch = true
  }
  
  if (category) filter.category = category
  if (tag) filter.tags = tag
  if (featured) filter.isFeatured = true

  // Build sort criteria
  let sortBy: Record<string, any> = {}
  
  // Apply user-selected sort
  if (sort === 'price-asc') {
    sortBy.price = 1
  } else if (sort === 'price-desc') {
    sortBy.price = -1
  } else if (sort === 'rating') {
    sortBy.rating = -1
  } else if (!q || !q.trim()) {
    sortBy.createdAt = -1
  }
  
  // If using text search, sort by text score first
  if (useTextSearch) {
    sortBy = { score: { $meta: 'textScore' }, ...sortBy }
  }

  let query = Product.find(filter)
  
  // Add text score projection if using text search
  if (useTextSearch) {
    query = query.select({ score: { $meta: 'textScore' } })
  }
  
  let items: any[] = []
  let total = 0
  
  try {
    const [queryResult, countResult] = await Promise.all([
      query
        .sort(sortBy)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filter)
    ])
    items = queryResult
    total = countResult
  } catch (error: any) {
    // If text search fails (no text index), fall back to regex search
    if (useTextSearch && (error.message?.includes('text index') || error.code === 27)) {
      const searchQuery = q?.trim() || ''
      delete filter.$text
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { slug: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } },
      ]
      
      // Rebuild sort without text score
      sortBy = {}
      if (sort === 'price-asc') {
        sortBy.price = 1
      } else if (sort === 'price-desc') {
        sortBy.price = -1
      } else if (sort === 'rating') {
        sortBy.rating = -1
      } else {
        sortBy.createdAt = -1
      }
      
      const [queryResult, countResult] = await Promise.all([
        Product.find(filter)
          .sort(sortBy)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean(),
        Product.countDocuments(filter)
      ])
      items = queryResult
      total = countResult
    } else {
      throw error
    }
  }

  return NextResponse.json({
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}


