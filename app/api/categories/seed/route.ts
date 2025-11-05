import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Category } from '@/models/Category'

const defaultCategories = [
  { name: 'Electronics', slug: 'electronics', displayName: 'Electronics', icon: 'Zap', color: 'from-blue-500 to-blue-600', order: 0 },
  { name: 'Apparel', slug: 'apparel', displayName: 'Fashion', icon: 'Shirt', color: 'from-pink-500 to-pink-600', order: 1 },
  { name: 'Home', slug: 'home', displayName: 'Home & Garden', icon: 'Home', color: 'from-purple-500 to-purple-600', order: 2 },
  { name: 'Audio', slug: 'audio', displayName: 'Audio', icon: 'Headphones', color: 'from-green-500 to-green-600', order: 3 },
  { name: 'Bags', slug: 'bags', displayName: 'Bags', icon: 'ShoppingBag', color: 'from-amber-500 to-amber-600', order: 4 },
  { name: 'Accessories', slug: 'accessories', displayName: 'Accessories', icon: 'Watch', color: 'from-red-500 to-red-600', order: 5 },
  { name: 'Beauty', slug: 'beauty', displayName: 'Beauty', icon: 'Heart', color: 'from-rose-500 to-rose-600', order: 6 },
  { name: 'Sports', slug: 'sports', displayName: 'Sports', icon: 'Activity', color: 'from-indigo-500 to-indigo-600', order: 7 },
]

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    
    // Check if categories already exist
    const existingCount = await Category.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: 'Categories already exist', 
        count: existingCount 
      })
    }

    // Create default categories
    const created = await Category.insertMany(defaultCategories)

    return NextResponse.json({ 
      message: 'Default categories created successfully',
      count: created.length,
      categories: created 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error seeding categories:', error)
    return NextResponse.json(
      { error: 'Failed to seed categories', details: error.message },
      { status: 500 }
    )
  }
}

