'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const ADMIN_STORAGE_KEY = 'worldclass_admin_signed_in'
const ADMIN_PROFILE_KEY = 'worldclass_admin_profile_v1'
const USERS_STORAGE_KEY = 'worldclass_users_v1'

const DEFAULT_ADMIN = {
  name: 'Store Admin',
  email: 'admin@luxuryshop.com',
  password: 'Admin@123',
  role: 'admin' as const,
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const usersRaw = localStorage.getItem(USERS_STORAGE_KEY)
    let users: Array<{ name: string; email: string; password: string; role?: string }> = []
    if (usersRaw) {
      try {
        users = JSON.parse(usersRaw)
      } catch (error) {
        users = []
      }
    }

    if (!users.some((user) => user.role === 'admin')) {
      users.push(DEFAULT_ADMIN)
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }

    const alreadySignedIn = localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
    if (alreadySignedIn) {
      router.replace('/admin')
    }
  }, [router])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      const usersRaw = localStorage.getItem(USERS_STORAGE_KEY)
      let users: Array<{ name: string; email: string; password: string; role?: string }> = []
      if (usersRaw) {
        try {
          users = JSON.parse(usersRaw)
        } catch (error) {
          users = []
        }
      }

      const normalizedEmail = email.trim().toLowerCase()
      const adminUser = users.find(
        (user) => user.role === 'admin' && user.email.trim().toLowerCase() === normalizedEmail
      )

      if (!adminUser) {
        toast.error('No admin account found for that email.')
        setLoading(false)
        return
      }

      if (adminUser.password !== password) {
        toast.error('Incorrect password. Please try again.')
        setLoading(false)
        return
      }

      localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
      localStorage.setItem(
        ADMIN_PROFILE_KEY,
        JSON.stringify({
          name: adminUser.name || 'Store Admin',
          email: adminUser.email,
        })
      )

      toast.success(`Welcome back, ${adminUser.name?.split(' ')[0] || 'Admin'}!`)
      setLoading(false)
      router.replace('/admin')
    }, 500)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <Shield className="text-white" size={34} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Sign In</h1>
            <p className="text-white/85 flex items-center justify-center gap-2">
              <Sparkles size={18} /> Secure access for store management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="admin@luxuryshop.com"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-ocean-border bg-white/60 focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="Enter admin password"
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-ocean-border bg-white/60 focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-gray hover:text-premium-gold transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-ocean-gray">
                  Default credentials: <code>{DEFAULT_ADMIN.email}</code> / <code>{DEFAULT_ADMIN.password}</code>
                </p>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Access Admin Panel
                    <ArrowRight size={20} />
                  </>
                )}
              </span>
            </motion.button>

            <div className="text-center text-sm text-ocean-gray">
              <Link href="/" className="text-premium-gold hover:text-premium-amber font-semibold transition">
                ← Back to storefront
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
