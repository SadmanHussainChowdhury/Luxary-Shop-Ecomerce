import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import mongoose from 'mongoose'

export async function GET() {
  try {
    const conn = await connectToDatabase()
    const dbName = mongoose.connection.db?.databaseName || 'Connected'
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully!',
      database: dbName,
      readyState: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Connection failed',
      hint: 'Make sure MONGODB_URI is set in .env.local file'
    }, { status: 500 })
  }
}


