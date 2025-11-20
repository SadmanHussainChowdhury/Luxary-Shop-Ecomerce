'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Calendar } from 'lucide-react'

const statusConfig = {
  awaiting_payment: {
    label: 'Awaiting Payment',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Package,
  },
  fulfilled: {
    label: 'Fulfilled',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: Truck,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: CheckCircle,
  },
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Order not found')
        }
        const data = await res.json()
        setOrder(data.order)
      } catch (error) {
        console.error('Failed to load order:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lightest flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lightest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ocean-darkGray mb-4">Order Not Found</h1>
          <Link href="/account/orders" className="text-premium-gold hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.awaiting_payment
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lightest py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/account/orders" className="text-premium-gold hover:underline mb-6 inline-block">
          ← Back to Orders
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-ocean-darkGray mb-2">
                Order #{order._id?.slice(-8) || 'N/A'}
              </h1>
              <p className="text-ocean-gray flex items-center gap-2">
                <Calendar size={16} />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${status.color}`}>
              <StatusIcon size={20} />
              <span className="font-semibold">{status.label}</span>
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="bg-premium-gold/10 border border-premium-gold/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Truck size={24} className="text-premium-gold" />
                <div>
                  <p className="font-semibold text-ocean-darkGray">Tracking Number</p>
                  <p className="text-2xl font-bold text-premium-gold">{order.trackingNumber}</p>
                </div>
              </div>
              {order.shippingCarrier && (
                <p className="text-sm text-ocean-gray mt-2">
                  Carrier: {order.shippingCarrier}
                </p>
              )}
              {order.estimatedDelivery && (
                <p className="text-sm text-ocean-gray">
                  Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ocean-darkGray mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-ocean-lightest rounded-lg">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'}
                    alt={item.title}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-ocean-darkGray">{item.title}</h3>
                    <p className="text-sm text-ocean-gray">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ocean-darkGray">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-ocean-gray">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-ocean-darkGray mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Address
              </h2>
              <div className="bg-ocean-lightest rounded-lg p-4">
                <p className="font-semibold text-ocean-darkGray">{order.customer?.name}</p>
                <p className="text-ocean-gray">{order.customer?.address}</p>
                <p className="text-ocean-gray">
                  {order.customer?.city}, {order.customer?.state} {order.customer?.zipCode}
                </p>
                <p className="text-ocean-gray">{order.customer?.country}</p>
                {order.customer?.phone && (
                  <p className="text-ocean-gray mt-2">Phone: {order.customer.phone}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-ocean-darkGray mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Summary
              </h2>
              <div className="bg-ocean-lightest rounded-lg p-4 space-y-2">
                {order.subtotal && (
                  <div className="flex justify-between text-ocean-gray">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                )}
                {order.shipping !== undefined && (
                  <div className="flex justify-between text-ocean-gray">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                )}
                {order.tax !== undefined && (
                  <div className="flex justify-between text-ocean-gray">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                )}
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-ocean-darkGray pt-2 border-t border-ocean-border">
                  <span>Total</span>
                  <span className="text-premium-gold">${order.total?.toFixed(2) || '0.00'}</span>
                </div>
                {order.paymentMethod && (
                  <p className="text-sm text-ocean-gray mt-2">
                    Payment Method: {order.paymentMethod}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

