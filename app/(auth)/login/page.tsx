'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { trackActivity } from '@/lib/activity-tracker'

const AUTH_STORAGE_KEY = 'worldclass_signed_in'
const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const USERS_STORAGE_KEY = 'worldclass_users_v1'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for OAuth error
    const error = searchParams.get('error')
    if (error === 'OAuthAccountNotLinked') {
      setError('This account is already linked to another email. Please sign in with your original method.')
      toast.error('Account already exists with different sign-in method')
    } else if (error) {
      setError('Authentication failed. Please try again.')
      toast.error('Authentication failed')
    }
  }, [searchParams])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const normalizedEmail = email.trim().toLowerCase()

    try {
      // Authenticate against MongoDB
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password')
        toast.error(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Login successful - store user session locally
      if (typeof window !== 'undefined') {
        // Check if switching users - clear previous user's data if different email
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
        let previousEmail = ''
        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile)
            previousEmail = parsed?.email || ''
          } catch (error) {
            // Ignore parse errors
          }
        }

        // If switching to a different user, clear previous user's data
        if (previousEmail && previousEmail.toLowerCase() !== normalizedEmail) {
          // Clear previous user's activity cache
          const prevActivityKey = `worldclass_customer_activity_${previousEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
          localStorage.removeItem(prevActivityKey)
          
          // Clear previous user's orders
          const prevOrdersKey = `worldclass_orders_${previousEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
          localStorage.removeItem(prevOrdersKey)
        }

        const profileName = data.name || normalizedEmail.split('@')[0] || 'Valued Customer'
        let existingProfileData: Record<string, any> = {}
        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile)
            if (parsed?.email === normalizedEmail) {
              existingProfileData = parsed
            }
          } catch (error) {
            existingProfileData = {}
          }
        }

        const updatedProfile = {
          ...existingProfileData,
          name: profileName,
          email: data.email || normalizedEmail,
          phone: existingProfileData.phone || '',
          newsletter: existingProfileData.newsletter ?? true,
          smsAlerts: existingProfileData.smsAlerts ?? false,
        }

        localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile))

        // Track sign-in activity
        trackActivity('sign_in', {
          page: callbackUrl,
          email: normalizedEmail,
        })
      }

      toast.success(`Welcome back, ${data.name?.split(' ')[0] || 'Customer'}!`)
      setLoading(false)
      router.replace(callbackUrl)
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
      toast.error('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-premium-darkBlue via-premium-royalBlue to-premium-electricBlue">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-premium-gold/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-premium-amber/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <Sparkles className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/90">Sign in to your account</p>
          </div>

          <form onSubmit={onSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2"
              >
                <span>⚠</span> {error}
              </motion.div>
            )}

            <div className="space-y-5">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-gray hover:text-premium-gold transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-ocean-border text-premium-gold focus:ring-premium-gold" />
                    <span className="text-ocean-gray">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-premium-gold hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-premium-amber via-premium-gold to-premium-amber"
                initial={{ x: '-100%' }}
                animate={{ x: loading ? '200%' : '-100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ocean-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-ocean-gray">Or continue with</span>
              </div>
            </div>

            <div className="text-center text-sm text-ocean-gray">
              Social sign-in is currently disabled.
            </div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-ocean-gray pt-4 border-t border-ocean-border"
            >
              New here?{' '}
              <Link href="/register" className="text-premium-gold hover:text-premium-amber font-bold hover:underline transition">
                Create an account →
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}


