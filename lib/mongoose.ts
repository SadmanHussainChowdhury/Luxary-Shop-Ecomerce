import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

let envLoaded = false

const cached = global.mongooseCache || { conn: null, promise: null }
global.mongooseCache = cached

function ensureEnvLoaded() {
  if (envLoaded) return

  const candidates = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '..', '.env.local'),
    path.join(process.cwd(), '..', '..', '.env.local'),
  ]

  for (const candidatePath of candidates) {
    if (fs.existsSync(candidatePath)) {
      dotenv.config({ path: candidatePath, override: true })
      envLoaded = true
      return
    }
  }
  envLoaded = true
}

export async function connectToDatabase() {
  ensureEnvLoaded()
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('Missing MONGODB_URI in environment. Please add MONGODB_URI to your .env.local file.')
    }
    
    // Validate connection string format
    const trimmedUri = uri.trim()
    
    // Remove any quotes that might be around the URI
    let cleanUri = trimmedUri.replace(/^["']|["']$/g, '')

    // Fallback to .env.local if the environment variable was left at the default placeholder
    if (cleanUri.includes('your-mongodb-connection-string')) {
      const tryReadEnv = () => {
        const candidates = [
          path.join(process.cwd(), '.env.local'),
          path.join(process.cwd(), '..', '.env.local'),
          path.join(process.cwd(), '..', '..', '.env.local'),
        ]

        for (const candidatePath of candidates) {
          if (fs.existsSync(candidatePath)) {
            try {
              const envContents = fs.readFileSync(candidatePath, 'utf8')
              const match = envContents.match(/^MONGODB_URI=(.*)$/m)
              if (match) {
                const raw = match[1]?.trim()
                if (raw) {
                  const extracted = raw.replace(/^["']|["']$/g, '')
                  if (extracted && !extracted.includes('your-mongodb-connection-string')) {
                    return extracted
                  }
                }
              }
            } catch (readError) {
              console.warn(`MONGODB_URI fallback: unable to read ${candidatePath}`, readError)
            }
          }
        }
        return null
      }

      const envUri = tryReadEnv()
      if (envUri) {
        cleanUri = envUri
        process.env.MONGODB_URI = envUri
      }
    }

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


