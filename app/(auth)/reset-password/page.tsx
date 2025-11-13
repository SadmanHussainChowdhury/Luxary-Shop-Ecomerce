'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Password validation
  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  }

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase || !passwordChecks.number) {
      setError('Password does not meet requirements')
      toast.error('Password does not meet requirements')
      setLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const token = searchParams.get('token') || code
      
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          code: code || undefined,
          newPassword: newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        toast.error(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('Password reset successfully!')
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError('Failed to reset password. Please try again.')
      toast.error('Failed to reset password')
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
              <CheckCircle className="text-white" size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-ocean-darkGray mb-4">Password Reset Successful!</h1>
            <p className="text-ocean-gray mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Go to Login
              <ArrowRight size={18} />
            </Link>
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
              <Lock className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/90">Enter your reset code and new password</p>
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

            {/* Reset Code Input */}
            {!searchParams.get('token') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Reset Code
                </label>
                <div className="relative">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    required={!searchParams.get('token')}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition text-center text-2xl tracking-widest font-mono"
                  />
                </div>
                <p className="mt-2 text-xs text-ocean-gray">
                  Enter the 6-digit code sent to your phone or email
                </p>
              </motion.div>
            )}

            {/* New Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter new password"
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
              <div className="mt-2 space-y-1 text-xs">
                <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-ocean-gray'}`}>
                  <span>{passwordChecks.length ? '✓' : '○'}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-ocean-gray'}`}>
                  <span>{passwordChecks.uppercase ? '✓' : '○'}</span>
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-600' : 'text-ocean-gray'}`}>
                  <span>{passwordChecks.lowercase ? '✓' : '○'}</span>
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-ocean-gray'}`}>
                  <span>{passwordChecks.number ? '✓' : '○'}</span>
                  <span>One number</span>
                </div>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm new password"
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-ocean-border bg-white/50 backdrop-blur-sm focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-gray hover:text-premium-gold transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className={`mt-2 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !passwordsMatch || !passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase || !passwordChecks.number}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={20} />
                  </>
                )}
              </span>
            </motion.button>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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

