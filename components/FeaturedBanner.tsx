'use client'

import { motion } from 'framer-motion'
import { Sparkles, Gift, TrendingUp, Grid } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const iconMap: Record<string, any> = {
  Sparkles, Gift, TrendingUp, Grid,
}

export default function FeaturedBanner() {
  const [features, setFeatures] = useState<any[]>([])

  useEffect(() => {
    async function loadFeatures() {
      try {
        const res = await fetch('/api/features')
        const data = await res.json()
        if (data.features) {
          setFeatures(data.features)
        }
      } catch (error) {
        console.error('Failed to load features:', error)
      }
    }
    loadFeatures()
  }, [])

  if (features.length === 0) return null
  return (
    <section className="py-16 bg-gradient-to-r from-premium-darkBlue via-premium-royalBlue to-premium-darkBlue relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(217, 119, 6, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Grid
            return (
              <Link key={feature._id || i} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white hover:bg-white/20 transition cursor-pointer h-full"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color || 'from-premium-gold to-premium-amber'} flex items-center justify-center mb-6`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/80 mb-4">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 text-white hover:text-premium-amber font-medium transition group">
                    Explore
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

