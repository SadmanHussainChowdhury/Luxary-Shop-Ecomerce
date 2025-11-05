'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, Calendar, User, Mail, Phone, MapPin, Package, CheckCircle, XCircle, DollarSign, ShoppingBag } from 'lucide-react'

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

export default function AdminOrderDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { cache: 'no-store' })
      if (!res.ok) {
        toast.error('Failed to load order')
        setLoading(false)
        return
      }
      const data = await res.json()
      setOrder(data)
    } catch (error) {
      console.error('Failed to load order:', error)
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function updateStatus(status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (!res.ok) {
      toast.error('Update failed')
      return
    }
    toast.success(`Order marked as ${statusLabels[status as keyof typeof statusLabels] || status}`)
    load()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white border border-ocean-border rounded-xl p-12 text-center">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-ocean-gray text-lg">Order not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-ocean-gray hover:text-ocean-darkGray mb-2 transition"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-ocean-darkGray mb-2">
            Order #{order._id.slice(-8)}
          </h1>
          <p className="text-ocean-gray flex items-center gap-2">
            <Calendar size={16} />
            {new Date(order.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-lg font-medium border ${
            statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700 border-gray-300'
          }`}
        >
          {statusLabels[order.status as keyof typeof statusLabels] || order.status}
        </span>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-ocean-darkGray mb-4 flex items-center gap-2">
              <ShoppingBag size={24} />
              Order Items ({order.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {order.items?.map((it: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-ocean-lightest rounded-lg hover:bg-ocean-lighter transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-white rounded-lg">
                      <Package size={24} className="text-ocean-gray" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-ocean-darkGray mb-1">{it.title}</h3>
                      <p className="text-sm text-ocean-gray mb-1">{it.slug}</p>
                      <p className="text-sm text-ocean-gray">
                        Quantity: <span className="font-medium">{it.quantity}</span> × <span className="font-medium">${it.price}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-premium-gold">
                      ${(it.price * it.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          {(order.customer || order.user) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-ocean-darkGray mb-4 flex items-center gap-2">
                <User size={24} />
                Customer Information
              </h2>
              <div className="space-y-3">
                {order.customer ? (
                  <>
                    {order.customer.name && (
                      <div className="flex items-center gap-3 p-3 bg-ocean-lightest rounded-lg">
                        <User size={18} className="text-ocean-gray" />
                        <span className="text-ocean-darkGray font-medium">{order.customer.name}</span>
                      </div>
                    )}
                    {order.customer.email && (
                      <div className="flex items-center gap-3 p-3 bg-ocean-lightest rounded-lg">
                        <Mail size={18} className="text-ocean-gray" />
                        <span className="text-ocean-darkGray">{order.customer.email}</span>
                      </div>
                    )}
                    {order.customer.phone && (
                      <div className="flex items-center gap-3 p-3 bg-ocean-lightest rounded-lg">
                        <Phone size={18} className="text-ocean-gray" />
                        <span className="text-ocean-darkGray">{order.customer.phone}</span>
                      </div>
                    )}
                    {order.customer.address && (
                      <div className="flex items-start gap-3 p-3 bg-ocean-lightest rounded-lg">
                        <MapPin size={18} className="text-ocean-gray mt-0.5" />
                        <div className="text-ocean-darkGray">
                          <p>{order.customer.address}</p>
                          <p className="text-sm">
                            {order.customer.city}
                            {order.customer.state && `, ${order.customer.state}`}
                            {order.customer.zipCode && ` ${order.customer.zipCode}`}
                          </p>
                          {order.customer.country && (
                            <p className="text-sm">{order.customer.country}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {order.user?.email && (
                      <div className="flex items-center gap-3 p-3 bg-ocean-lightest rounded-lg">
                        <Mail size={18} className="text-ocean-gray" />
                        <span className="text-ocean-darkGray">{order.user.email}</span>
                      </div>
                    )}
                    {order.user?.name && (
                      <div className="flex items-center gap-3 p-3 bg-ocean-lightest rounded-lg">
                        <User size={18} className="text-ocean-gray" />
                        <span className="text-ocean-darkGray">{order.user.name}</span>
                      </div>
                    )}
                  </>
                )}
                {order.paymentMethod && (
                  <div className="flex items-center gap-3 p-3 bg-premium-gold/10 rounded-lg">
                    <DollarSign size={18} className="text-premium-gold" />
                    <span className="text-ocean-darkGray font-medium">
                      Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Order Summary & Actions */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-ocean-darkGray mb-4 flex items-center gap-2">
              <DollarSign size={24} />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-ocean-lightest rounded-lg">
                <span className="text-ocean-gray">Subtotal</span>
                <span className="font-medium text-ocean-darkGray">
                  ${(order.total * 0.9).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ocean-lightest rounded-lg">
                <span className="text-ocean-gray">Shipping</span>
                <span className="font-medium text-ocean-darkGray">
                  ${(order.total * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-premium-gold to-premium-amber rounded-lg text-white font-bold text-xl">
                <span>Total</span>
                <span>${order.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </motion.div>

          {/* Status Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-ocean-darkGray mb-4">Update Status</h2>
            <div className="space-y-2">
              {order.status === 'awaiting_payment' && (
                <motion.button
                  onClick={() => updateStatus('paid')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                >
                  <CheckCircle size={18} />
                  Mark as Paid
                </motion.button>
              )}
              {order.status === 'paid' && (
                <motion.button
                  onClick={() => updateStatus('fulfilled')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                >
                  <CheckCircle size={18} />
                  Mark as Fulfilled
                </motion.button>
              )}
              {order.status !== 'cancelled' && (
                <motion.button
                  onClick={() => updateStatus('cancelled')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                >
                  <XCircle size={18} />
                  Cancel Order
                </motion.button>
              )}
              {order.status === 'cancelled' && (
                <p className="text-sm text-ocean-gray text-center py-2">
                  This order has been cancelled
                </p>
              )}
              {order.status === 'fulfilled' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Order fulfilled</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
