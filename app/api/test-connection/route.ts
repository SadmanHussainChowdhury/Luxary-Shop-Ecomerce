import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import mongoose from 'mongoose'

export async function GET() {
  try {
    // Check if MONGODB_URI is set
    const uri = process.env.MONGODB_URI
    if (!uri) {
      return NextResponse.json({ 
        success: false, 
        error: 'MONGODB_URI is not set in environment variables',
        hint: 'Make sure MONGODB_URI is set in .env.local file and restart the dev server'
      }, { status: 500 })
    }

    // Check connection string format
    const cleanUri = uri.trim().replace(/^["']|["']$/g, '')
    
    // Check for placeholder values
    if (cleanUri.includes('your-mongodb-connection-string') || 
        cleanUri.includes('YOUR_USERNAME') || 
        cleanUri.includes('YOUR_PASSWORD') ||
        cleanUri.length < 20) {
      return NextResponse.json({ 
        success: false, 
        error: 'MongoDB connection string appears to be a placeholder',
        hint: 'Please update MONGODB_URI in .env.local with your actual connection string and restart the dev server',
        received: cleanUri.substring(0, 50),
        debug: process.env.NODE_ENV === 'development' ? {
          uriLength: cleanUri.length,
          firstChars: cleanUri.substring(0, 30)
        } : undefined
      }, { status: 500 })
    }
    
    if (!cleanUri.startsWith('mongodb://') && !cleanUri.startsWith('mongodb+srv://')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid MongoDB connection string format',
        hint: `Connection string should start with "mongodb://" or "mongodb+srv://". Got: ${cleanUri.substring(0, 50)}...`,
        received: cleanUri.substring(0, 50),
        debug: process.env.NODE_ENV === 'development' ? {
          uriLength: cleanUri.length,
          firstChars: cleanUri.substring(0, 30),
          envKeys: Object.keys(process.env).filter(k => k.includes('MONGO'))
        } : undefined
      }, { status: 500 })
    }

    // Attempt connection
    const conn = await connectToDatabase()
    const dbName = mongoose.connection.db?.databaseName || 'Connected'
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully!',
      database: dbName,
      readyState: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting',
      cluster: cleanUri.match(/@([^/]+)/)?.[1] || 'Unknown'
    })
  } catch (error: any) {
    // Provide more detailed error information
    let errorMessage = error.message || 'Connection failed'
    let hint = 'Make sure MONGODB_URI is set in .env.local file'
    
    // Common error patterns
    if (errorMessage.includes('authentication failed')) {
      hint = 'Check your MongoDB username and password in the connection string'
    } else if (errorMessage.includes('IP') || errorMessage.includes('whitelist')) {
      hint = 'Add your IP address to MongoDB Atlas Network Access (or use 0.0.0.0/0 for development)'
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ENOTFOUND')) {
      hint = 'Check your internet connection and MongoDB cluster status'
    } else if (errorMessage.includes('Invalid')) {
      hint = 'Check the connection string format in .env.local file'
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      hint,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}


