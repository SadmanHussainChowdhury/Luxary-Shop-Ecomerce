'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import { trackActivity } from '@/lib/activity-tracker'

const AUTH_STORAGE_KEY = 'worldclass_signed_in'
const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const USERS_STORAGE_KEY = 'worldclass_users_v1'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Password validation
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

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
    
    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase || !passwordChecks.number) {
      setError('Password does not meet requirements')
      toast.error('Password does not meet requirements')
      setLoading(false)
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    try {
      // Register user in MongoDB
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password: password,
          phone: '', // Phone can be added later in account settings
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError('An account with this email already exists. Please sign in instead.')
          toast.error('Account already exists. Please sign in.')
        } else {
          setError(data.error || 'Registration failed. Please try again.')
          toast.error(data.error || 'Registration failed')
        }
        setLoading(false)
        return
      }

      // Registration successful - store user session locally
      setSuccess(true)
      toast.success('Account created! Welcome aboard!')

      const callbackUrl = searchParams.get('callbackUrl') || '/'
      
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

        localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        const profile = {
          name: data.name || name,
          email: data.email || normalizedEmail,
          phone: '',
          newsletter: true,
          smsAlerts: false,
        }
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
        
        // Track sign-in activity after registration
        trackActivity('sign_in', {
          page: callbackUrl,
          email: normalizedEmail,
        })
      }

      setTimeout(() => {
        router.replace(callbackUrl)
      }, 1000)
    } catch (err: any) {
      console.error('Registration error:', err)
      setError('Registration failed. Please try again.')
      toast.error('Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-premium-darkBlue via-premium-royalBlue to-premium-electricBlue">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-premium-gold/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-premium-amber/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 30, 0],
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
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/90">Join us and start shopping premium</p>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2"
              >
                <Check className="text-green-600" size={20} />
                Account created! Redirecting...
              </motion.div>
            )}

            <div className="space-y-5">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
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
                transition={{ delay: 0.5 }}
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
                    placeholder="Create a strong password"
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
                
                {/* Password Requirements */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2 text-xs"
                  >
                    <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-ocean-gray'}`}>
                      <Check size={14} className={passwordChecks.length ? '' : 'opacity-0'} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-ocean-gray'}`}>
                      <Check size={14} className={passwordChecks.uppercase ? '' : 'opacity-0'} />
                      One uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-600' : 'text-ocean-gray'}`}>
                      <Check size={14} className={passwordChecks.lowercase ? '' : 'opacity-0'} />
                      One lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-ocean-gray'}`}>
                      <Check size={14} className={passwordChecks.number ? '' : 'opacity-0'} />
                      One number
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-2 text-sm text-ocean-gray"
            >
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-ocean-border text-premium-gold focus:ring-premium-gold"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-premium-gold hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-premium-gold hover:underline font-medium">
                  Privacy Policy
                </Link>
              </span>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || success}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : success ? (
                  <>
                    <Check size={20} />
                    Account Created!
                  </>
                ) : (
                  <>
                    Create Account
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
                <span className="px-4 bg-white text-ocean-gray">Or sign up with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="text-center text-sm text-ocean-gray">
              Social sign-up is currently disabled.
            </div>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-ocean-gray pt-4 border-t border-ocean-border"
            >
              Already have an account?{' '}
              <Link href="/login" className="text-premium-gold hover:text-premium-amber font-bold hover:underline transition">
                Sign in →
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}


