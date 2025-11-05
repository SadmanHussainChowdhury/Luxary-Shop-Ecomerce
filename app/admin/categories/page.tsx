'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Plus, Search, Edit, Trash2, Grid, X, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'

const iconOptions = [
  { value: 'Grid', label: 'Grid' },
  { value: 'Zap', label: 'Electronics' },
  { value: 'Shirt', label: 'Fashion' },
  { value: 'Home', label: 'Home' },
  { value: 'Headphones', label: 'Audio' },
  { value: 'ShoppingBag', label: 'Bags' },
  { value: 'Watch', label: 'Accessories' },
  { value: 'Heart', label: 'Beauty' },
  { value: 'Activity', label: 'Sports' },
]

const colorOptions = [
  { value: 'from-blue-500 to-blue-600', label: 'Blue' },
  { value: 'from-pink-500 to-pink-600', label: 'Pink' },
  { value: 'from-purple-500 to-purple-600', label: 'Purple' },
  { value: 'from-green-500 to-green-600', label: 'Green' },
  { value: 'from-amber-500 to-amber-600', label: 'Amber' },
  { value: 'from-red-500 to-red-600', label: 'Red' },
  { value: 'from-rose-500 to-rose-600', label: 'Rose' },
  { value: 'from-indigo-500 to-indigo-600', label: 'Indigo' },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({ 
    name: '', 
    slug: '', 
    displayName: '', 
    icon: '', 
    color: '', 
    description: '', 
    isActive: true,
    order: 0 
  })
  const [message, setMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' })
      if (!res.ok) {
        throw new Error('Failed to load categories')
      }
      const data = await res.json()
      setCategories(data.categories || [])
      setFilteredCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  async function seedCategories() {
    if (!confirm('This will create default categories if none exist. Continue?')) {
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/categories/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to seed categories')
        setLoading(false)
        return
      }
      toast.success(data.message || 'Categories seeded successfully!')
      setLoading(false)
      load()
    } catch (error) {
      toast.error('Failed to seed categories')
      setLoading(false)
    }
  }

  useEffect(() => { 
    load()
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories)
      return
    }
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [searchQuery, categories])

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name && !form.slug && !editingId) {
      const autoSlug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setForm((f) => ({ ...f, slug: autoSlug, displayName: f.displayName || form.name }))
    }
  }, [form.name, editingId])

  async function createCategory(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    
    if (!form.name || !form.slug || !form.displayName) {
      setMessage('Please fill in all required fields')
      setLoading(false)
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Failed to create category')
        setLoading(false)
        toast.error(data.error || 'Failed to create category')
        return
      }
      setMessage(`Category "${form.displayName}" created successfully!`)
      toast.success(`Category "${form.displayName}" created successfully!`)
      setForm({ name: '', slug: '', displayName: '', icon: '', color: '', description: '', isActive: true, order: 0 })
      setShowForm(false)
      setLoading(false)
      load()
    } catch (error) {
      setMessage('Failed to create category')
      setLoading(false)
      toast.error('Failed to create category')
    }
  }

  async function updateCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    
    setMessage(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Failed to update category')
        setLoading(false)
        toast.error(data.error || 'Failed to update category')
        return
      }
      setMessage(`Category "${form.displayName}" updated successfully!`)
      toast.success(`Category "${form.displayName}" updated successfully!`)
      setForm({ name: '', slug: '', displayName: '', icon: '', color: '', description: '', isActive: true, order: 0 })
      setEditingId(null)
      setShowForm(false)
      setLoading(false)
      load()
    } catch (error) {
      setMessage('Failed to update category')
      setLoading(false)
      toast.error('Failed to update category')
    }
  }

  async function deleteCategory(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This will not delete products in this category, but the category will be removed from navigation.`)) {
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete category')
        setLoading(false)
        return
      }
      toast.success(`Category "${name}" deleted successfully!`)
      setLoading(false)
      load()
    } catch (error) {
      toast.error('Failed to delete category')
      setLoading(false)
    }
  }

  function startEdit(category: any) {
    setForm({
      name: category.name,
      slug: category.slug,
      displayName: category.displayName,
      icon: category.icon || '',
      color: category.color || '',
      description: category.description || '',
      isActive: category.isActive !== false,
      order: category.order || 0,
    })
    setEditingId(category._id)
    setShowForm(true)
    setMessage(null)
  }

  function cancelEdit() {
    setForm({ name: '', slug: '', displayName: '', icon: '', color: '', description: '', isActive: true, order: 0 })
    setEditingId(null)
    setShowForm(false)
    setMessage(null)
  }

  async function updateOrder(id: string, direction: 'up' | 'down') {
    const category = categories.find(c => c._id === id)
    if (!category) return
    
    const currentOrder = category.order || 0
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, order: newOrder }),
      })
      if (!res.ok) {
        toast.error('Failed to update order')
        setLoading(false)
        return
      }
      toast.success('Order updated')
      setLoading(false)
      load()
    } catch (error) {
      toast.error('Failed to update order')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ocean-darkGray mb-2">Category Management</h1>
          <p className="text-ocean-gray">Manage product categories and navigation</p>
        </div>
        <div className="flex items-center gap-3">
          {categories.length === 0 && (
            <button
              onClick={seedCategories}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Seed Default Categories
            </button>
          )}
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setForm({ name: '', slug: '', displayName: '', icon: '', color: '', description: '', isActive: true, order: 0 })
              setMessage(null)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-premium-gold text-white rounded-lg hover:bg-premium-amber transition"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
          />
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={cancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-ocean-darkGray">
                  {editingId ? 'Edit Category' : 'Create Category'}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 hover:bg-ocean-lighter rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                    message.includes('success') 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  <span className="text-xl">{message.includes('success') ? '✓' : '⚠'}</span>
                  <p className="text-sm">{message}</p>
                </motion.div>
              )}

              <form onSubmit={editingId ? updateCategory : createCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      placeholder="electronics"
                      className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    />
                    <p className="text-xs text-ocean-gray mt-1">Internal name (used for filtering)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Display Name *</label>
                    <input
                      value={form.displayName}
                      onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                      required
                      placeholder="Electronics"
                      className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    />
                    <p className="text-xs text-ocean-gray mt-1">Displayed in navigation</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Slug *</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase() }))}
                      required
                      placeholder="electronics"
                      className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    />
                    <p className="text-xs text-ocean-gray mt-1">URL-friendly identifier</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Order</label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    />
                    <p className="text-xs text-ocean-gray mt-1">Lower numbers appear first</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Icon</label>
                    <select
                      value={form.icon}
                      onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    >
                      <option value="">None</option>
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Color</label>
                    <select
                      value={form.color}
                      onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    >
                      <option value="">None</option>
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Category description"
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition resize-none"
                  />
                </div>

                <div className="bg-ocean-lightest rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                      className="w-5 h-5 rounded border-ocean-border text-premium-gold focus:ring-premium-gold cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-ocean-darkGray">Active</div>
                      <div className="text-xs text-ocean-gray">Show this category in navigation</div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-premium-gold text-white rounded-lg hover:bg-premium-amber transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId ? 'Update Category' : 'Create Category'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border-2 border-ocean-border rounded-lg hover:bg-ocean-lighter transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      {loading && categories.length === 0 ? (
        <div className="text-center py-12 text-ocean-gray">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <Grid size={48} className="mx-auto text-ocean-gray mb-4" />
          <p className="text-ocean-gray text-lg mb-2">No categories found</p>
          <p className="text-ocean-gray">Create your first category to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCategories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-ocean-border rounded-lg p-4 hover:border-premium-gold transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateOrder(category._id, 'up')}
                      className="p-1 hover:bg-ocean-lighter rounded transition"
                      title="Move up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => updateOrder(category._id, 'down')}
                      className="p-1 hover:bg-ocean-lighter rounded transition"
                      title="Move down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-ocean-darkGray text-lg">{category.displayName}</h3>
                      {category.isActive ? (
                        <Eye size={16} className="text-green-600" title="Active" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" title="Inactive" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-ocean-gray">
                      <span>Slug: {category.slug}</span>
                      <span>Name: {category.name}</span>
                      {category.order !== undefined && <span>Order: {category.order}</span>}
                    </div>
                    {category.description && (
                      <p className="text-sm text-ocean-gray mt-1">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-2 text-ocean-blue hover:bg-ocean-lighter rounded-lg transition"
                    title="Edit"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id, category.displayName)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

