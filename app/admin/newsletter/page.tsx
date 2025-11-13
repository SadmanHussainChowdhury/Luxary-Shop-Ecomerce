'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Search, Download, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface NewsletterSubscription {
  _id: string
  email: string
  subscribedAt: string
  isActive: boolean
  unsubscribedAt?: string
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Stats {
  total: number
  active: number
  inactive: number
}

export default function AdminNewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadSubscriptions()
  }, [pagination.page, statusFilter, search])

  async function loadSubscriptions() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        ...(search && { search }),
      })

      const res = await fetch(`/api/admin/newsletter?${params}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load subscriptions')
      }

      setSubscriptions(data.subscriptions || [])
      setPagination(data.pagination || pagination)
      setStats(data.stats || stats)
    } catch (error: any) {
      console.error('Failed to load subscriptions:', error)
      toast.error('Failed to load newsletter subscriptions')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate(email: string) {
    if (!confirm(`Are you sure you want to deactivate subscription for ${email}?`)) {
      return
    }

    setDeleting(email)
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to deactivate subscription')
      }

      toast.success('Subscription deactivated successfully')
      loadSubscriptions()
    } catch (error: any) {
      console.error('Failed to deactivate subscription:', error)
      toast.error(error.message || 'Failed to deactivate subscription')
    } finally {
      setDeleting(null)
    }
  }

  function handleExport() {
    const csv = [
      ['Email', 'Subscribed At', 'Status', 'Unsubscribed At'].join(','),
      ...subscriptions.map((sub) =>
        [
          sub.email,
          new Date(sub.subscribedAt).toLocaleDateString(),
          sub.isActive ? 'Active' : 'Inactive',
          sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleDateString() : '',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Subscriptions exported successfully')
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ocean-darkGray flex items-center gap-3">
            <Mail size={32} className="text-premium-gold" />
            Newsletter Subscriptions
          </h1>
          <p className="text-ocean-gray mt-2">Manage newsletter email subscriptions</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            onClick={handleExport}
            disabled={subscriptions.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export CSV
          </motion.button>
          <motion.button
            onClick={loadSubscriptions}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-lightest border border-ocean-border rounded-lg hover:bg-ocean-border transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ocean-gray text-sm">Total Subscriptions</p>
              <p className="text-3xl font-bold text-ocean-darkGray mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail size={24} className="text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ocean-gray text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ocean-gray text-sm">Inactive</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPagination({ ...pagination, page: 1 })
                  loadSubscriptions()
                }
              }}
              placeholder="Search by email..."
              className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStatusFilter('all')
                setPagination({ ...pagination, page: 1 })
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-premium-gold text-white'
                  : 'bg-ocean-lightest text-ocean-darkGray hover:bg-ocean-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setStatusFilter('active')
                setPagination({ ...pagination, page: 1 })
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'active'
                  ? 'bg-premium-gold text-white'
                  : 'bg-ocean-lightest text-ocean-darkGray hover:bg-ocean-border'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setStatusFilter('inactive')
                setPagination({ ...pagination, page: 1 })
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'inactive'
                  ? 'bg-premium-gold text-white'
                  : 'bg-ocean-lightest text-ocean-darkGray hover:bg-ocean-border'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-ocean-border rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={48} className="text-ocean-gray mx-auto mb-4" />
            <p className="text-ocean-gray text-lg">No subscriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ocean-lightest">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Subscribed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-border">
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-ocean-lightest transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-ocean-darkGray">{subscription.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-ocean-gray">{formatDate(subscription.subscribedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          subscription.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subscription.isActive ? (
                          <>
                            <CheckCircle size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.isActive && (
                        <button
                          onClick={() => handleDeactivate(subscription.email)}
                          disabled={deleting === subscription.email}
                          className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          title="Deactivate subscription"
                        >
                          {deleting === subscription.email ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-ocean-border flex items-center justify-between">
            <div className="text-sm text-ocean-gray">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} subscriptions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-ocean-border rounded-lg hover:bg-ocean-lightest transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-ocean-darkGray">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-ocean-border rounded-lg hover:bg-ocean-lightest transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

