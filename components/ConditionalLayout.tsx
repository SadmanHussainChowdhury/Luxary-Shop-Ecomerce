'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import PageTransition from '@/components/PageTransition'
import RouteProgress from '@/components/RouteProgress'
import WorldClassHeader from '@/components/AliExpressHeader'
import ProductComparison from '@/components/ProductComparison'
import PremiumFooter from '@/components/PremiumFooter'

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  // For admin routes, don't show header and footer
  if (isAdminRoute) {
    return (
      <>
        <ProductComparison />
        <div className="min-h-screen flex flex-col relative z-0">
          <RouteProgress />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </>
    )
  }

  // For regular routes, show header and footer
  return (
    <>
      <ProductComparison />
      <div className="min-h-screen flex flex-col relative z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <RouteProgress />
        <WorldClassHeader />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <PremiumFooter />
      </div>
    </>
  )
}

