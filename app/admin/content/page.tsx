'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, X, Eye, EyeOff, Save, FileText, Sparkles, MessageSquare, Zap } from 'lucide-react'

type Tab = 'hero' | 'features' | 'testimonials' | 'flash-sale'

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hero')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Hero state
  const [heroes, setHeroes] = useState<any[]>([])
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    stats: [{ label: '', value: '' }],
    badgeText: '',
    isActive: true,
    order: 0,
  })

  // Features state
  const [features, setFeatures] = useState<any[]>([])
  const [featureForm, setFeatureForm] = useState({
    title: '',
    description: '',
    icon: '',
    color: 'from-premium-gold to-premium-amber',
    href: '',
    isActive: true,
    order: 0,
  })

  // Testimonials state
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    image: '',
    text: '',
    rating: 5,
    isActive: true,
    order: 0,
  })

  // Flash Sale state
  const [flashSales, setFlashSales] = useState<any[]>([])
  const [flashSaleForm, setFlashSaleForm] = useState({
    title: 'FLASH SALE',
    buttonText: 'Shop Now →',
    buttonLink: '/products?tag=flash',
    endDate: '',
    isActive: true,
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  async function loadData() {
    setLoading(true)
    try {
      if (activeTab === 'hero') {
        const res = await fetch('/api/admin/hero')
        const data = await res.json()
        setHeroes(data.heroes || [])
      } else if (activeTab === 'features') {
        const res = await fetch('/api/admin/features')
        const data = await res.json()
        setFeatures(data.features || [])
      } else if (activeTab === 'testimonials') {
        const res = await fetch('/api/admin/testimonials')
        const data = await res.json()
        setTestimonials(data.testimonials || [])
      } else if (activeTab === 'flash-sale') {
        const res = await fetch('/api/admin/flash-sale')
        const data = await res.json()
        setFlashSales(data.flashSales || [])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function saveHero() {
    try {
      const url = editingId ? `/api/admin/hero/${editingId}` : '/api/admin/hero'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroForm),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save hero')
        return
      }
      toast.success(editingId ? 'Hero updated!' : 'Hero created!')
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to save hero')
    }
  }

  async function saveFeature() {
    try {
      const url = editingId ? `/api/admin/features/${editingId}` : '/api/admin/features'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featureForm),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save feature')
        return
      }
      toast.success(editingId ? 'Feature updated!' : 'Feature created!')
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to save feature')
    }
  }

  async function saveTestimonial() {
    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save testimonial')
        return
      }
      toast.success(editingId ? 'Testimonial updated!' : 'Testimonial created!')
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to save testimonial')
    }
  }

  async function saveFlashSale() {
    try {
      const url = editingId ? `/api/admin/flash-sale/${editingId}` : '/api/admin/flash-sale'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...flashSaleForm, endDate: new Date(flashSaleForm.endDate) }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save flash sale')
        return
      }
      toast.success(editingId ? 'Flash sale updated!' : 'Flash sale created!')
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to save flash sale')
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      let url = ''
      if (activeTab === 'hero') url = `/api/admin/hero/${id}`
      else if (activeTab === 'features') url = `/api/admin/features/${id}`
      else if (activeTab === 'testimonials') url = `/api/admin/testimonials/${id}`
      else if (activeTab === 'flash-sale') url = `/api/admin/flash-sale/${id}`

      const res = await fetch(url, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Failed to delete')
        return
      }
      toast.success('Deleted successfully!')
      loadData()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  function editItem(item: any) {
    setEditingId(item._id)
    if (activeTab === 'hero') {
      setHeroForm({
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        primaryButtonText: item.primaryButtonText || '',
        primaryButtonLink: item.primaryButtonLink || '',
        secondaryButtonText: item.secondaryButtonText || '',
        secondaryButtonLink: item.secondaryButtonLink || '',
        stats: item.stats || [{ label: '', value: '' }],
        badgeText: item.badgeText || '',
        isActive: item.isActive !== undefined ? item.isActive : true,
        order: item.order || 0,
      })
    } else if (activeTab === 'features') {
      setFeatureForm({
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '',
        color: item.color || 'from-premium-gold to-premium-amber',
        href: item.href || '',
        isActive: item.isActive !== undefined ? item.isActive : true,
        order: item.order || 0,
      })
    } else if (activeTab === 'testimonials') {
      setTestimonialForm({
        name: item.name || '',
        role: item.role || '',
        image: item.image || '',
        text: item.text || '',
        rating: item.rating || 5,
        isActive: item.isActive !== undefined ? item.isActive : true,
        order: item.order || 0,
      })
    } else if (activeTab === 'flash-sale') {
      setFlashSaleForm({
        title: item.title || 'FLASH SALE',
        buttonText: item.buttonText || 'Shop Now →',
        buttonLink: item.buttonLink || '/products?tag=flash',
        endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
        isActive: item.isActive !== undefined ? item.isActive : true,
      })
    }
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setShowForm(false)
    setHeroForm({ title: '', subtitle: '', description: '', primaryButtonText: '', primaryButtonLink: '', secondaryButtonText: '', secondaryButtonLink: '', stats: [{ label: '', value: '' }], badgeText: '', isActive: true, order: 0 })
    setFeatureForm({ title: '', description: '', icon: '', color: 'from-premium-gold to-premium-amber', href: '', isActive: true, order: 0 })
    setTestimonialForm({ name: '', role: '', image: '', text: '', rating: 5, isActive: true, order: 0 })
    setFlashSaleForm({ title: 'FLASH SALE', buttonText: 'Shop Now →', buttonLink: '/products?tag=flash', endDate: '', isActive: true })
  }

  const tabs = [
    { id: 'hero' as Tab, label: 'Hero Section', icon: FileText },
    { id: 'features' as Tab, label: 'Features', icon: Sparkles },
    { id: 'testimonials' as Tab, label: 'Testimonials', icon: MessageSquare },
    { id: 'flash-sale' as Tab, label: 'Flash Sale', icon: Zap },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ocean-darkGray">Content Management</h2>
        {!showForm && (
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-semibold"
          >
            <Plus size={18} />
            Add New
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-ocean-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                resetForm()
              }}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                activeTab === tab.id
                  ? 'text-premium-gold border-b-2 border-premium-gold'
                  : 'text-ocean-gray hover:text-ocean-darkGray'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-ocean-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ocean-darkGray">
              {editingId ? 'Edit' : 'Create New'} {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-ocean-lightest rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Hero Form */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    value={heroForm.primaryButtonText}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button Link</label>
                  <input
                    type="text"
                    value={heroForm.primaryButtonLink}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonLink: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={heroForm.secondaryButtonText}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button Link</label>
                  <input
                    type="text"
                    value={heroForm.secondaryButtonLink}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonLink: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Badge Text</label>
                  <input
                    type="text"
                    value={heroForm.badgeText}
                    onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={heroForm.order}
                    onChange={(e) => setHeroForm({ ...heroForm, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Stats (JSON format: [{"label":"Happy Customers","value":"1M+"}])</label>
                  <textarea
                    value={JSON.stringify(heroForm.stats, null, 2)}
                    onChange={(e) => {
                      try {
                        setHeroForm({ ...heroForm, stats: JSON.parse(e.target.value) })
                      } catch {}
                    }}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg font-mono text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={heroForm.isActive}
                    onChange={(e) => setHeroForm({ ...heroForm, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>
              <button
                onClick={saveHero}
                className="px-6 py-2 bg-premium-gold text-white rounded-lg font-semibold hover:bg-premium-amber transition"
              >
                <Save size={18} className="inline mr-2" />
                Save Hero
              </button>
            </div>
          )}

          {/* Feature Form */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={featureForm.title}
                    onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Icon (Lucide name)</label>
                  <input
                    type="text"
                    value={featureForm.icon}
                    onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                    placeholder="Sparkles"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color (Tailwind gradient)</label>
                  <input
                    type="text"
                    value={featureForm.color}
                    onChange={(e) => setFeatureForm({ ...featureForm, color: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                    placeholder="from-premium-gold to-premium-amber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link</label>
                  <input
                    type="text"
                    value={featureForm.href}
                    onChange={(e) => setFeatureForm({ ...featureForm, href: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={featureForm.order}
                    onChange={(e) => setFeatureForm({ ...featureForm, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={featureForm.isActive}
                    onChange={(e) => setFeatureForm({ ...featureForm, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>
              <button
                onClick={saveFeature}
                className="px-6 py-2 bg-premium-gold text-white rounded-lg font-semibold hover:bg-premium-amber transition"
              >
                <Save size={18} className="inline mr-2" />
                Save Feature
              </button>
            </div>
          )}

          {/* Testimonial Form */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={testimonialForm.image}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Testimonial Text</label>
                  <textarea
                    value={testimonialForm.text}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={testimonialForm.order}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={testimonialForm.isActive}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>
              <button
                onClick={saveTestimonial}
                className="px-6 py-2 bg-premium-gold text-white rounded-lg font-semibold hover:bg-premium-amber transition"
              >
                <Save size={18} className="inline mr-2" />
                Save Testimonial
              </button>
            </div>
          )}

          {/* Flash Sale Form */}
          {activeTab === 'flash-sale' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={flashSaleForm.title}
                    onChange={(e) => setFlashSaleForm({ ...flashSaleForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={flashSaleForm.buttonText}
                    onChange={(e) => setFlashSaleForm({ ...flashSaleForm, buttonText: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={flashSaleForm.buttonLink}
                    onChange={(e) => setFlashSaleForm({ ...flashSaleForm, buttonLink: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    value={flashSaleForm.endDate}
                    onChange={(e) => setFlashSaleForm({ ...flashSaleForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={flashSaleForm.isActive}
                    onChange={(e) => setFlashSaleForm({ ...flashSaleForm, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>
              <button
                onClick={saveFlashSale}
                className="px-6 py-2 bg-premium-gold text-white rounded-lg font-semibold hover:bg-premium-amber transition"
              >
                <Save size={18} className="inline mr-2" />
                Save Flash Sale
              </button>
            </div>
          )}
        </div>
      )}

      {/* List */}
      {!loading && !showForm && (
        <div className="bg-white border border-ocean-border rounded-2xl p-6 shadow-lg">
          {activeTab === 'hero' && (
            <div className="space-y-4">
              {heroes.length === 0 ? (
                <p className="text-center text-ocean-gray py-8">No hero content yet. Click "Add New" to create one.</p>
              ) : (
                heroes.map((hero) => (
                  <div key={hero._id} className="flex items-center justify-between p-4 border border-ocean-border rounded-lg">
                    <div>
                      <div className="font-semibold text-ocean-darkGray">{hero.title} / {hero.subtitle}</div>
                      <div className="text-sm text-ocean-gray">{hero.description?.substring(0, 50)}...</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hero.isActive ? (
                        <Eye size={18} className="text-green-500" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                      <button onClick={() => editItem(hero)} className="p-2 hover:bg-ocean-lightest rounded">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteItem(hero._id)} className="p-2 hover:bg-red-50 rounded text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              {features.length === 0 ? (
                <p className="text-center text-ocean-gray py-8">No features yet. Click "Add New" to create one.</p>
              ) : (
                features.map((feature) => (
                  <div key={feature._id} className="flex items-center justify-between p-4 border border-ocean-border rounded-lg">
                    <div>
                      <div className="font-semibold text-ocean-darkGray">{feature.title}</div>
                      <div className="text-sm text-ocean-gray">{feature.description?.substring(0, 50)}...</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.isActive ? (
                        <Eye size={18} className="text-green-500" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                      <button onClick={() => editItem(feature)} className="p-2 hover:bg-ocean-lightest rounded">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteItem(feature._id)} className="p-2 hover:bg-red-50 rounded text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <p className="text-center text-ocean-gray py-8">No testimonials yet. Click "Add New" to create one.</p>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="flex items-center justify-between p-4 border border-ocean-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-ocean-darkGray">{testimonial.name} - {testimonial.role}</div>
                        <div className="text-sm text-ocean-gray">{testimonial.text?.substring(0, 50)}...</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {testimonial.isActive ? (
                        <Eye size={18} className="text-green-500" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                      <button onClick={() => editItem(testimonial)} className="p-2 hover:bg-ocean-lightest rounded">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteItem(testimonial._id)} className="p-2 hover:bg-red-50 rounded text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'flash-sale' && (
            <div className="space-y-4">
              {flashSales.length === 0 ? (
                <p className="text-center text-ocean-gray py-8">No flash sales yet. Click "Add New" to create one.</p>
              ) : (
                flashSales.map((flashSale) => (
                  <div key={flashSale._id} className="flex items-center justify-between p-4 border border-ocean-border rounded-lg">
                    <div>
                      <div className="font-semibold text-ocean-darkGray">{flashSale.title}</div>
                      <div className="text-sm text-ocean-gray">
                        Ends: {new Date(flashSale.endDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {flashSale.isActive ? (
                        <Eye size={18} className="text-green-500" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                      <button onClick={() => editItem(flashSale)} className="p-2 hover:bg-ocean-lightest rounded">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteItem(flashSale._id)} className="p-2 hover:bg-red-50 rounded text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

