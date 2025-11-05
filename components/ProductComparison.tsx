'use client'

import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AliExpressProductCard } from './AliExpressProductCard'

const STORAGE_KEY = 'worldclass_comparison_v1'

export default function ProductComparison() {
  const [products, setProducts] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadComparison()
  }, [])

  useEffect(() => {
    const handleUpdate = () => {
      loadComparison()
    }
    
    window.addEventListener('comparison:updated', handleUpdate)
    
    return () => {
      window.removeEventListener('comparison:updated', handleUpdate)
    }
  }, [])

  async function loadComparison() {
    const slugs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (slugs.length === 0) {
      setProducts([])
      return
    }

    const promises = slugs.map((slug: string) =>
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .catch(() => null)
    )
    const items = (await Promise.all(promises)).filter(Boolean)
    setProducts(items.slice(0, 4)) // Max 4 products
  }

  function removeProduct(slug: string) {
    const slugs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const updated = slugs.filter((s: string) => s !== slug)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    loadComparison()
  }

  function clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    setProducts([])
    setIsOpen(false)
  }

  if (products.length === 0) return null

  return (
    <>
      {/* Floating Comparison Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-premium-gold to-premium-amber text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl z-40 flex items-center gap-2 font-bold"
        >
          Compare ({products.length})
        </motion.button>
      )}

      {/* Comparison Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-premium-gold shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-ocean-darkGray">
                  Compare Products ({products.length})
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-ocean-gray text-white rounded hover:bg-ocean-darkGray"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="relative">
                    <button
                      onClick={() => removeProduct(product.slug)}
                      className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                    >
                      <X size={18} />
                    </button>
                    <AliExpressProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-ocean-lightest">
                      <th className="border border-ocean-border p-3 text-left">Feature</th>
                      {products.map((p) => (
                        <th key={p._id} className="border border-ocean-border p-3 text-center">
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-ocean-border p-3 font-medium">Price</td>
                      {products.map((p) => (
                        <td key={p._id} className="border border-ocean-border p-3 text-center">
                          ${p.price}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-ocean-border p-3 font-medium">Rating</td>
                      {products.map((p) => (
                        <td key={p._id} className="border border-ocean-border p-3 text-center">
                          {p.rating || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-ocean-border p-3 font-medium">Category</td>
                      {products.map((p) => (
                        <td key={p._id} className="border border-ocean-border p-3 text-center">
                          {p.category || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function CompareButton({ slug }: { slug: string }) {
  function addToComparison() {
    const slugs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!slugs.includes(slug) && slugs.length < 4) {
      slugs.push(slug)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
      window.dispatchEvent(new Event('comparison:updated'))
    }
  }

  return (
    <button
      onClick={addToComparison}
      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition"
      title="Add to comparison"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
    </button>
  )
}

