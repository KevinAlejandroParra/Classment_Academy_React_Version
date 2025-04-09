"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Particles } from "@/components/particles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSignIn,
  faUserPlus,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons"

interface User {
  role: number
  name: string
  lastname: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getDashboardLink = () => {
    switch (user?.role) {
      case 1:
        return "/student/dashboard"
      case 3:
        return "/admin/dashboard"
      case 4:
        return "/coordinator/dashboard"
      default:
        return "/"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-black">
      <Particles />
      <div className="container mx-auto px-4 z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Classment Academy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Plataforma educativa para gestionar y mejorar el aprendizaje
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[rgb(var(--primary-rgb))] text-black rounded-lg font-semibold hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
              >
                <FontAwesomeIcon icon={faTachometerAlt} />
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[rgb(var(--primary-rgb))] text-black rounded-lg font-semibold hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                >
                  <FontAwesomeIcon icon={faSignIn} />
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[rgb(var(--primary-rgb))] text-white rounded-lg font-semibold hover:bg-[rgba(var(--primary-rgb),0.1)] transition-colors"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  Registrarse
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

