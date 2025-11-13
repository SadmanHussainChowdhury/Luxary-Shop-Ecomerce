import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { sendSMS, formatPhoneNumber } from '@/lib/sms'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await req.json().catch(() => null)
    if (!body?.to || !body?.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { to, message } = body
    const formattedPhone = formatPhoneNumber(to)
    
    const result = await sendSMS({
      to: formattedPhone,
      message: message,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send SMS' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'SMS sent successfully' })
  } catch (error: any) {
    if (error.message?.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Send SMS error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    )
  }
}

