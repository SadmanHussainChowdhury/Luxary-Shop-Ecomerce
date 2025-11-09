'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Upload, RefreshCw } from 'lucide-react'

const DEFAULT_SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop'

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

export default function AdminEditProductPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({
    title: '',
    slug: '',
    price: 0,
    countInStock: 0,
    description: '',
    image: '',
    isFeatured: false,
    category: '',
    brand: '',
    imageFile: null as File | null,
  })

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
          image: data.images?.[0]?.url || DEFAULT_SAMPLE_IMAGE,
          isFeatured: !!data.isFeatured,
          category: data.category || '',
          brand: data.brand || '',
          imageFile: null,
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
    const { imageFile, ...payload } = form
    const body = {
      title: form.title,
      slug: form.slug,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      description: form.description,
      images: (payload.image || DEFAULT_SAMPLE_IMAGE) ? [{ url: payload.image || DEFAULT_SAMPLE_IMAGE }] : [],
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
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Image</label>
            <input
              value={form.image}
              onChange={(e) => setForm((f: any) => ({ ...f, image: e.target.value, imageFile: null }))}
              className="w-full rounded border border-ocean-border px-3 py-2"
              placeholder="Enter image URL or upload a file"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="productImageFile"
              className="inline-flex items-center gap-2 bg-ocean-blue text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-ocean-deep transition"
            >
              <Upload size={18} /> Upload File
              <input
                type="file"
                id="productImageFile"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    const dataUrl = await fileToDataUrl(file)
                    setForm((prev: any) => ({ ...prev, image: dataUrl, imageFile: file }))
                    toast.success('Image ready to save')
                  } catch (error) {
                    console.error('Failed to read file', error)
                    toast.error('Failed to read image file')
                  }
                }}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setForm((prev: any) => ({ ...prev, image: DEFAULT_SAMPLE_IMAGE, imageFile: null }))}
              className="inline-flex items-center gap-2 px-4 py-2 border border-ocean-border rounded-lg hover:bg-ocean-lightest"
            >
              <RefreshCw size={18} /> Use Sample
            </button>
            <button
              type="button"
              onClick={() => setForm((prev: any) => ({ ...prev, image: '', imageFile: null }))}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
            >
              Clear
            </button>
          </div>
          {form.image && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt="Preview"
                className="h-36 w-36 rounded-lg border border-ocean-border object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_SAMPLE_IMAGE
                }}
              />
            </div>
          )}
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
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="w-full rounded border border-ocean-border px-4 py-3 font-medium hover:bg-ocean-lightest"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}


