'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // In production, send to API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success('Thank you! Your message has been sent successfully.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-ocean-gray max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-ocean-border rounded-xl p-6"
            >
              <div className="p-3 bg-premium-gold/10 rounded-lg w-fit mb-4">
                <Phone size={24} className="text-premium-gold" />
              </div>
              <h3 className="font-bold text-lg text-ocean-darkGray mb-2">Phone</h3>
              <p className="text-ocean-gray">+1 (555) 123-4567</p>
              <p className="text-sm text-ocean-gray mt-1">Mon-Fri: 9AM-8PM EST</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-ocean-border rounded-xl p-6"
            >
              <div className="p-3 bg-premium-gold/10 rounded-lg w-fit mb-4">
                <Mail size={24} className="text-premium-gold" />
              </div>
              <h3 className="font-bold text-lg text-ocean-darkGray mb-2">Email</h3>
              <p className="text-ocean-gray">support@luxuryshop.com</p>
              <p className="text-sm text-ocean-gray mt-1">We reply within 24 hours</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-ocean-border rounded-xl p-6"
            >
              <div className="p-3 bg-premium-gold/10 rounded-lg w-fit mb-4">
                <MapPin size={24} className="text-premium-gold" />
              </div>
              <h3 className="font-bold text-lg text-ocean-darkGray mb-2">Address</h3>
              <p className="text-ocean-gray">123 Luxury Street</p>
              <p className="text-ocean-gray">Premium City, PC 12345</p>
              <p className="text-ocean-gray">United States</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-premium-gold to-premium-amber rounded-xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={24} />
                <h3 className="font-bold text-lg">Live Chat</h3>
              </div>
              <p className="text-white/90 mb-4">Chat with our support team</p>
              <button className="w-full bg-white text-premium-gold py-2 rounded-lg font-bold hover:bg-white/90 transition">
                Start Chat
              </button>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white border border-ocean-border rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent resize-none"
                />
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-premium-gold to-premium-amber text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

