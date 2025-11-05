'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()
        if (data.testimonials) {
          setTestimonials(data.testimonials)
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      }
    }
    loadTestimonials()
  }, [])

  if (testimonials.length === 0) return null
  return (
    <section className="py-16 bg-gradient-to-b from-white/60 to-ocean-lightest relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-ocean-darkGray mb-4">
            What Our Customers Say
          </h2>
          <p className="text-ocean-gray text-lg">
            Join thousands of satisfied customers worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition relative"
            >
              <Quote className="absolute top-4 right-4 text-premium-gold/20" size={40} />
              
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-premium-gold"
                />
                <div>
                  <div className="font-bold text-ocean-darkGray">{testimonial.name}</div>
                  <div className="text-sm text-ocean-gray">{testimonial.role}</div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} size={18} className="fill-premium-amber text-premium-amber" />
                ))}
              </div>

              <p className="text-ocean-gray leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

