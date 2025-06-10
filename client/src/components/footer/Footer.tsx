"use client"

import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGraduationCap,
  faSchool,
  faUserGraduate,
  faChalkboardTeacher,
  faBookOpen,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { useState, useEffect } from "react"

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="relative bg-[rgba(var(--foreground-rgb),0.03)] border-t border-[rgba(var(--foreground-rgb),0.1)]">
      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">Contáctanos</h2>
              <p className="text-[rgb(var(--foreground-rgb))] opacity-80">
                Visítanos en nuestras instalaciones o contáctanos a través de nuestros canales oficiales.
              </p>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Dirección</p>
                  <p className="font-semibold">CEET SENA Complejo Sur, Bogotá, Colombia</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Teléfono</p>
                  <a href="tel:+573001234567" className="font-semibold hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    +57 300 123 4567
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="opacity-70">Lunes - Viernes:</span>
                  <span className="font-semibold">8:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="opacity-70">Sábados:</span>
                  <span className="font-semibold">9:00 AM - 1:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="opacity-70">Domingos:</span>
                  <span className="font-semibold">Cerrado</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Navegación</h3>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/courses" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Cursos
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/schools" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Escuelas
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/about" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Nosotros
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/contact" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Contacto
                  </Link>
                </motion.li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/blog" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Blog
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/faq" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    FAQ
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/privacy" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Privacidad
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link href="/terms" className="text-[rgb(var(--foreground-rgb))] opacity-80 hover:text-[rgb(var(--primary-rgb))] transition-colors">
                    Términos
                  </Link>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Bottom */}
      <div className="border-t border-[rgba(var(--foreground-rgb),0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGraduationCap} className="h-6 w-6 text-[rgb(var(--primary-rgb))]" />
              <span className="text-lg font-semibold">Classment Academy</span>
            </div>
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} Classment Academy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showScrollTop ? 1 : 0, y: showScrollTop ? 0 : 20 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-[rgb(var(--primary-rgb))] text-white flex items-center justify-center shadow-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
      >
        <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5" />
      </motion.button>
    </footer>
  )
}

export default Footer 