"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear partículas
    const particlesArray: Particle[] = []
    const numberOfParticles = Math.min(window.innerWidth / 10, 100) // Ajustar según el ancho de la pantalla

    const primaryColor = theme === "dark" ? "255, 215, 0" : "255, 215, 0" // Amarillo en ambos temas
    const secondaryColor = theme === "dark" ? "255, 255, 255" : "0, 0, 0" // Blanco en dark, negro en light

    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 3 + 1
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speedX = Math.random() * 0.5 - 0.25
      const speedY = Math.random() * 0.5 - 0.25
      const color =
        Math.random() > 0.8
          ? `rgba(${primaryColor}, ${Math.random() * 0.3 + 0.1})`
          : `rgba(${secondaryColor}, ${Math.random() * 0.1 + 0.05})`

      particlesArray.push({ x, y, size, speedX, speedY, color })
    }

    // Animar partículas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Mover partículas
        p.x += p.speedX
        p.y += p.speedY

        // Rebote en los bordes
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />
}

