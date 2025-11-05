'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, Filter, Calendar, DollarSign, Package, Eye } from 'lucide-react'

const statusColors = {
  awaiting_payment: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  paid: 'bg-blue-100 text-blue-700 border-blue-300',
  fulfilled: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
}

const statusLabels = {
  awaiting_payment: 'Awaiting Payment',
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [status, setStatus] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    awaiting: 0,
    paid: 0,
    fulfilled: 0,
    revenue: 0,
  })

  async function load() {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (status) qs.set('status', status)
      
      // Fetch orders and stats in parallel
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`/api/admin/orders?${qs.toString()}`, { cache: 'no-store' }),
        fetch('/api/admin/stats', { cache: 'no-store' }),
      ])
      
      const ordersData = await ordersRes.json()
      const statsData = await statsRes.json()
      
      setItems(ordersData.items || [])
      setFilteredItems(ordersData.items || [])
      
      // Update stats from API
      if (statsData.stats) {
        setStats({
          total: statsData.stats.orders || 0,
          awaiting: statsData.stats.awaiting || 0,
          paid: statsData.stats.paid || 0,
          fulfilled: statsData.stats.fulfilled || 0,
          revenue: parseFloat(statsData.stats.revenue || '0'),
        })
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    load()
    // Auto-refresh every 30 seconds for orders
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items)
      return
    }
    const filtered = items.filter((o) =>
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.user?.email && o.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredItems(filtered)
  }, [searchQuery, items])

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <ShoppingCart size={32} />
              Order Management
            </h1>
            <p className="text-white/90">View and manage customer orders</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.total}</div>
            <div className="text-white/80 text-sm">Total Orders</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ocean-gray mb-1">Awaiting Payment</p>
              <p className="text-2xl font-bold text-ocean-darkGray">{stats.awaiting}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Package className="text-yellow-600" size={24} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ocean-gray mb-1">Paid Orders</p>
              <p className="text-2xl font-bold text-ocean-darkGray">{stats.paid}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ocean-gray mb-1">Fulfilled</p>
              <p className="text-2xl font-bold text-ocean-darkGray">{stats.fulfilled}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ocean-gray mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-premium-gold">${stats.revenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-premium-gold/10 rounded-lg">
              <DollarSign className="text-premium-gold" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by ID or email..."
              className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
            />
          </div>
          <div className="relative flex items-center gap-2">
            <Filter className="text-ocean-gray" size={20} />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-ocean-border rounded-xl p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-ocean-gray mb-4" />
          <p className="text-ocean-gray text-lg">
            {searchQuery || status ? 'No orders found' : 'No orders yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((o, i) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/admin/orders/${o._id}`}
                className="block bg-white border border-ocean-border rounded-xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-xl text-ocean-darkGray mb-1">
                          Order #{o._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-ocean-gray flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                          statusColors[o.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {statusLabels[o.status as keyof typeof statusLabels] || o.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-ocean-gray">
                      <div className="flex items-center gap-2">
                        <Package size={14} />
                        <span>{o.items?.length || 0} items</span>
                      </div>
                      {o.customer?.email && (
                        <div className="flex items-center gap-2">
                          <span>{o.customer.email}</span>
                        </div>
                      )}
                      {o.user?.email && !o.customer?.email && (
                        <div className="flex items-center gap-2">
                          <span>{o.user.email}</span>
                        </div>
                      )}
                      {o.customer?.name && (
                        <div className="flex items-center gap-2">
                          <span>{o.customer.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-2xl text-premium-gold">${o.total?.toFixed(2) || '0.00'}</div>
                      <p className="text-sm text-ocean-gray">Total</p>
                    </div>
                    <div className="p-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition">
                      <Eye size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
