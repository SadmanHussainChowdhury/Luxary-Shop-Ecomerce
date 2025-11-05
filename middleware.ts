import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // If no token, redirect to login with callback URL
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // Check if user has admin role
  const userRole = (token as any).role || 'user'
  if (userRole !== 'admin') {
    // User is authenticated but not an admin - redirect to home
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // User is authenticated and is an admin - allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


