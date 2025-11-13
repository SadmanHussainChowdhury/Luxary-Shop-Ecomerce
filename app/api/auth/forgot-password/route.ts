import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import { sendSMS, formatPhoneNumber } from '@/lib/sms'
import { sendEmail, generatePasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { email, phone } = body

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 })
    }

    await connectToDatabase()

    // Find user by email or phone
    let user
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() })
    } else if (phone) {
      // Format phone number for search
      const formattedPhone = formatPhoneNumber(phone)
      user = await User.findOne({ phone: formattedPhone })
      
      // Also try without formatting in case it's stored differently
      if (!user) {
        user = await User.findOne({ phone: phone })
      }
    }

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        message: 'If an account exists with that email/phone, a reset code has been sent.' 
      })
    }

    // Generate 6-digit reset code
    const resetCode = crypto.randomInt(100000, 999999).toString()
    
    // Generate token for email reset (if using email)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset code and token in user document
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    
    // Store reset code temporarily (in production, you might want to use Redis)
    // For now, we'll encode it in the token
    const codeHash = crypto.createHash('sha256').update(resetCode).digest('hex')
    user.resetPasswordToken = `${resetToken}:${codeHash}`
    
    await user.save()

    // Send SMS if phone is provided
    if (phone && user.phone) {
      const formattedPhone = formatPhoneNumber(phone)
      const message = `Your password reset code is: ${resetCode}. This code expires in 1 hour. Do not share this code with anyone.`
      
      const smsResult = await sendSMS({
        to: formattedPhone,
        message: message,
      })

      if (!smsResult.success) {
        console.error('Failed to send SMS:', smsResult.error)
        // Still return success to not reveal if user exists
        return NextResponse.json({ 
          message: 'If an account exists with that phone number, a reset code has been sent.' 
        })
      }
    }

    // Send email if email is provided
    let emailSent = false
    let emailError: string | undefined = undefined
    
    if (email && user.email) {
      const emailHtml = generatePasswordResetEmail(resetCode, user.name)
      
      console.log('📧 Attempting to send email to:', user.email)
      console.log('📧 Reset code:', resetCode)
      
      const emailResult = await sendEmail({
        to: user.email,
        subject: 'Password Reset Code - Luxury Shop',
        html: emailHtml,
        text: `Your password reset code is: ${resetCode}. This code expires in 1 hour. Visit ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password to reset your password.`,
      })

      console.log('📧 Email send result:', emailResult)

      if (emailResult.success) {
        emailSent = true
        console.log('✅ Email sent successfully to:', user.email)
      } else {
        emailError = emailResult.error
        console.error('❌ Failed to send email:', emailResult.error)
      }
    }

    // Return success (don't reveal if user exists)
    const response: any = { 
      message: 'If an account exists with that email/phone, a reset code has been sent.'
    }
    
    // In development, always include the code for testing
    if (process.env.NODE_ENV === 'development') {
      response.devCode = resetCode
      response.devToken = resetToken
      if (emailError) {
        response.error = emailError
        response.devMessage = 'Email not configured. Check server console for the reset code.'
      } else if (emailSent) {
        response.devMessage = 'Email sent successfully. Also check server console for the code.'
      } else {
        response.devMessage = 'Check server console for the reset code.'
      }
    }
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Forgot password API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

