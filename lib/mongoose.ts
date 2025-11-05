import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached = global.mongooseCache || { conn: null, promise: null }
global.mongooseCache = cached

export async function connectToDatabase() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('Missing MONGODB_URI in environment. Please add MONGODB_URI to your .env.local file.')
    }
    
    // Validate connection string format
    const trimmedUri = uri.trim()
    
    // Remove any quotes that might be around the URI
    const cleanUri = trimmedUri.replace(/^["']|["']$/g, '')
    
    if (!cleanUri.startsWith('mongodb://') && !cleanUri.startsWith('mongodb+srv://')) {
      console.error('MONGODB_URI value:', JSON.stringify(uri))
      console.error('Trimmed URI:', JSON.stringify(trimmedUri))
      console.error('Clean URI:', JSON.stringify(cleanUri))
      throw new Error(
        `Invalid MongoDB connection string format. Expected to start with "mongodb://" or "mongodb+srv://". ` +
        `Got: ${cleanUri.substring(0, 50)}... ` +
        `Please check your .env.local file and ensure MONGODB_URI starts with "mongodb://" or "mongodb+srv://". ` +
        `Make sure there are no quotes around the value in .env.local`
      )
    }
    
    cached.promise = mongoose
      .connect(cleanUri, {
        dbName: process.env.MONGODB_DB || undefined,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        // Clear the promise on error so we can retry
        cached.promise = null
        console.error('MongoDB connection error:', error.message)
        console.error('Attempted URI:', cleanUri.substring(0, 30) + '...')
        throw error
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}


