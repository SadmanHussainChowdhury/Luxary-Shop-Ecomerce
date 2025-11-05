'use client'

import { useState, useEffect } from 'react'
import { Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FlashSaleCountdown() {
  const [flashSale, setFlashSale] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    async function loadFlashSale() {
      try {
        const res = await fetch('/api/flash-sale')
        const data = await res.json()
        if (data.flashSale) {
          setFlashSale(data.flashSale)
        }
      } catch (error) {
        console.error('Failed to load flash sale:', error)
      }
    }
    loadFlashSale()
  }, [])

  useEffect(() => {
    if (!flashSale) return

    function calculateTimeLeft() {
      const endDate = new Date(flashSale.endDate).getTime()
      const now = Date.now()
      const difference = endDate - now

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        return { hours, minutes, seconds }
      }
      return { hours: 0, minutes: 0, seconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [flashSale])

  if (!flashSale || !flashSale.isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white py-3 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Zap size={20} className="animate-pulse" />
            <span className="font-bold">{flashSale.title || 'FLASH SALE'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="text-sm">Ends in:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded font-bold min-w-[2ch] text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded font-bold min-w-[2ch] text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded font-bold min-w-[2ch] text-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          <Link
            href={flashSale.buttonLink || '/products?tag=flash'}
            className="bg-white text-red-600 px-4 py-1.5 rounded font-bold hover:bg-white/90 transition text-sm"
          >
            {flashSale.buttonText || 'Shop Now →'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

