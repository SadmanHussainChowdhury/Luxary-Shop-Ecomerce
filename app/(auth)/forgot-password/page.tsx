'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [usePhone, setUsePhone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usePhone ? undefined : email.trim().toLowerCase(),
          phone: usePhone ? phone.trim() : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send reset code')
        toast.error(data.error || 'Failed to send reset code')
        setLoading(false)
        return
      }

      // In development, show the code if provided
      if (data.devCode) {
        console.log('🔑 [DEV] Password Reset Code:', data.devCode)
        console.log('🔑 [DEV] Reset Token:', data.devToken)
        if (data.error) {
          toast.warning(`Email not configured. DEV CODE: ${data.devCode} (Check server console)`, { duration: 15000 })
        } else {
          toast.success(`Reset code sent! Check your ${usePhone ? 'phone' : 'email'}. DEV CODE: ${data.devCode}`, { duration: 10000 })
        }
      } else {
        toast.success(usePhone ? 'SMS sent! Check your phone for the reset code.' : 'Reset code sent! Check your email.')
      }
      
      // Log any error messages
      if (data.error) {
        console.error('Email error:', data.error)
      }

      setSuccess(true)
    } catch (err: any) {
      console.error('Forgot password error:', err)
      setError('Failed to send reset code. Please try again.')
      toast.error('Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden">
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
        </div>

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4"
            >
              <Sparkles className="text-white" size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-ocean-darkGray mb-4">Reset Code Sent!</h1>
            <p className="text-ocean-gray mb-6">
              {usePhone
                ? 'We\'ve sent a password reset code to your phone via SMS. Please check your messages and use the code to reset your password.'
                : 'We\'ve sent a password reset code to your email. Please check your inbox and use the code to reset your password.'}
            </p>
            <Link
              href="/reset-password"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Continue to Reset Password
              <ArrowRight size={18} />
            </Link>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-ocean-gray hover:text-premium-gold transition"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-white/90">We'll send you a reset code</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Toggle between Email and Phone */}
            <div className="flex gap-2 p-1 bg-ocean-lightest rounded-lg">
              <button
                type="button"
                onClick={() => setUsePhone(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  !usePhone
                    ? 'bg-white text-premium-gold shadow-sm'
                    : 'text-ocean-gray hover:text-ocean-darkGray'
                }`}
              >
                <Mail size={16} className="inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setUsePhone(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  usePhone
                    ? 'bg-white text-premium-gold shadow-sm'
                    : 'text-ocean-gray hover:text-ocean-darkGray'
                }`}
              >
                <Phone size={16} className="inline mr-2" />
                SMS
              </button>
            </div>

            {!usePhone ? (
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
                    required={!usePhone}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    required={usePhone}
                    placeholder="+1234567890"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
                <p className="mt-2 text-xs text-ocean-gray">
                  Enter your phone number to receive a reset code via SMS
                </p>
              </motion.div>
            )}

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
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Code
                    <ArrowRight size={20} />
                  </>
                )}
              </span>
            </motion.button>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-ocean-gray pt-4 border-t border-ocean-border"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-premium-gold hover:text-premium-amber font-bold hover:underline transition"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
