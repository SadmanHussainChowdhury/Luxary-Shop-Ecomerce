'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, Package, CheckCircle, AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { trackActivity } from '@/lib/activity-tracker'

const PROFILE_STORAGE_KEY = 'worldclass_profile_v1'
const ORDERS_STORAGE_KEY_PREFIX = 'worldclass_orders_'

function getOrdersStorageKey(): string {
  if (typeof window === 'undefined') return ''
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) return ''
    const parsed = JSON.parse(stored)
    const email = parsed?.email || ''
    if (!email) return ''
    return `${ORDERS_STORAGE_KEY_PREFIX}${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  } catch {
    return ''
  }
}

function saveOrderToLocalStorage(orderData: any) {
  if (typeof window === 'undefined') return
  try {
    const storageKey = getOrdersStorageKey()
    if (!storageKey) return

    const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const updatedOrders = [orderData, ...existingOrders]
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders))
  } catch (error) {
    console.error('Failed to save order to localStorage:', error)
  }
}

type CartItem = { slug: string; title: string; price: number; image?: string; quantity: number }

const STORAGE_KEY = 'up_premium_cart_v1'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function clearCart() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<Array<{ name: string; enabled: boolean }>>([])

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card',
  })

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const res = await fetch('/api/site-settings')
        const data = await res.json()
        if (data.settings?.paymentMethods) {
          const enabled = data.settings.paymentMethods.filter((pm: any) => pm.enabled)
          setPaymentMethods(enabled)
          // Set default payment method to first enabled method
          if (enabled.length > 0) {
            const defaultMethod = enabled[0].name.toLowerCase().includes('cash') ? 'cash' : 
                                 enabled[0].name.toLowerCase().includes('card') ? 'card' : 
                                 enabled[0].name.toLowerCase()
            setFormData(prev => ({ ...prev, paymentMethod: defaultMethod }))
          }
        } else {
          // Default fallback
          setPaymentMethods([
            { name: 'Credit/Debit Card', enabled: true },
            { name: 'Cash on Delivery', enabled: true },
          ])
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error)
        // Default fallback
        setPaymentMethods([
          { name: 'Credit/Debit Card', enabled: true },
          { name: 'Cash on Delivery', enabled: true },
        ])
      }
    }
    loadPaymentMethods()
  }, [])

  useEffect(() => {
    const cartItems = loadCart()
    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }
    setItems(cartItems)
  }, [router])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = 10.00
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
        throw new Error('Please fill in all required fields')
      }

      // Create order
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ slug, quantity }) => ({ slug, quantity })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
          total,
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Save order to localStorage for account overview
      if (data.orderId && typeof window !== 'undefined') {
        const orderForStorage = {
          _id: data.orderId,
          createdAt: new Date().toISOString(),
          total: total,
          status: formData.paymentMethod === 'cash' ? 'awaiting_payment' : 'paid',
          items: items.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        }
        saveOrderToLocalStorage(orderForStorage)
        
        // Track order_placed activity
        trackActivity('order_placed', {
          orderId: data.orderId,
          orderTotal: total,
        })
      }

      // Clear cart and show success
      clearCart()
      setSuccess(true)
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push(`/checkout/success?orderId=${data.orderId}`)
      }, 2000)
    } catch (e: any) {
      setError(e.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-green-500 rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={40} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-ocean-darkGray mb-2">Order Placed Successfully!</h2>
          <p className="text-ocean-gray mb-4">Your order has been received and will be processed shortly.</p>
          <p className="text-sm text-ocean-gray">Redirecting...</p>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lightest py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ocean-darkGray mb-2 flex items-center gap-3">
            <Lock size={32} className="text-premium-gold" />
            Checkout
          </h1>
          <p className="text-ocean-gray">Complete your order securely</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-ocean-darkGray mb-6 flex items-center gap-2">
                <Package size={24} className="text-premium-gold" />
                Shipping Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                    ZIP / Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-ocean-darkGray mb-6 flex items-center gap-2">
                <CreditCard size={24} className="text-premium-gold" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method, index) => {
                    const methodValue = method.name.toLowerCase().includes('cash') ? 'cash' : 
                                      method.name.toLowerCase().includes('card') ? 'card' : 
                                      method.name.toLowerCase().replace(/\s+/g, '_')
                    return (
                      <label
                        key={index}
                        className="flex items-center gap-3 p-4 border-2 border-ocean-border rounded-lg cursor-pointer hover:border-premium-gold transition"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={methodValue}
                          checked={formData.paymentMethod === methodValue}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-premium-gold"
                        />
                        {method.name.toLowerCase().includes('cash') ? (
                          <Package size={20} className="text-ocean-gray" />
                        ) : (
                          <CreditCard size={20} className="text-ocean-gray" />
                        )}
                        <span className="font-medium text-ocean-darkGray">{method.name}</span>
                      </label>
                    )
                  })
                ) : (
                  <>
                    <label className="flex items-center gap-3 p-4 border-2 border-ocean-border rounded-lg cursor-pointer hover:border-premium-gold transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-premium-gold"
                      />
                      <CreditCard size={20} className="text-ocean-gray" />
                      <span className="font-medium text-ocean-darkGray">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-ocean-border rounded-lg cursor-pointer hover:border-premium-gold transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-premium-gold"
                      />
                      <Package size={20} className="text-ocean-gray" />
                      <span className="font-medium text-ocean-darkGray">Cash on Delivery</span>
                    </label>
                  </>
                )}
              </div>
              <p className="mt-4 text-sm text-ocean-gray">
                <Lock size={14} className="inline mr-1" />
                Your payment information is secure and encrypted.
              </p>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg sticky top-4"
            >
              <h2 className="text-2xl font-bold text-ocean-darkGray mb-6 flex items-center gap-2">
                <ShoppingCart size={24} className="text-premium-gold" />
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.slug} className="flex items-center gap-3 pb-3 border-b border-ocean-border last:border-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1542291026-7ec264c27ff?w=600&q=80&auto=format&fit=crop'}
                      alt={item.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ocean-darkGray line-clamp-2">{item.title}</p>
                      <p className="text-xs text-ocean-gray">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-ocean-darkGray">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-ocean-gray">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ocean-gray">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ocean-gray">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-ocean-darkGray pt-4 border-t border-ocean-border">
                  <span>Total</span>
                  <span className="text-premium-gold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-premium-gold to-premium-amber text-white py-4 px-6 rounded-lg font-bold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Place Order
                  </>
                )}
              </button>

              <Link href="/cart" className="block text-center text-sm text-ocean-gray hover:text-premium-gold mt-4 transition">
                ← Back to Cart
              </Link>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}

