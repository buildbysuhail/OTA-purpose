"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const colors = ["#D8589F", "#EE4523", "#FBE75D", "#4FC5DF", "#FF9933", "#66FF66", "#9966FF"]

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  opacity: number
}

export default function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: -10,
        radius: Math.random() * 5 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 1,
        opacity: 1,
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles
      if (particles.length < 100) {
        particles.push(createParticle())
      }

      particles.forEach((particle, index) => {
        particle.y += particle.speed
        particle.opacity -= 0.005

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Remove particles that are off screen or fully transparent
        if (particle.y > canvas.height || particle.opacity <= 0) {
          particles.splice(index, 1)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        // background: "linear-gradient(to bottom right, #9333ea, #3b82f6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        style={{
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "3rem",
          textAlign: "center",
          padding: "0 1rem",
          zIndex: 10,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Welcome to the Confetti Party! */}
      </motion.div>
      {/* <motion.button
        style={{
          padding: "1rem 2rem",
          backgroundColor: "white",
          color: "#9333ea",
          borderRadius: "9999px",
          fontWeight: 600,
          fontSize: "1.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "none",
          cursor: "pointer",
          zIndex: 10,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        Enjoy the Show!
      </motion.button> */}
    </div>
  )
}