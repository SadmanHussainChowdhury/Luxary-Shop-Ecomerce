// Email Service using Nodemailer
// For production, configure SMTP settings in .env.local

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  // Check if email is configured
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const fromEmail = process.env.SMTP_FROM || smtpUser || 'noreply@luxuryshop.com'

  console.log('📧 Email configuration check:')
  console.log('  - SMTP_HOST:', smtpHost ? '✓ Set' : '✗ Not set')
  console.log('  - SMTP_PORT:', smtpPort ? '✓ Set' : '✗ Not set')
  console.log('  - SMTP_USER:', smtpUser ? '✓ Set' : '✗ Not set')
  console.log('  - SMTP_PASSWORD:', smtpPassword ? '✓ Set' : '✗ Not set')

  // If SMTP is not configured, use a mock service for development
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.log('📧 [MOCK EMAIL] To:', to)
    console.log('📧 [MOCK EMAIL] Subject:', subject)
    console.log('📧 [MOCK EMAIL] Body:', text || html)
    console.log('⚠️  SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD in .env.local')
    console.log('📧 [MOCK EMAIL] Full HTML:', html.substring(0, 200) + '...')
    
    // In development, simulate success but log the code
    if (process.env.NODE_ENV === 'development') {
      // Extract code from HTML for easy viewing
      const codeMatch = html.match(/>(\d{6})</)
      if (codeMatch) {
        console.log('📧 [MOCK EMAIL] RESET CODE:', codeMatch[1])
      }
      return { success: true }
    }
    
    return { success: false, error: 'Email service not configured. Please configure SMTP settings in .env.local' }
  }

  try {
    // Use require to avoid webpack warnings about dynamic imports
    // This is safe because we're in a try-catch and checking for the module
    let nodemailer: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      nodemailer = require('nodemailer')
    } catch (requireError: any) {
      if (requireError.code === 'MODULE_NOT_FOUND') {
        console.error('❌ Nodemailer package not installed. Run: npm install nodemailer')
        return { success: false, error: 'Nodemailer package not installed. Install with: npm install nodemailer' }
      }
      throw requireError
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    const info = await transporter.sendMail({
      from: `"Luxury Shop" <${fromEmail}>`,
      to: to,
      subject: subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      html: html,
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true }
  } catch (error: any) {
    // If it's a module not found error, provide helpful message
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module') || error.message?.includes('nodemailer')) {
      console.error('❌ Nodemailer package not installed. Run: npm install nodemailer')
      return { success: false, error: 'Nodemailer package not installed. Please install it: npm install nodemailer' }
    }
    console.error('❌ Failed to send email:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

// Generate HTML email template for password reset
export function generatePasswordResetEmail(code: string, name?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Luxury Shop</h1>
        <p style="color: white; margin: 10px 0 0 0;">Password Reset Request</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333; margin-top: 0;">Hello${name ? ` ${name}` : ''},</h2>
        
        <p>You requested to reset your password. Use the code below to reset your password:</p>
        
        <div style="background: white; border: 2px solid #FFD700; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333; font-family: monospace;">
            ${code}
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This code will expire in <strong>1 hour</strong>. If you didn't request this, please ignore this email.
        </p>
        
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password" 
             style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; margin: 0;">
          If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password" style="color: #FFD700;">
            ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password
          </a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Luxury Shop. All rights reserved.</p>
        <p>This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>
  `
}

