'use client'

import { useEffect, useState } from 'react'
import { AliExpressProductCard } from './AliExpressProductCard'
import Link from 'next/link'

export default function RelatedProducts({ 
  category, 
  currentSlug 
}: { 
  category?: string
  currentSlug: string 
}) {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    loadRelated()
  }, [category, currentSlug])

  async function loadRelated() {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('pageSize', '5')
    
    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()
    
    // Filter out current product
    const related = (data.items || [])
      .filter((p: any) => p.slug !== currentSlug)
      .slice(0, 4)
    
    setProducts(related)
  }

  if (products.length === 0) return null

  return (
    <section className="bg-white/60 backdrop-blur-sm mt-8 relative z-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ocean-darkGray">You May Also Like</h2>
          {category && (
            <Link 
              href={`/products?category=${category}`}
              className="text-premium-gold hover:underline font-medium"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <AliExpressProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

