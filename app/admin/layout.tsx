'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingCart, Home, Settings, BarChart3, Users, Bell, LogOut, Shield, Grid, FileText } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Grid },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }
    
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(pathname || '/admin'))
      return
    }
    
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role || 'user'
      if (userRole !== 'admin') {
        router.push('/')
        return
      }
      setIsLoading(false)
    }
  }, [status, session, router, pathname])
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }
  
  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-ocean-lightest flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-premium-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ocean-gray">Loading admin panel...</p>
        </div>
      </div>
    )
  }
  
  if (!session || (session.user as any)?.role !== 'admin') {
    return null // Will redirect via useEffect
  }
  
  return (
    <div className="relative min-h-screen bg-ocean-lightest">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <motion.div
                  className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-premium-gold/10 to-premium-amber/10 border border-premium-gold/30 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield size={16} className="text-premium-gold" />
                  <span className="text-xs font-bold text-premium-gold">ADMIN</span>
                </motion.div>
              </div>
              <p className="text-ocean-gray mt-1">
                Welcome, {session.user?.name || session.user?.email} • Manage your e-commerce store
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition font-medium"
              >
                <Home size={18} />
                Back to Store
              </Link>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-2 border-t border-ocean-border pt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-premium-gold to-premium-amber text-white'
                      : 'text-ocean-darkGray hover:bg-ocean-lightest'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-premium-gold to-premium-amber rounded-lg -z-10"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}


