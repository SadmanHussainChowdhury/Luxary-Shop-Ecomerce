import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as Session | null
  const user = session?.user as (Session['user'] & { id?: string }) | undefined

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id

  await connectToDatabase()

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ items: orders })
}

