'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function RouteProgress() {
  const pathname = usePathname()
  const controls = useAnimation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timeout1: any, timeout2: any
    setVisible(true)
    controls.start({ width: '0%' }).then(() => {
      controls.start({ width: '60%' , transition: { duration: 0.25, ease: 'easeOut' } })
      timeout1 = setTimeout(() => controls.start({ width: '90%', transition: { duration: 0.3 } }), 200)
      timeout2 = setTimeout(() => {
        controls.start({ width: '100%', transition: { duration: 0.2 } }).then(() => {
          setTimeout(() => setVisible(false), 150)
        })
      }, 450)
    })
    return () => { clearTimeout(timeout1); clearTimeout(timeout2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!visible) return null
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5">
      <motion.div animate={controls} className="h-full bg-brand-600" />
    </div>
  )
}


