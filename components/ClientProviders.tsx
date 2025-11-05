'use client'

import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster richColors position="top-center" />
    </SessionProvider>
  )
}


