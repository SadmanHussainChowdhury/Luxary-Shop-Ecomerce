import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import ClientProviders from '@/components/ClientProviders'
import ConditionalLayout from '@/components/ConditionalLayout'

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
          <ConditionalLayout>{children}</ConditionalLayout>
        </ClientProviders>
      </body>
    </html>
  )
}


