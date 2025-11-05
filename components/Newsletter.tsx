'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    // Store in localStorage for demo
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]')
    if (!subscribers.includes(email)) {
      subscribers.push(email)
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers))
    }

    setSubscribed(true)
    toast.success('Successfully subscribed to newsletter!')
    setEmail('')
    
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <section className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                <Mail size={40} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Stay Updated with Exclusive Offers
            </h2>
            <p className="text-white/90 mb-6">
              Subscribe to our newsletter and get 10% off your first order!
            </p>

            {subscribed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white"
              >
                <Check size={20} />
                <span>Thank you for subscribing!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-premium-gold rounded-lg font-bold hover:shadow-lg transition"
                >
                  Subscribe
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

