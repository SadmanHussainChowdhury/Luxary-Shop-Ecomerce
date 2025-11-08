import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return NextResponse.json(
        { 
          error: 'Admin user already exists',
          adminEmail: existingAdmin.email,
          hint: 'If you forgot the password, you can update it manually in the database'
        },
        { status: 409 }
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered. Please use a different email.' },
        { status: 409 }
      )
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(password, 10)
    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error: any) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create admin user',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    await connectToDatabase()
    const admin = await User.findOne({ role: 'admin' })
    
    if (admin) {
      return NextResponse.json({
        exists: true,
        adminEmail: admin.email,
        message: 'Admin user already exists',
      })
    }
    
    return NextResponse.json({
      exists: false,
      message: 'No admin user found. Use POST to create one.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to check admin status',
        exists: false
      },
      { status: 500 }
    )
  }
}

