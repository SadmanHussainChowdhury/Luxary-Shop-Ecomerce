// Direct MongoDB connection test script
// Run with: node scripts/test-mongodb.js

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI

console.log('\n===========================================')
console.log('MongoDB Connection Test')
console.log('===========================================\n')

if (!uri) {
  console.error('❌ MONGODB_URI is not set in .env.local')
  process.exit(1)
}

console.log('✓ MONGODB_URI found')
console.log(`  First 50 chars: ${uri.substring(0, 50)}...\n`)

if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  console.error('❌ Invalid connection string format')
  console.error(`   Got: ${uri.substring(0, 50)}...`)
  process.exit(1)
}

console.log('✓ Connection string format is correct')
console.log('Attempting connection...\n')

mongoose
  .connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully!')
    console.log(`   Database: ${mongoose.connection.db.databaseName}`)
    console.log(`   Host: ${mongoose.connection.host}`)
    console.log(`   Port: ${mongoose.connection.port}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Connection failed!')
    console.error(`   Error: ${error.message}\n`)
    
    if (error.message.includes('authentication failed')) {
      console.error('💡 Hint: Check your username and password')
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('💡 Hint: Add your IP to MongoDB Atlas Network Access')
      console.error('   Go to: https://cloud.mongodb.com → Network Access')
      console.error('   Add IP: 0.0.0.0/0 (or your current IP)')
    } else if (error.message.includes('timeout')) {
      console.error('💡 Hint: Check your internet connection')
    }
    
    process.exit(1)
  })

