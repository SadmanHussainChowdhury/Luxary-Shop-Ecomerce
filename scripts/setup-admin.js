// Admin Setup Script
// Run with: node scripts/setup-admin.js

require('dotenv').config({ path: '.env.local' })

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupAdmin() {
  console.log('\n===========================================')
  console.log('Admin User Setup')
  console.log('===========================================\n')

  try {
    // Test connection first
    console.log('Testing MongoDB connection...')
    const mongoose = require('mongoose')
    const uri = process.env.MONGODB_URI

    if (!uri) {
      console.error('❌ MONGODB_URI not found in .env.local')
      process.exit(1)
    }

    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || undefined,
    })
    console.log('✓ MongoDB connected successfully!\n')

    // Check if admin exists
    const { User } = require('../models/User')
    const existingAdmin = await User.findOne({ role: 'admin' })

    if (existingAdmin) {
      console.log('⚠ Admin user already exists!')
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Name: ${existingAdmin.name}`)
      const overwrite = await question('\nDo you want to update the password? (y/n): ')
      
      if (overwrite.toLowerCase() === 'y') {
        const password = await question('Enter new password: ')
        const bcrypt = require('bcryptjs')
        const passwordHash = await bcrypt.hash(password, 10)
        existingAdmin.passwordHash = passwordHash
        await existingAdmin.save()
        console.log('✓ Admin password updated!')
      } else {
        console.log('Setup cancelled.')
      }
      await mongoose.disconnect()
      process.exit(0)
    }

    // Create new admin
    console.log('Creating new admin user...\n')
    const name = await question('Enter admin name: ')
    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password: ')

    if (!name || !email || !password) {
      console.error('❌ All fields are required!')
      process.exit(1)
    }

    const bcrypt = require('bcryptjs')
    const passwordHash = await bcrypt.hash(password, 10)

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
    })

    console.log('\n✅ Admin user created successfully!')
    console.log(`   ID: ${admin._id}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Role: ${admin.role}`)
    console.log('\nYou can now login to the admin panel at: http://localhost:3000/admin')

    await mongoose.disconnect()
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your MongoDB username and password')
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('💡 Add your IP to MongoDB Atlas Network Access')
    }
    process.exit(1)
  } finally {
    rl.close()
  }
}

setupAdmin()

