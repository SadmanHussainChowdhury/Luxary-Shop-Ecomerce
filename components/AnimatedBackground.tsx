'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle system
    class Particle {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 0)
        this.y = Math.random() * (canvas?.height ?? 0)
        this.radius = Math.random() * 2 + 1
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})` // ocean-blue with opacity
      }

      update() {
        if (!canvas) return
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 120) * 0.2})`
            ctx.lineWidth = 1
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resize)
      }
    }
  }, [])

  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(30, 58, 138, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(30, 58, 138, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Floating orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: i === 0
                ? 'rgba(30, 58, 138, 0.2)'
                : i === 1
                ? 'rgba(59, 130, 246, 0.15)'
                : 'rgba(96, 165, 250, 0.1)',
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 50, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        ))}

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10 opacity-40"
        style={{ mixBlendMode: 'screen' }}
      />
    </>
  )
}

