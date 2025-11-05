'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} className="relative inline-flex flex-col items-center">
      <span className={`transition-colors ${active ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'}`}>{children}</span>
      <motion.span
        layout
        initial={false}
        animate={{ width: active ? '100%' : '0%' }}
        transition={{ duration: 0.25 }}
        className="mt-1 h-0.5 w-full rounded-full bg-ink-900"
      />
    </Link>
  )
}


