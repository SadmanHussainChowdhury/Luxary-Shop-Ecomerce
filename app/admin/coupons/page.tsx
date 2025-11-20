'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Tag, Calendar, DollarSign, Users, X } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0,
    userLimit: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    categories: [] as string[],
    description: '',
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  async function loadCoupons() {
    try {
      setLoading(true)
      const res = await fetch('/api/coupons', { cache: 'no-store' })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch coupons: ${res.status}`)
      }
      
      const text = await res.text()
      if (!text) {
        setCoupons([])
        return
      }
      
      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        throw new Error('Invalid response from server')
      }
      
      if (data.coupons) {
        setCoupons(data.coupons)
      } else {
        setCoupons([])
      }
    } catch (error: any) {
      console.error('Failed to load coupons:', error)
      toast.error(error.message || 'Failed to load coupons')
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.code || !formData.validUntil) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minPurchase: formData.minPurchase || undefined,
          maxDiscount: formData.maxDiscount || undefined,
          usageLimit: formData.usageLimit || undefined,
          userLimit: formData.userLimit || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create coupon')
      }

      toast.success('Coupon created successfully!')
      setShowForm(false)
      setFormData({
        code: '',
        type: 'percentage',
        value: 10,
        minPurchase: 0,
        maxDiscount: 0,
        usageLimit: 0,
        userLimit: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        categories: [],
        description: '',
      })
      loadCoupons()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create coupon')
    }
  }

  const getStatusColor = (coupon: any) => {
    const now = new Date()
    if (coupon.status === 'inactive') return 'bg-gray-100 text-gray-700'
    if (coupon.status === 'expired') return 'bg-red-100 text-red-700'
    if (now > new Date(coupon.validUntil)) return 'bg-red-100 text-red-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ocean-darkGray flex items-center gap-3">
          <Tag size={32} />
          Coupon Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-premium-gold text-white rounded-lg hover:bg-premium-amber transition flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-ocean-darkGray mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  required
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  max={formData.type === 'percentage' ? '100' : undefined}
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
                <p className="text-xs text-ocean-gray mt-1">
                  {formData.type === 'percentage' ? 'Percentage (0-100)' : 'Fixed amount in dollars'}
                </p>
              </div>
              {formData.type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    Max Discount
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Minimum Purchase
                </label>
                <input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Valid From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-premium-gold text-white rounded-lg hover:bg-premium-amber transition"
            >
              Create Coupon
            </button>
          </form>
        </motion.div>
      )}

      {/* Coupons List */}
      {loading ? (
        <div className="text-center py-12 text-ocean-gray">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-ocean-gray">No coupons found</div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-ocean-darkGray">{coupon.code}</h3>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(coupon)}`}>
                      {coupon.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-ocean-gray">
                      <DollarSign size={16} />
                      <span>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`} off
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-ocean-gray">
                      <Users size={16} />
                      <span>
                        {coupon.usedCount} / {coupon.usageLimit || '∞'} used
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-ocean-gray">
                      <Calendar size={16} />
                      <span>
                        Until {new Date(coupon.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {coupon.description && (
                    <p className="text-ocean-gray mt-2">{coupon.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

