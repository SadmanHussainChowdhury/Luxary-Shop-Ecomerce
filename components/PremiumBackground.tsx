'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number | null = null
    let isAnimating = true

    const resize = () => {
      if (canvas && typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    
    if (typeof window !== 'undefined') {
      resize()
      window.addEventListener('resize', resize)
    }

    // Premium particle system with gold accents
    class Particle {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string
      glow: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 3 + 1
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = (Math.random() - 0.5) * 0.8
        this.glow = Math.random()
        const colors = [
          `rgba(30, 58, 138, ${Math.random() * 0.6 + 0.3})`,
          `rgba(59, 130, 246, ${Math.random() * 0.6 + 0.3})`,
          `rgba(217, 119, 6, ${Math.random() * 0.5 + 0.2})`, // Gold accent
          `rgba(251, 191, 36, ${Math.random() * 0.4 + 0.15})`, // Amber glow
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.glow += 0.02

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        try {
          // Glow effect - extract opacity from color and reduce it
          let glowColor = this.color
          const rgbaMatch = this.color.match(/rgba?\(([^)]+)\)/)
          if (rgbaMatch) {
            const parts = rgbaMatch[1].split(',')
            if (parts.length === 4) {
              const opacity = parseFloat(parts[3].trim())
              const newOpacity = Math.max(0.05, opacity * 0.3)
              glowColor = `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${newOpacity})`
            }
          }
          
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = glowColor
          ctx.fill()

          // Main particle
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = this.color
          ctx.shadowBlur = 15
          ctx.shadowColor = this.color
          ctx.fill()
          ctx.shadowBlur = 0
        } catch (e) {
          // Skip drawing if there's an error
          console.warn('Draw error:', e)
        }
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!isAnimating || !ctx || !canvas) return
      
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw premium connections with gradient
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              try {
                const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
                const opacity = (1 - distance / 150) * 0.3
                
                // Extract and modify color opacity
                const extractColor = (colorStr: string, newOpacity: number) => {
                  const match = colorStr.match(/rgba?\(([^)]+)\)/)
                  if (match) {
                    const parts = match[1].split(',')
                    if (parts.length >= 3) {
                      const r = parts[0].trim()
                      const g = parts[1].trim()
                      const b = parts[2].trim()
                      return `rgba(${r}, ${g}, ${b}, ${newOpacity})`
                    }
                  }
                  return colorStr
                }
                
                gradient.addColorStop(0, extractColor(p1.color, opacity))
                gradient.addColorStop(1, extractColor(p2.color, opacity))

                ctx.beginPath()
                ctx.strokeStyle = gradient
                ctx.lineWidth = 2
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
              } catch (e) {
                // Skip gradient if there's an error - fallback to simple line
                ctx.beginPath()
                ctx.strokeStyle = `rgba(217, 119, 6, ${(1 - distance / 150) * 0.3})`
                ctx.lineWidth = 2
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
              }
            }
          })
        })

        particles.forEach((p) => {
          p.update()
          p.draw()
        })

        animationFrameId = requestAnimationFrame(animate)
      } catch (e) {
        console.error('Animation error:', e)
      }
    }

    animate()

    return () => {
      isAnimating = false
      if (animationFrameId !== null && typeof window !== 'undefined') {
        cancelAnimationFrame(animationFrameId)
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resize)
      }
    }
  }, [])

  return (
    <>
      {/* Ultra Premium Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Main gradient animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 50%, transparent 100%)',
              'radial-gradient(circle at 100% 100%, rgba(217, 119, 6, 0.3) 0%, rgba(30, 58, 138, 0.4) 50%, transparent 100%)',
              'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.35) 0%, rgba(251, 191, 36, 0.25) 50%, transparent 100%)',
              'radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 50%, transparent 100%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Premium floating orbs with gold accents */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
              background:
                i === 0
                  ? 'radial-gradient(circle, rgba(30, 58, 138, 0.3), transparent)'
                  : i === 1
                  ? 'radial-gradient(circle, rgba(217, 119, 6, 0.25), transparent)'
                  : i === 2
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent)'
                  : i === 3
                  ? 'radial-gradient(circle, rgba(251, 191, 36, 0.2), transparent)'
                  : 'radial-gradient(circle, rgba(96, 165, 250, 0.2), transparent)',
            }}
            animate={{
              x: [
                0, 
                (i % 2 === 0 ? 1 : -1) * (100 + i * 20), 
                (i % 2 === 0 ? -1 : 1) * (80 + i * 15), 
                0
              ],
              y: [
                0, 
                (i % 3 === 0 ? 1 : -1) * (80 + i * 15), 
                (i % 3 === 0 ? -1 : 1) * (100 + i * 20), 
                0
              ],
              scale: [1, 1.3, 0.8, 1],
              opacity: [0.3, 0.5, 0.4, 0.3],
            }}
            transition={{
              duration: 25 + i * 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 3,
            }}
          />
        ))}

        {/* Premium grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(217, 119, 6, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(217, 119, 6, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            backgroundPosition: ['0 0', '60px 60px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(251, 191, 36, 0.3) 50%, transparent 60%)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 2,
          }}
        />
      </div>

      {/* Premium particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10 opacity-50"
        style={{ mixBlendMode: 'screen' }}
      />
    </>
  )
}

