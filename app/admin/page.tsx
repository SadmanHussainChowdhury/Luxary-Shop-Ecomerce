'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Settings, BarChart3, Users, FileText, Bell, RefreshCw } from 'lucide-react'
import AdminStats from '@/components/AdminStats'

export default function AdminHomePage() {
  const [quickLinks, setQuickLinks] = useState([
    {
      title: 'Products',
      description: 'Manage inventory and product catalog',
      href: '/admin/products',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      stats: 'Loading...',
    },
    {
      title: 'Orders',
      description: 'View and process customer orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      stats: 'Loading...',
    },
    {
      title: 'Analytics',
      description: 'Sales reports and insights',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'from-premium-gold to-premium-amber',
      stats: 'View reports',
    },
    {
      title: 'Users',
      description: 'Manage customer accounts',
      href: '/admin/users',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      stats: 'Loading...',
    },
    {
      title: 'Settings',
      description: 'Configure store settings',
      href: '/admin/settings',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      stats: 'Configure',
    },
  ])

  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/stats', { cache: 'no-store' })
      const data = await res.json()

      if (data.stats) {
        setQuickLinks([
          {
            title: 'Products',
            description: 'Manage inventory and product catalog',
            href: '/admin/products',
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            stats: `${data.stats.products || 0} products`,
          },
          {
            title: 'Orders',
            description: 'View and process customer orders',
            href: '/admin/orders',
            icon: ShoppingCart,
            color: 'from-green-500 to-green-600',
            stats: `${data.stats.awaiting || 0} pending`,
          },
          {
            title: 'Analytics',
            description: 'Sales reports and insights',
            href: '/admin/analytics',
            icon: BarChart3,
            color: 'from-premium-gold to-premium-amber',
            stats: 'View reports',
          },
          {
            title: 'Users',
            description: 'Manage customer accounts',
            href: '/admin/users',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            stats: `${data.stats.users || 0} users`,
          },
          {
            title: 'Settings',
            description: 'Configure store settings',
            href: '/admin/settings',
            icon: Settings,
            color: 'from-gray-500 to-gray-600',
            stats: 'Configure',
          },
        ])

        // Build recent activity from real data
        const activities: any[] = []
        
        // Add recent orders
        if (data.recent?.orders) {
          data.recent.orders.slice(0, 3).forEach((order: any) => {
            activities.push({
              action: `New order #${order._id?.slice(-8) || 'N/A'}`,
              time: new Date(order.createdAt || Date.now()).toLocaleString(),
              type: 'order',
            })
          })
        }

        // Add recent products
        if (data.recent?.products) {
          data.recent.products.slice(0, 2).forEach((product: any) => {
            activities.push({
              action: `Product added: ${product.title}`,
              time: new Date(product.createdAt || Date.now()).toLocaleString(),
              type: 'product',
            })
          })
        }

        // Add recent users
        if (data.recent?.users) {
          data.recent.users.slice(0, 1).forEach((user: any) => {
            activities.push({
              action: `New user: ${user.email || user.name}`,
              time: new Date(user.createdAt || Date.now()).toLocaleString(),
              type: 'user',
            })
          })
        }

        setRecentActivity(activities.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Stats Dashboard */}
      <AdminStats />

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ocean-darkGray flex items-center gap-2">
            <FileText size={24} />
            Quick Actions
          </h2>
          <motion.button
            onClick={loadData}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-ocean-lightest rounded-lg transition"
            title="Refresh data"
          >
            <RefreshCw size={18} className="text-ocean-gray" />
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Link
                href={link.href}
                className={`bg-gradient-to-br ${link.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition relative overflow-hidden block h-full`}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-xl" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <link.icon size={28} className="text-white" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">
                      {loading ? '...' : link.stats}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{link.title}</h3>
                  <p className="text-white/90 text-sm mb-4">{link.description}</p>
                  <span className="inline-flex items-center gap-2 text-white font-medium text-sm">
                    Open →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-ocean-border rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ocean-darkGray flex items-center gap-2">
            <Bell size={24} />
            Recent Activity
          </h2>
          <motion.button
            onClick={loadData}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-ocean-lightest rounded-lg transition"
          >
            <RefreshCw size={18} className="text-ocean-gray" />
          </motion.button>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-ocean-lightest rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="text-ocean-gray text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-ocean-lightest rounded-lg hover:bg-ocean-lighter transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'product' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`} />
                  <div>
                    <p className="font-medium text-ocean-darkGray">{activity.action}</p>
                    <p className="text-sm text-ocean-gray">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


