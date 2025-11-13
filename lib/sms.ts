// SMS Service using Twilio
// For production, you'll need to set up Twilio account and add credentials to .env.local
// Note: Twilio package is optional - install with: npm install twilio

interface SendSMSOptions {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SendSMSOptions): Promise<{ success: boolean; error?: string }> {
  // Check if Twilio is configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  // If Twilio is not configured, use a mock service for development
  if (!accountSid || !authToken || !fromNumber) {
    console.log('📱 [MOCK SMS] To:', to)
    console.log('📱 [MOCK SMS] Message:', message)
    console.log('⚠️  Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env.local')
    
    // In development, simulate success
    if (process.env.NODE_ENV === 'development') {
      return { success: true }
    }
    
    return { success: false, error: 'SMS service not configured' }
  }

  try {
    // Use require to avoid webpack warnings about dynamic imports
    // This is safe because we're in a try-catch and checking for the module
    let twilio: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      twilio = require('twilio')
    } catch (requireError: any) {
      if (requireError.code === 'MODULE_NOT_FOUND') {
        console.error('❌ Twilio package not installed. Run: npm install twilio')
        return { success: false, error: 'Twilio package not installed. Install with: npm install twilio' }
      }
      throw requireError
    }

    const client = twilio(accountSid, authToken)

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    })

    console.log('✅ SMS sent successfully:', result.sid)
    return { success: true }
  } catch (error: any) {
    // If it's a module not found error, provide helpful message
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module') || error.message?.includes('twilio')) {
      console.error('❌ Twilio package not installed. Run: npm install twilio')
      return { success: false, error: 'Twilio package not installed. Please install it: npm install twilio' }
    }
    console.error('❌ Failed to send SMS:', error)
    return { success: false, error: error.message || 'Failed to send SMS' }
  }
}

// Format phone number to E.164 format (required by Twilio)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  
  // If it starts with 0, remove it (common in some countries)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  
  // If it doesn't start with +, add country code (default to +1 for US)
  if (!phone.startsWith('+')) {
    // If it's 10 digits, assume US number
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned
    } else {
      // For other formats, try to detect country code
      // This is a simple implementation - you may want to use a library like libphonenumber
      cleaned = '+' + cleaned
    }
  } else {
    cleaned = phone.replace(/\D/g, '')
    cleaned = '+' + cleaned
  }
  
  return cleaned
}

