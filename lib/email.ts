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

  // If SMTP is not configured, use a mock service for development
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.log('📧 [MOCK EMAIL] To:', to)
    console.log('📧 [MOCK EMAIL] Subject:', subject)
    console.log('📧 [MOCK EMAIL] HTML:', html.substring(0, 100) + '...')
    console.log('⚠️  SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD in .env.local')
    
    // In development, simulate success
    if (process.env.NODE_ENV === 'development') {
      return { success: true }
    }
    
    return { success: false, error: 'Email service not configured' }
  }

  try {
    // Use require to avoid webpack warnings about dynamic imports
    let nodemailer: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      nodemailer = require('nodemailer')
    } catch (requireError: any) {
      if (requireError.code === 'MODULE_NOT_FOUND') {
        console.error('❌ Nodemailer package not installed. Run: npm install nodemailer')
        return { success: false, error: 'Nodemailer package not installed' }
      }
      throw requireError
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    const info = await transporter.sendMail({
      from: `"Luxury Shop" <${fromEmail}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      html,
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true }
  } catch (error: any) {
    console.error('❌ Failed to send email:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (order: any) => ({
    subject: `Order Confirmation #${order._id?.slice(-8) || 'N/A'}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 24px; font-weight: bold; color: #667eea; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
              <p>Thank you for your purchase</p>
            </div>
            <div class="content">
              <p>Hello ${order.customer?.name || 'Customer'},</p>
              <p>Your order has been confirmed and we're preparing it for shipment.</p>
              
              <div class="order-info">
                <h2>Order Details</h2>
                <p><strong>Order #:</strong> ${order._id?.slice(-8) || 'N/A'}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                
                <h3>Items:</h3>
                ${order.items?.map((item: any) => `
                  <div class="item">
                    <strong>${item.title}</strong> - Qty: ${item.quantity} × $${item.price.toFixed(2)}
                  </div>
                `).join('')}
                
                <div class="total">Total: $${order.total?.toFixed(2) || '0.00'}</div>
              </div>
              
              <p>You can track your order status at any time by visiting your account.</p>
              <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders" class="button">View Order</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  orderShipped: (order: any, trackingNumber?: string) => ({
    subject: `Your Order #${order._id?.slice(-8) || 'N/A'} Has Shipped!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .tracking { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .tracking-number { font-size: 24px; font-weight: bold; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 Your Order Has Shipped!</h1>
            </div>
            <div class="content">
              <p>Hello ${order.customer?.name || 'Customer'},</p>
              <p>Great news! Your order has been shipped and is on its way to you.</p>
              
              ${trackingNumber ? `
                <div class="tracking">
                  <p><strong>Tracking Number:</strong></p>
                  <div class="tracking-number">${trackingNumber}</div>
                </div>
              ` : ''}
              
              <p>You can track your order status at any time by visiting your account.</p>
              <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders" class="button" style="display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Track Order</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  orderDelivered: (order: any) => ({
    subject: `Your Order #${order._id?.slice(-8) || 'N/A'} Has Been Delivered!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Delivered!</h1>
            </div>
            <div class="content">
              <p>Hello ${order.customer?.name || 'Customer'},</p>
              <p>Your order has been successfully delivered!</p>
              <p>We hope you love your purchase. If you have any questions or concerns, please don't hesitate to contact us.</p>
              <p>We'd love to hear your feedback! Please consider leaving a review for your purchased items.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (resetToken: string, userName?: string) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}" class="button">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                If you didn't request this, please ignore this email. This link will expire in 1 hour.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

// Helper function to generate password reset email
export function generatePasswordResetEmail(resetToken: string, userName?: string) {
  return emailTemplates.passwordReset(resetToken, userName)
}
