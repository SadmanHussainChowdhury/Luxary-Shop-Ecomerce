'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus, Search, Edit, Trash2, Package, DollarSign, PackageCheck, X, Image as ImageIcon } from 'lucide-react'

export default function AdminProductsPage() {
  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({ title: '', slug: '', price: 0, countInStock: 0, image: '', description: '', category: '', brand: '', isFeatured: false })
  const [message, setMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories?active=true')
        const data = await res.json()
        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  async function load() {
    setLoading(true)
    try {
      // Fetch all products with a large page size
      const res = await fetch('/api/products?pageSize=1000', { cache: 'no-store' })
      const data = await res.json()
      setItems(data.items || [])
      setFilteredItems(data.items || [])
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    load()
    // Auto-refresh every 60 seconds
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items)
      return
    }
    const filtered = items.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredItems(filtered)
  }, [searchQuery, items])

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      const autoSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setForm((f) => ({ ...f, slug: autoSlug }))
    }
  }, [form.title])

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    
    // Validate required fields
    if (!form.title || !form.slug || !form.price || form.price <= 0) {
      setMessage('Please fill in all required fields with valid values')
      setLoading(false)
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          images: form.image ? [{ url: form.image }] : [],
          rating: 0,
          numReviews: 0,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error || 'Failed to create product')
        setLoading(false)
        toast.error(data.error || 'Failed to create product')
        return
      }
      setMessage(`Product "${form.title}" created successfully! It will now appear in the product section.`)
      toast.success(`Product "${form.title}" created successfully!`)
      setForm({ title: '', slug: '', price: 0, countInStock: 0, image: '', description: '', category: '', brand: '', isFeatured: false })
      setShowForm(false)
      setLoading(false)
      // Reload products list
      await load()
      // Show link to view product
      setTimeout(() => {
        toast.success('Product added! Visit /products to see it in the catalog.', { duration: 5000 })
      }, 1000)
    } catch (error) {
      setMessage('An error occurred while creating the product')
      setLoading(false)
      toast.error('Failed to create product')
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This action cannot be undone.')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Delete failed')
      return
    }
    toast.success('Product deleted')
    load()
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-premium-gold via-premium-amber to-premium-gold rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Package size={32} />
              Product Management
            </h1>
            <p className="text-white/90">Manage your product catalog</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{items.length}</div>
            <div className="text-white/80 text-sm">Total Products</div>
          </div>
        </div>
      </motion.div>

      {/* Search and Actions Bar */}
      <div className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
            />
          </div>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-premium-gold to-premium-amber text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Add Product'}
          </motion.button>
        </div>
      </div>

      {/* Create Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-ocean-darkGray flex items-center gap-2">
                <Plus size={24} />
                New Product
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-ocean-lightest rounded-lg transition"
              >
                <X size={20} className="text-ocean-gray" />
              </button>
            </div>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                  message.includes('success') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                <span className="text-xl">{message.includes('success') ? '✓' : '⚠'}</span>
                <div className="flex-1">
                  <p className="font-medium mb-1">{message.includes('success') ? 'Success!' : 'Error'}</p>
                  <p className="text-sm">{message}</p>
                  {message.includes('success') && (
                    <div className="mt-3 flex gap-2">
                      <Link
                        href="/products"
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        View in Products →
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            <form onSubmit={createProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    placeholder="Product title"
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">
                    Slug * (auto-generated from title)
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                    placeholder="product-slug"
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                  <p className="text-xs text-ocean-gray mt-1">Used in product URL. Auto-generates from title if left empty.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Price *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                      required
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Stock *</label>
                  <div className="relative">
                    <PackageCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                    <input
                      type="number"
                      min={0}
                      value={form.countInStock}
                      onChange={(e) => setForm((f) => ({ ...f, countInStock: Number(e.target.value) }))}
                      required
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.slug} value={cat.name}>
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-ocean-gray mt-1">Or leave empty to set manually</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="Brand"
                    className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
              </div>
              
              {/* Featured Checkbox */}
              <div className="bg-ocean-lightest rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="w-5 h-5 rounded border-ocean-border text-premium-gold focus:ring-premium-gold cursor-pointer"
                  />
                  <div>
                    <div className="font-medium text-ocean-darkGray">Featured Product</div>
                    <div className="text-xs text-ocean-gray">Show this product in the featured section</div>
                  </div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Image URL *</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
                  <input
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition"
                  />
                </div>
                {form.image && (
                  <div className="mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={form.image} 
                      alt="Preview" 
                      className="h-32 w-32 rounded-lg object-cover border border-ocean-border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop'
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-ocean-gray mt-1">Enter a valid image URL. Product needs an image to display properly.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-darkGray mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Product description"
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-ocean-border rounded-lg focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition resize-none"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-premium-gold to-premium-amber text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-ocean-border rounded-xl p-12 text-center">
          <Package size={48} className="mx-auto text-ocean-gray mb-4" />
          <p className="text-ocean-gray text-lg">
            {searchQuery ? 'No products found' : 'No products yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-ocean-border rounded-xl p-4 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop'}
                    alt={p.title}
                    className="h-20 w-20 rounded-xl object-cover border border-ocean-border"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-ocean-darkGray mb-1">{p.title}</h3>
                    <p className="text-sm text-ocean-gray mb-2">{p.slug}</p>
                    <div className="flex gap-2 flex-wrap">
                      {p.category && (
                        <span className="inline-block px-2 py-1 bg-ocean-lightest text-ocean-darkGray rounded text-xs font-medium">
                          {p.category}
                        </span>
                      )}
                      {p.brand && (
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {p.brand}
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="inline-block px-2 py-1 bg-ocean-lightest text-ocean-darkGray rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-xl text-premium-gold">${p.price}</div>
                    <div className="flex items-center gap-2 text-sm text-ocean-gray mt-1">
                      <PackageCheck size={14} />
                      <span>{p.countInStock} in stock</span>
                    </div>
                  </div>
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium text-sm border border-green-200"
                    title="View on site"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/products/${p._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition font-medium"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <motion.button
                    onClick={() => deleteProduct(p._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium border border-red-200"
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
