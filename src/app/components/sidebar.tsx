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

  const navItems: NavItem[] = [
    { name: "INICIO", href: "/", icon: faHome },
    { name: "PERFIL", href: "/profile", icon: faUser },
    { name: "ESCUELAS", href: "/schools", icon: faSchool },
    { name: "CURSOS", href: "/courses", icon: faBook },
    { name: "INFORMACIÓN", href: "/info", icon: faInfoCircle },
    { name: "CONTACTO", href: "/contact", icon: faEnvelope },
  ]

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

