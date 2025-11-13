'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Shield, User as UserIcon, Mail, Phone, Calendar, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Stats {
  total: number
  users: number
  admins: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [stats, setStats] = useState<Stats>({
    total: 0,
    users: 0,
    admins: 0,
  })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')

  useEffect(() => {
    loadUsers()
  }, [pagination.page, roleFilter, search])

  async function loadUsers() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(search && { search }),
      })

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load users')
      }

      setUsers(data.users || [])
      setPagination(data.pagination || pagination)
      setStats(data.stats || stats)
    } catch (error: any) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
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
            <Users size={32} className="text-premium-gold" />
            User Management
          </h1>
          <p className="text-ocean-gray mt-2">View and manage all registered users</p>
        </div>
        <motion.button
          onClick={loadUsers}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-ocean-lightest border border-ocean-border rounded-lg hover:bg-ocean-border transition disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </motion.button>
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
              <p className="text-ocean-gray text-sm">Total Users</p>
              <p className="text-3xl font-bold text-ocean-darkGray mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
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
              <p className="text-ocean-gray text-sm">Customers</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.users}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserIcon size={24} className="text-green-600" />
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
              <p className="text-ocean-gray text-sm">Admins</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.admins}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield size={24} className="text-purple-600" />
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
                  loadUsers()
                }
              }}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRoleFilter('all')
                setPagination({ ...pagination, page: 1 })
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                roleFilter === 'all'
                  ? 'bg-premium-gold text-white'
                  : 'bg-ocean-lightest text-ocean-darkGray hover:bg-ocean-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setRoleFilter('user')
                setPagination({ ...pagination, page: 1 })
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                roleFilter === 'user'
                  ? 'bg-premium-gold text-white'
                  : 'bg-ocean-lightest text-ocean-darkGray hover:bg-ocean-border'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => {
                setRoleFilter('admin')
                setPagination({ ...pagination, page: 1 })
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                roleFilter === 'admin'
                  ? 'bg-premium-gold text-white'
                  : 'bg-ocean-lightest text-ocean-darkGray hover:bg-ocean-border'
              }`}
            >
              Admins
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-ocean-border rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="text-ocean-gray mx-auto mb-4" />
            <p className="text-ocean-gray text-lg">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ocean-lightest">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ocean-darkGray uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-border">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-ocean-lightest transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-premium-gold to-premium-amber rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ocean-darkGray">{user.name}</div>
                          <div className="text-xs text-ocean-gray">ID: {user._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-ocean-darkGray">
                          <Mail size={14} className="text-ocean-gray" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-ocean-gray">
                            <Phone size={14} />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <Shield size={14} />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserIcon size={14} />
                            Customer
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-ocean-gray">
                        <Calendar size={14} />
                        {formatDate(user.createdAt)}
                      </div>
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
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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

