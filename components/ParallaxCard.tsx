'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode } from 'react'

export default function ParallaxCard({ children, maxTilt = 10 }: { children: ReactNode; maxTilt?: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), { stiffness: 120, damping: 14 })
  const ry = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), { stiffness: 120, damping: 14 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    x.set(px)
    y.set(py)
  }

  function handleLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 1000 }}
      className="[transform-style:preserve-3d]"
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="[transform:translateZ(0)]">
        {children}
      </motion.div>
    </motion.div>
  )
}


