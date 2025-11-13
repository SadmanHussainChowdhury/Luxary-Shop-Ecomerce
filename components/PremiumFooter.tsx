'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Crown, 
  Sparkles, 
  Shield, 
  Truck, 
  Headphones, 
  Award, 
  CreditCard,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
  MapPin,
  Clock,
  Star,
  Gift,
  Heart,
  Zap
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SiteSettings {
  siteName?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  businessHours?: string
  footerText?: string
  footerDescription?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
  paymentMethods?: Array<{
    name: string
    enabled: boolean
    icon?: string
  }>
}

export default function PremiumFooter() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' })
        const data = await res.json()
        if (data.settings) {
          setSettings(data.settings)
          console.log('Footer settings loaded:', {
            paymentMethods: data.settings.paymentMethods?.length || 0,
            enabled: data.settings.paymentMethods?.filter((m: any) => m.enabled).length || 0
          })
        }
      } catch (error) {
        console.error('Failed to load site settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setSubmitting(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Successfully subscribed to newsletter!')
        setEmail('')
      } else {
        toast.error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden mt-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-premium-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-premium-amber/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Premium Top Section */}
        <div className="border-b border-white/10 bg-gradient-to-r from-premium-gold/20 via-premium-amber/20 to-premium-gold/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="p-4 bg-gradient-to-br from-premium-gold to-premium-amber rounded-2xl shadow-2xl"
                  >
                    <Crown size={40} className="text-white" fill="white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles size={20} className="text-premium-gold fill-premium-gold" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent">
                    {settings.siteName || 'Luxury Shop'}
                  </h3>
                  <p className="text-white/80 text-sm">Premium Shopping Experience</p>
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { icon: Shield, label: 'Secure Payment', color: 'from-green-500 to-emerald-500' },
                  { icon: Truck, label: 'Free Shipping', color: 'from-blue-500 to-cyan-500' },
                  { icon: Award, label: 'Premium Quality', color: 'from-premium-gold to-premium-amber' },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-center"
                  >
                    <div className={`p-3 bg-gradient-to-br ${badge.color} rounded-xl mb-2 inline-block shadow-lg`}>
                      <badge.icon size={24} className="text-white" />
                    </div>
                    <p className="text-xs text-white/80">{badge.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Mail size={20} className="text-premium-gold" />
                  Subscribe to Newsletter
                </h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                  />
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap size={18} />
                    )}
                  </motion.button>
                </form>
                <p className="text-xs text-white/60 mt-2">Get exclusive deals & updates</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Crown size={24} className="text-premium-gold fill-premium-gold" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-premium-gold to-premium-amber bg-clip-text text-transparent">
                    {settings.siteName || 'Luxury Shop'}
                  </h3>
                </div>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {settings.footerDescription || 'Your premier destination for luxury products. Experience world-class quality and exceptional service.'}
                </p>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>
                      {settings.address || ''}
                      {settings.city && `, ${settings.city}`}
                      {settings.state && `, ${settings.state}`}
                      {settings.zipCode && ` ${settings.zipCode}`}
                      {!settings.address && !settings.city && '123 Luxury Street, Premium City'}
                    </span>
                  </div>
                  {settings.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>{settings.contactPhone}</span>
                    </div>
                  )}
                  {settings.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <span>{settings.contactEmail}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Customer Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Headphones size={20} className="text-premium-gold" />
                Customer Service
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help#returns"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help#shipping"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Crown size={20} className="text-premium-gold" />
                About Us
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    About Luxury Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#story"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#press"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Press & Media
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#sustainability"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Sustainability
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shield size={20} className="text-premium-gold" />
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy#cookies"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms#refund"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms#warranty"
                    className="text-white/70 hover:text-premium-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Warranty
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Connect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-premium-gold fill-premium-gold" />
                Connect
              </h4>
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600', url: settings.socialLinks?.facebook },
                  { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500', url: settings.socialLinks?.twitter },
                  { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600', url: settings.socialLinks?.instagram },
                  { icon: Youtube, label: 'Youtube', color: 'hover:bg-red-600', url: settings.socialLinks?.youtube },
                  { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700', url: settings.socialLinks?.linkedin },
                ]
                  .filter((social) => social.url)
                  .map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 bg-white/10 backdrop-blur-sm rounded-lg ${social.color} transition-colors border border-white/20 hover:border-transparent`}
                      title={social.label}
                    >
                      <social.icon size={20} className="text-white" />
                    </motion.a>
                  ))}
              </div>
              <div className="space-y-2">
                {settings.businessHours && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock size={14} />
                    <span>{settings.businessHours}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Star size={14} className="text-premium-gold fill-premium-gold" />
                  <span>4.9/5 Customer Rating</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Methods & Awards */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-sm font-semibold mb-4 text-white/80 flex items-center gap-2">
                  <CreditCard size={18} className="text-premium-gold" />
                  We Accept
                </h4>
                <div className="flex flex-wrap gap-3">
                  {loading ? (
                    // Loading state
                    <div className="text-white/60 text-sm">Loading payment methods...</div>
                  ) : settings.paymentMethods && settings.paymentMethods.length > 0 ? (
                    // Dynamic payment methods from settings
                    settings.paymentMethods
                      .filter((method) => method.enabled)
                      .map((method, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-sm font-medium"
                        >
                          {method.name}
                        </motion.div>
                      ))
                  ) : (
                    // Fallback default payment methods
                    ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((method, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-sm font-medium"
                      >
                        {method}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-white/80 flex items-center gap-2">
                  <Award size={18} className="text-premium-gold" />
                  Awards & Certifications
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Award, label: 'Best E-commerce 2024' },
                    { icon: Shield, label: 'SSL Certified' },
                    { icon: Heart, label: 'Trusted Brand' },
                    { icon: Gift, label: 'Customer Choice' },
                  ].map((award, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                    >
                      <award.icon size={16} className="text-premium-gold" />
                      <span className="text-xs">{award.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>{settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName || 'Luxury Shop'}.`}</span>
                <span className="hidden sm:inline">All rights reserved.</span>
                <motion.span
                  className="inline-flex items-center gap-1 text-premium-gold"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown size={14} className="fill-premium-gold" />
                  Premium Quality Guaranteed
                </motion.span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/sitemap" className="text-white/60 hover:text-premium-gold transition-colors">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="text-white/60 hover:text-premium-gold transition-colors">
                  Accessibility
                </Link>
                <Link href="/privacy#donotsell" className="text-white/60 hover:text-premium-gold transition-colors">
                  Do Not Sell My Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

