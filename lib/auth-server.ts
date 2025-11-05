import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/admin')
  }
  
  const userRole = (session.user as any).role || 'user'
  if (userRole !== 'admin') {
    redirect('/')
  }
  
  return session
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

