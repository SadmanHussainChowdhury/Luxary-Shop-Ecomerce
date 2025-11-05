'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminEditProductPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({ title: '', slug: '', price: 0, countInStock: 0, description: '', image: '', isFeatured: false, category: '', brand: '' })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`)
        if (!res.ok) {
          toast.error('Failed to load product')
          setLoading(false)
          return
        }
        const data = await res.json()
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          price: data.price || 0,
          countInStock: data.countInStock || 0,
          description: data.description || '',
          image: data.images?.[0]?.url || '',
          isFeatured: !!data.isFeatured,
          category: data.category || '',
          brand: data.brand || '',
        })
      } catch (error) {
        console.error('Failed to load product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const body = {
      title: form.title,
      slug: form.slug,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      description: form.description,
      images: form.image ? [{ url: form.image }] : [],
      isFeatured: !!form.isFeatured,
      category: form.category,
      brand: form.brand,
    }
    const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) return toast.error('Save failed')
    toast.success('Product saved')
    router.push('/admin/products')
  }

  if (loading) return <div className="bg-ocean-lightest min-h-screen flex items-center justify-center">Loading…</div>

  return (
    <div className="bg-ocean-lightest min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-ocean-darkGray">Edit Product</h1>
      <form onSubmit={save} className="bg-white border border-ocean-border rounded max-w-2xl space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Title</label>
            <input value={form.title} onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))} required className="w-full rounded border border-ocean-border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((f: any) => ({ ...f, slug: e.target.value }))} required className="w-full rounded border border-ocean-border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Price</label>
            <input type="number" min={0} value={form.price} onChange={(e) => setForm((f: any) => ({ ...f, price: e.target.value }))} required className="w-full rounded border border-ocean-border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Stock</label>
            <input type="number" min={0} value={form.countInStock} onChange={(e) => setForm((f: any) => ({ ...f, countInStock: e.target.value }))} required className="w-full rounded border border-ocean-border px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm">Image URL</label>
          <input value={form.image} onChange={(e) => setForm((f: any) => ({ ...f, image: e.target.value }))} className="w-full rounded border border-ocean-border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} className="h-28 w-full rounded border border-ocean-border px-3 py-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Category</label>
            <input value={form.category} onChange={(e) => setForm((f: any) => ({ ...f, category: e.target.value }))} className="w-full rounded border border-ocean-border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Brand</label>
            <input value={form.brand} onChange={(e) => setForm((f: any) => ({ ...f, brand: e.target.value }))} className="w-full rounded border border-ocean-border px-3 py-2" />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))} /> Featured</label>
        <div className="flex gap-3">
          <button className="w-full bg-ocean-blue text-white py-3 px-4 rounded font-medium hover:bg-ocean-deep">
            Save Product
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}


