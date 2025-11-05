import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        await connectToDatabase()
        const user = await User.findOne({ email: credentials.email })
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins
      if (account?.provider === 'google' || account?.provider === 'github') {
        await connectToDatabase()
        const existingUser = await User.findOne({ email: user.email })
        
        if (existingUser) {
          // Update user with OAuth account info if needed
          if (!existingUser.oauthAccounts?.some((acc: any) => acc.provider === account.provider)) {
            await User.findByIdAndUpdate(existingUser._id, {
              $push: {
                oauthAccounts: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            })
          }
          return true
        }
        
        // Create new user from OAuth
        const newUser = await User.create({
          name: user.name || user.email?.split('@')[0],
          email: user.email,
          oauthAccounts: [
            {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          ],
          role: 'user',
        })
        user.id = newUser._id.toString()
        return true
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role || 'user'
        
        // For OAuth, fetch user role from database
        if (account?.provider === 'google' || account?.provider === 'github') {
          await connectToDatabase()
          const dbUser = await User.findOne({ email: user.email })
          if (dbUser) {
            token.id = dbUser._id.toString()
            token.role = dbUser.role || 'user'
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
}

// Note: v4 uses API route handlers; no `auth` export here.


