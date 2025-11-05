import { AliExpressProductCard } from '@/components/AliExpressProductCard'
import { headers } from 'next/headers'

async function fetchPremium() {
  const h = headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host')
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/products?tag=premium&pageSize=24`, { cache: 'no-store' })
  if (!res.ok) return { items: [] as any[] }
  return res.json() as Promise<{ items: any[] }>
}

export default async function PremiumCollectionPage() {
  const { items } = await fetchPremium()
  return (
    <div className="bg-ocean-lightGray min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ocean-darkGray">Premium Collection</h1>
            <p className="text-ocean-gray">Handpicked luxurious items crafted with the finest materials</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((p) => (
            <AliExpressProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}


