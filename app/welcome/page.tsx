'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Sparkles, Crown, Gift, Home } from 'lucide-react'

const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const AUTH_STORAGE_KEY = 'worldclass_signed_in'

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [firstName, setFirstName] = useState('Customer')
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Check if user is signed in
    if (typeof window !== 'undefined') {
      const isSignedIn = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
      if (!isSignedIn) {
        // Not signed in, redirect to login
        router.replace('/login')
        return
      }

      // Get user profile
      try {
        const profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY)
        if (profileRaw) {
          const profile = JSON.parse(profileRaw)
          const name = profile?.name || 'Customer'
          // Extract first name
          const first = name.split(' ')[0] || name
          setFirstName(first)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
      setLoading(false)

      // Auto-redirect after 3 seconds
      const redirectUrl = searchParams.get('redirect') || '/'
      const timer = setTimeout(() => {
        setRedirecting(true)
        router.replace(redirectUrl)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-lightest">
        <div className="w-12 h-12 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
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

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg"
          >
            <CheckCircle className="text-white" size={40} />
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
              Welcome, {firstName}! 👋
            </h1>
            <p className="text-lg text-ocean-gray mb-8">
              You've successfully signed in. We're excited to have you back!
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: Crown, text: 'Premium Shopping', color: 'from-premium-gold to-premium-amber' },
              { icon: Sparkles, text: 'Exclusive Deals', color: 'from-blue-500 to-blue-600' },
              { icon: Gift, text: 'Fast Delivery', color: 'from-green-500 to-green-600' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 bg-gradient-to-br from-ocean-lightest to-white rounded-xl border border-ocean-border"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-full mb-3`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <p className="text-sm font-semibold text-ocean-darkGray">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition hover:scale-105"
            >
              <Home size={20} />
              Go to Homepage
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-premium-gold text-premium-gold rounded-lg font-bold text-lg hover:bg-premium-gold/10 transition hover:scale-105"
            >
              View Account
            </Link>
          </motion.div>

          {/* Auto-redirect notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-sm text-ocean-gray"
          >
            {redirecting ? 'Redirecting...' : 'Redirecting to homepage in a few seconds...'}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

