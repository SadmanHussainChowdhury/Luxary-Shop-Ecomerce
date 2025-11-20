import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import ImageGallery from '@/components/ImageGallery'
import WishlistButton from '@/components/WishlistButton'
import RecentlyViewed from '@/components/RecentlyViewed'
import ProductViewTracker from '@/components/ProductViewTracker'
import RelatedProducts from '@/components/RelatedProducts'
import SocialShare from '@/components/SocialShare'
import ProductReviews from '@/components/ProductReviews'
import { headers } from 'next/headers'

async function fetchProduct(slug: string) {
  const h = headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host')
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/products/${slug}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params)
  const product = await fetchProduct(resolvedParams.slug)
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-ocean-gray">Product not found.</p>
        <Link href="/products" className="inline-flex items-center justify-center rounded border border-ocean-border px-4 py-2 text-ocean-darkGray hover:bg-ocean-lightGray mt-4">Back to products</Link>
      </div>
    )
  }

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop'

  return (
    <div className="relative min-h-screen bg-white/70 backdrop-blur-sm">
      <ProductViewTracker slug={resolvedParams.slug} />
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative">
            <ImageGallery images={product.images || [{ url: imageUrl }]} title={product.title} />
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <WishlistButton slug={product.slug} />
              <SocialShare 
                title={product.title}
                url={`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/product/${product.slug}`}
                description={product.description}
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ocean-darkGray mb-4">{product.title}</h1>
            <p className="mt-2 text-ocean-gray mb-6">{product.description || 'High quality product with excellent features.'}</p>
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-ocean-blue">${product.price}</span>
                <span className="text-lg text-ocean-gray line-through">${(product.price * 1.5).toFixed(2)}</span>
              </div>
              <div className="text-sm text-ocean-gray">Free shipping worldwide</div>
            </div>
            <div className="mb-6 flex gap-3">
              <AddToCartButton slug={product.slug} title={product.title} price={product.price} image={imageUrl} />
              <Link href="/cart" className="inline-flex items-center justify-center rounded border border-ocean-border px-6 py-2 text-ocean-darkGray hover:bg-ocean-lightGray">View cart</Link>
            </div>
            <div className="border-t border-ocean-border pt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ocean-gray">In stock:</span>
                <span className="text-ocean-darkGray font-medium">{product.countInStock} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ocean-gray">Rating:</span>
                <span className="text-ocean-darkGray font-medium">{product.rating || 4.5} ({product.numReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
        <RelatedProducts category={product.category} currentSlug={product.slug} />
        <RecentlyViewed />
        <ProductReviews productId={product._id} productSlug={product.slug} productTitle={product.title} />
      </div>
    </div>
  )
}


