'use client'
import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let animationId: number
    let lastFrame = 0
    const particles: Particle[] = []
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 28 : 48
    const connectionDistance = isMobile ? 90 : 115
    const connectionDistanceSq = connectionDistance * connectionDistance

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string
      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.6 + 0.2
        this.color = Math.random() > 0.5 ? '#06b6d4' : '#f97316'
      }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1
      }
      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fillStyle = this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0')
        ctx!.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle())

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate)
      if (document.hidden || time - lastFrame < 33) return
      lastFrame = time
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < connectionDistanceSq) {
            const opacity = 0.12 * (1 - distSq / connectionDistanceSq)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    animationId = requestAnimationFrame(animate)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize) }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" className="fixed inset-0 pointer-events-none z-0" />
}
