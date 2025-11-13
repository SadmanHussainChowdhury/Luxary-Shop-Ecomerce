'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock, DollarSign, Phone, Mail, Package, Search, RefreshCw } from 'lucide-react'

interface Order {
  _id: string
  items: Array<{
    title: string
    quantity: number
    price: number
  }>
  total: number
  status: string
  paymentMethod?: string
  customer?: {
    name: string
    email: string
    phone?: string
  }
  createdAt: string
}

export default function PaymentVerificationPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMethod, setFilterMethod] = useState<string>('')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders?status=awaiting_payment', { cache: 'no-store' })
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  async function verifyPayment(orderId: string, order: Order) {
    setVerifying(orderId)
    try {
      // First, try to verify using payment gateway API (if configured)
      // For now, we'll do manual verification and send SMS
      
      // Update order status to paid
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify payment')
      }

      // Send SMS notification to customer
      if (order.customer?.phone) {
        try {
          const message = `Your payment for order #${orderId.slice(-6)} has been verified. Order total: $${order.total.toFixed(2)}. Thank you for your purchase!`
          
          const smsRes = await fetch('/api/admin/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: order.customer.phone,
              message: message,
            }),
          })

          const smsData = await smsRes.json()

          if (smsData.success) {
            toast.success('Payment verified and SMS sent to customer')
          } else {
            toast.success('Payment verified, but SMS failed to send')
            console.error('SMS error:', smsData.error)
          }
        } catch (smsError) {
          console.error('SMS notification error:', smsError)
          toast.success('Payment verified (SMS notification failed)')
        }
      } else {
        toast.success('Payment verified successfully')
      }

      // Reload orders
      await loadOrders()
    } catch (error: any) {
      console.error('Verify payment error:', error)
      toast.error(error.message || 'Failed to verify payment')
    } finally {
      setVerifying(null)
    }
  }

  async function rejectPayment(orderId: string) {
    if (!confirm('Are you sure you want to reject this payment? The order will be cancelled.')) {
      return
    }

    setVerifying(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reject payment')
      }

      toast.success('Payment rejected and order cancelled')
      await loadOrders()
    } catch (error: any) {
      console.error('Reject payment error:', error)
      toast.error(error.message || 'Failed to reject payment')
    } finally {
      setVerifying(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchQuery === '' || 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.phone?.includes(searchQuery)
    
    const matchesMethod = filterMethod === '' || 
      order.paymentMethod?.toLowerCase() === filterMethod.toLowerCase()
    
    return matchesSearch && matchesMethod
  })

  const mobilePaymentOrders = filteredOrders.filter(
    (order) => order.paymentMethod && ['bkash', 'nagad', 'rocket'].includes(order.paymentMethod.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ocean-darkGray flex items-center gap-2">
            <CheckCircle size={24} className="text-premium-gold" />
            Payment Verification
          </h2>
          <p className="text-ocean-gray mt-1">
            Verify payments for orders awaiting payment confirmation
          </p>
        </div>
        <motion.button
          onClick={loadOrders}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition"
        >
          <RefreshCw size={18} />
          Refresh
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ocean-gray">Total Pending</p>
              <p className="text-2xl font-bold text-ocean-darkGray">{orders.length}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
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
              <p className="text-sm text-ocean-gray">Mobile Payments</p>
              <p className="text-2xl font-bold text-ocean-darkGray">{mobilePaymentOrders.length}</p>
            </div>
            <Phone className="text-premium-gold" size={32} />
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
              <p className="text-sm text-ocean-gray">Total Amount</p>
              <p className="text-2xl font-bold text-premium-gold">
                ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={32} />
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
              <p className="text-sm text-ocean-gray">Cash on Delivery</p>
              <p className="text-2xl font-bold text-ocean-darkGray">
                {orders.filter((o) => o.paymentMethod?.toLowerCase() === 'cash' || o.paymentMethod?.toLowerCase().includes('delivery')).length}
              </p>
            </div>
            <Package className="text-blue-500" size={32} />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
            />
          </div>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
          >
            <option value="">All Payment Methods</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-ocean-border rounded-xl p-8 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-ocean-gray text-lg">No orders awaiting payment verification</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-ocean-darkGray">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-ocean-gray">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      order.paymentMethod && ['bkash', 'nagad', 'rocket'].includes(order.paymentMethod.toLowerCase())
                        ? 'bg-premium-gold/10 text-premium-gold border-premium-gold/30'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    }`}>
                      {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'AWAITING PAYMENT'}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-premium-gold" />
                      <span className="text-ocean-gray">Total:</span>
                      <span className="font-bold text-ocean-darkGray">${order.total.toFixed(2)}</span>
                    </div>
                    {order.customer && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={16} className="text-ocean-gray" />
                          <span className="text-ocean-gray">{order.customer.email}</span>
                        </div>
                        {order.customer.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={16} className="text-ocean-gray" />
                            <span className="text-ocean-gray">{order.customer.phone}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="border-t border-ocean-border pt-4">
                    <p className="text-sm font-semibold text-ocean-darkGray mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-ocean-gray">
                          <span>{item.title} (x{item.quantity})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => verifyPayment(order._id, order)}
                      disabled={verifying === order._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying === order._id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Verify Payment
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => rejectPayment(order._id)}
                      disabled={verifying === order._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle size={20} />
                      Reject Payment
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

