"use client"
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import { motion } from 'framer-motion'

export interface ProductCardProps {
  product: {
    _id: string
    title: string
    slug: string
    price: number
    images?: { url: string; alt?: string }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop'
  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 12px 35px -12px rgba(0,0,0,0.28)' }}
      transition={{ duration: 0.35 }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square w-full bg-ink-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link href={`/product/${product.slug}`} className="font-medium hover:underline">
            {product.title}
          </Link>
          <span className="font-semibold">${product.price}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <AddToCartButton slug={product.slug} title={product.title} price={product.price} image={product.images?.[0]?.url} />
        </div>
      </div>
    </motion.div>
  )
}


