import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    await connectToDatabase()

    const normalizedEmail = body.email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'Account was created with social login. Please use that method.' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(body.password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Return user data (without password hash)
    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}

