import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || '' // 'user' | 'admin' | ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    
    if (role) {
      query.role = role
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ]
    }

    // Get users (exclude passwordHash)
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count
    const total = await User.countDocuments(query)

    // Get role counts
    const userCount = await User.countDocuments({ role: 'user' })
    const adminCount = await User.countDocuments({ role: 'admin' })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        users: userCount,
        admins: adminCount,
      },
    })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    )
  }
}

