import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'

// Simple in-memory storage for newsletter (in production, use database)
const newsletterEmails = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // In production, save to database
    newsletterEmails.add(email.toLowerCase())

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

