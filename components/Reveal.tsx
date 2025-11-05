'use client'

import { motion, useAnimation, type Variants } from 'framer-motion'
import { useEffect } from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
      transition={{ duration: 0.4, delay }} variants={variants}>
      {children}
    </motion.div>
  )
}


