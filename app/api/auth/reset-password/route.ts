import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.newPassword || (!body?.token && !body?.code)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { token, code, newPassword } = body

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json({ 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      }, { status: 400 })
    }

    await connectToDatabase()

    let user

    if (token) {
      // Reset using token (from email link)
      const [resetToken, codeHash] = token.includes(':') ? token.split(':') : [token, null]
      
      user = await User.findOne({
        resetPasswordToken: { $regex: `^${resetToken}` },
        resetPasswordExpires: { $gt: new Date() },
      })

      if (!user) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
      }

      // If code is also provided, verify it
      if (code && codeHash) {
        const providedCodeHash = crypto.createHash('sha256').update(code).digest('hex')
        if (providedCodeHash !== codeHash) {
          return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 })
        }
      }
    } else if (code) {
      // Reset using code only (from SMS or email code)
      // Find user with matching code hash in token
      const codeHash = crypto.createHash('sha256').update(code).digest('hex')
      
      // Search for users with reset tokens that end with the code hash
      const users = await User.find({
        resetPasswordToken: { $exists: true, $ne: null },
        resetPasswordExpires: { $gt: new Date() },
      }).lean()

      // Find user with matching code hash
      user = users.find((u: any) => {
        if (!u.resetPasswordToken) return false
        const tokenParts = u.resetPasswordToken.split(':')
        return tokenParts.length === 2 && tokenParts[1] === codeHash
      })

      if (!user) {
        return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 })
      }

      // Convert back to Mongoose document for saving
      user = await User.findById(user._id)
    } else {
      return NextResponse.json({ error: 'Token or code is required' }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update user password and clear reset token
    user.passwordHash = passwordHash
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json({ 
      message: 'Password reset successfully',
      success: true 
    })
  } catch (error: any) {
    console.error('Reset password API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

