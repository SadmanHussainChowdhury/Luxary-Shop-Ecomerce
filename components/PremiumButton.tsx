'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface PremiumButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function PremiumButton({ href, children, className = '' }: PremiumButtonProps) {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(217, 119, 6, 0.4)' }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  )
}

