'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Mail, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/cart')
      return
    }
    // Optionally fetch order details
    setLoading(false)
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white border-2 border-green-500 rounded-2xl p-8 shadow-xl"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-ocean-darkGray mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-ocean-gray mb-2">
              Thank you for your purchase
            </p>
            {orderId && (
              <p className="text-sm text-ocean-gray">
                Order ID: <span className="font-mono font-bold">{orderId.slice(-8)}</span>
              </p>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-ocean-lightest rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-ocean-darkGray mb-4 flex items-center gap-2">
              <Package size={24} className="text-premium-gold" />
              What's Next?
            </h2>
            <ul className="space-y-3 text-ocean-gray">
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-premium-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Order Confirmation Email</p>
                  <p className="text-sm">You'll receive an email confirmation shortly with your order details.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Package size={20} className="text-premium-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm">Your order is being processed and will be shipped soon.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShoppingBag size={20} className="text-premium-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Track Your Order</p>
                  <p className="text-sm">You can view your order status in your account dashboard.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 bg-gradient-to-r from-premium-gold to-premium-amber text-white py-4 px-6 rounded-lg font-bold text-center hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 bg-white border-2 border-ocean-border text-ocean-darkGray py-4 px-6 rounded-lg font-bold text-center hover:border-premium-gold transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

