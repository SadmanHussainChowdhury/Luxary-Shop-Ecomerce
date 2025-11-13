import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.email || !body?.password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await connectToDatabase()

  const exists = await User.findOne({ email: body.email })
  if (exists) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(body.password, 10)
  const user = await User.create({ 
    name: body.name, 
    email: body.email.toLowerCase(), 
    passwordHash,
    phone: body.phone || undefined,
  })
  return NextResponse.json({ id: user._id.toString(), email: user.email, name: user.name })
}


