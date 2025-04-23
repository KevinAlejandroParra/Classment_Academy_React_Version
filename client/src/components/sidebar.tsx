"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faUser,
  faSchool,
  faBook,
  faInfoCircle,
  faEnvelope,
  faBars,
  faChevronLeft,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  href: string
  icon: any
}

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoading(false)
          return
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message)

        setUser(data.user)
        setIsLoading(false)
      } catch (error) {
        console.error("Error de autenticación:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getDashboardPath = () => {
    if (!user) return "/login"
    switch (user.role_id) {
      case 1:
        return "/student/dashboard"
      case 3:
        return "/admin/dashboard"
      case 4:
        return "/regulator/dashboard"
      default:
        return "/"
    }
  }

  const getNavItems = () => {
    const commonItems = [
      { name: "INICIO", href: "/", icon: faHome },
      { name: "PERFIL", href: "/profile", icon: faUser },
    ]

    if (!user) return commonItems

    switch (user.role_id) {
      case 1: // Estudiante
        return [
          ...commonItems,
          { name: "ESCUELAS", href: "/student/schools", icon: faSchool },
          { name: "MIS CURSOS", href: "/student/dashboard", icon: faBook },
          { name: "CONTACTO", href: "/contact", icon: faEnvelope },
        ]
      case 2: // Profesor
        return [
          ...commonItems,
          { name: "MI DASHBOARD", href: "/teacher/dashboard", icon: faBook },
          { name: "CONTACTO", href: "/contact", icon: faEnvelope },
        ]
      case 3: // Administrador
        return [
          ...commonItems,
          { name: "MI ESCUELA", href: "/admin/schools", icon: faSchool },
          { name: "MIS CURSOS", href: "/admin/courses", icon: faBook },
          { name: "PANEL DE CONTROL", href: "/admin/dashboard", icon: faInfoCircle },
          { name: "CONTACTO", href: "/contact", icon: faEnvelope },
        ]
      case 4: // Regulador
        return [
          ...commonItems,
          { name: "ESCUELAS", href: "/regulator/schools", icon: faSchool },
          { name: "CURSOS", href: "/regulator/courses", icon: faBook },
          { name: "PANEL DE CONTROL", href: "/regulator/dashboard", icon: faInfoCircle },
          { name: "CONTACTO", href: "/contact", icon: faEnvelope },
        ]
      default:
        return commonItems
    }
  }

  const navItems = getNavItems()

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    setMounted(true)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  if (!mounted) return null

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <>
      {/* Botón de hamburguesa fijo */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
      >
        <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
      </button>

      {/* Overlay para cuando el sidebar está expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className="fixed top-0 left-0 h-screen bg-[rgb(var(--background-rgb))] border-r border-[rgba(var(--foreground-rgb),0.1)] shadow-lg z-40 flex flex-col"
        initial={{ x: -280 }}
        animate={{ x: isExpanded ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ width: 280 }}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(var(--foreground-rgb),0.1)] h-16">
          <h1 className="font-bold text-xl text-[rgb(var(--foreground-rgb))]">Classment</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[rgba(var(--foreground-rgb),0.05)] text-[rgb(var(--foreground-rgb))]"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[rgb(var(--primary-rgb))] text-black font-medium"
                        : "hover:bg-[rgba(var(--foreground-rgb),0.05)] text-[rgb(var(--foreground-rgb))]"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-[rgba(var(--foreground-rgb),0.1)]">
          <button
            onClick={toggleTheme}
            className="flex items-center p-3 rounded-lg w-full hover:bg-[rgba(var(--foreground-rgb),0.05)] text-[rgb(var(--foreground-rgb))]"
          >
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} className="h-5 w-5" />
            <span className="ml-3">{theme === "light" ? "MODO OSCURO" : "MODO CLARO"}</span>
          </button>
        </div>
      </motion.div>
    </>
  )
}

