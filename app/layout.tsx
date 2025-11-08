import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import ClientProviders from '@/components/ClientProviders'
import PageTransition from '@/components/PageTransition'
import RouteProgress from '@/components/RouteProgress'
import WorldClassHeader from '@/components/AliExpressHeader'
import PremiumBackground from '@/components/PremiumBackground'
import ProductComparison from '@/components/ProductComparison'
import PremiumFooter from '@/components/PremiumFooter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Luxury Shop - Premium Online Shopping',
  description: 'Shop the latest electronics, fashion, home & garden, and more at great prices.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>
        <PremiumBackground />
        <ProductComparison />
        <div className="min-h-screen flex flex-col relative z-0">
          <RouteProgress />
          <WorldClassHeader />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <PremiumFooter />
        </div>
        </ClientProviders>
      </body>
    </html>
  )
}


