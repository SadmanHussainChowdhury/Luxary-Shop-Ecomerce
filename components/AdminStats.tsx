'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, RefreshCw, Mail } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color: string
  gradient: string
  loading?: boolean
}

function StatCard({ title, value, change, icon: Icon, color, gradient, loading }: StatCardProps) {
  const isPositive = change && change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${color} rounded-xl bg-white/20 backdrop-blur-sm`}>
            <Icon size={24} className="text-white" />
          </div>
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : change !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm ${
              isPositive ? 'text-green-200' : 'text-red-200'
            }`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
        {loading ? (
          <div className="h-8 w-24 bg-white/20 rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </div>
    </motion.div>
  )
}

export default function AdminStats() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    newsletter: 0,
    revenue: '0',
  })
  const [trends, setTrends] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  async function fetchStats() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/stats', { cache: 'no-store' })
      const data = await res.json()
      
      if (data.stats) {
        setStats({
          products: data.stats.products || 0,
          orders: data.stats.orders || 0,
          users: data.stats.users || 0,
          newsletter: data.stats.newsletter || 0,
          revenue: data.stats.revenue ? `$${Number(data.stats.revenue).toLocaleString()}` : '$0',
        })
        setTrends(data.trends || { products: 0, orders: 0, users: 0, revenue: 0 })
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products.toLocaleString(),
      change: trends.products,
      icon: Package,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats.orders.toLocaleString(),
      change: trends.orders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Revenue',
      value: stats.revenue,
      change: trends.revenue,
      icon: DollarSign,
      color: 'bg-premium-gold',
      gradient: 'from-premium-gold to-premium-amber',
    },
    {
      title: 'Total Users',
      value: stats.users.toLocaleString(),
      change: trends.users,
      icon: Users,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.newsletter.toLocaleString(),
      icon: Mail,
      color: 'bg-pink-500',
      gradient: 'from-pink-500 to-pink-600',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ocean-darkGray">Dashboard Statistics</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ocean-gray">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <motion.button
            onClick={fetchStats}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-ocean-lightest rounded-lg transition"
            title="Refresh stats"
          >
            <RefreshCw size={18} className="text-ocean-gray" />
          </motion.button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} loading={loading} />
        ))}
      </div>
    </div>
  )
}
