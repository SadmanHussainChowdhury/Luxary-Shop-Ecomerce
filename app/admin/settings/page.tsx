'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Settings, Save, X } from 'lucide-react'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: '',
    siteDescription: '',
    siteTagline: '',
    logo: '',
    favicon: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    businessHours: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    },
    footerText: '',
    footerDescription: '',
    paymentMethods: [] as Array<{ name: string; enabled: boolean; icon?: string }>,
    promotionalBanner: {
      enabled: true,
      text: '',
      link: '',
    },
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/site-settings')
      const data = await res.json()
      if (data.settings) {
        setForm({
          siteName: data.settings.siteName || '',
          siteDescription: data.settings.siteDescription || '',
          siteTagline: data.settings.siteTagline || '',
          logo: data.settings.logo || '',
          favicon: data.settings.favicon || '',
          contactEmail: data.settings.contactEmail || '',
          contactPhone: data.settings.contactPhone || '',
          address: data.settings.address || '',
          city: data.settings.city || '',
          state: data.settings.state || '',
          zipCode: data.settings.zipCode || '',
          country: data.settings.country || '',
          businessHours: data.settings.businessHours || '',
          socialLinks: data.settings.socialLinks || {},
          footerText: data.settings.footerText || '',
          footerDescription: data.settings.footerDescription || '',
          paymentMethods: data.settings.paymentMethods || [],
          promotionalBanner: data.settings.promotionalBanner || { enabled: true, text: '', link: '' },
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save settings')
        return
      }
      toast.success('Settings saved successfully!')
      
      // Reload settings to ensure we have the latest from server
      await loadSettings()
    } catch (error) {
      console.error('Save settings error:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

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
        <h2 className="text-2xl font-bold text-ocean-darkGray flex items-center gap-2">
          <Settings size={24} />
          Site Settings
        </h2>
        <motion.button
          onClick={saveSettings}
          disabled={saving}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>

      <div className="bg-white border border-ocean-border rounded-2xl p-6 shadow-lg space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-darkGray mb-4">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Site Name</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Site Description</label>
              <input
                type="text"
                value={form.siteDescription}
                onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Site Tagline</label>
              <input
                type="text"
                value={form.siteTagline}
                onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-darkGray mb-4">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Phone</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">ZIP Code</label>
              <input
                type="text"
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Business Hours</label>
              <input
                type="text"
                value={form.businessHours}
                onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                placeholder="Mon-Fri: 9AM-8PM EST"
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-darkGray mb-4">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(form.socialLinks).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2 capitalize">{key}</label>
                <input
                  type="url"
                  value={form.socialLinks[key as keyof typeof form.socialLinks] || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, [key]: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Promotional Banner */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-darkGray mb-4">Promotional Banner</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.promotionalBanner.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    promotionalBanner: { ...form.promotionalBanner, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-premium-gold rounded focus:ring-premium-gold"
              />
              <label className="text-sm font-medium text-ocean-darkGray">Enable Promotional Banner</label>
            </div>
            {form.promotionalBanner.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">Banner Text</label>
                  <input
                    type="text"
                    value={form.promotionalBanner.text}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        promotionalBanner: { ...form.promotionalBanner, text: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-darkGray mb-2">Link (optional)</label>
                  <input
                    type="url"
                    value={form.promotionalBanner.link || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        promotionalBanner: { ...form.promotionalBanner, link: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-darkGray mb-4">Footer</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Footer Text</label>
              <textarea
                value={form.footerText}
                onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                rows={2}
                placeholder="© 2024 Luxury Shop. All rights reserved."
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">Footer Description</label>
              <textarea
                value={form.footerDescription}
                onChange={(e) => setForm({ ...form, footerDescription: e.target.value })}
                rows={3}
                placeholder="Your premier destination for luxury products..."
                className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-darkGray mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {form.paymentMethods.length > 0 ? (
              form.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-ocean-border rounded-lg">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={(e) => {
                      const updated = [...form.paymentMethods]
                      updated[index].enabled = e.target.checked
                      setForm({ ...form, paymentMethods: updated })
                    }}
                    className="w-4 h-4 text-premium-gold rounded focus:ring-premium-gold"
                  />
                  <input
                    type="text"
                    value={method.name}
                    onChange={(e) => {
                      const updated = [...form.paymentMethods]
                      updated[index].name = e.target.value
                      setForm({ ...form, paymentMethods: updated })
                    }}
                    className="flex-1 px-3 py-2 border border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold"
                  />
                  <button
                    onClick={() => {
                      const updated = form.paymentMethods.filter((_, i) => i !== index)
                      setForm({ ...form, paymentMethods: updated })
                    }}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-ocean-gray">No payment methods configured. Add one below.</p>
            )}
            <button
              onClick={() => {
                setForm({
                  ...form,
                  paymentMethods: [
                    ...form.paymentMethods,
                    { name: 'New Payment Method', enabled: true },
                  ],
                })
              }}
              className="px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition font-medium"
            >
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

