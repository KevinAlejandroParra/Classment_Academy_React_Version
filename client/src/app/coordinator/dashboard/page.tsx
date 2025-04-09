"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUserGraduate,
  faSchool,
  faClipboardCheck,
  faChartBar,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons"

const CoordinatorDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message)

        // Verificar si el ususario es coordinador
        if (data.user.role !== 4) {
          router.push("/")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Error de autenticación:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const menuItems = [
    {
      title: "Gestión de Estudiantes",
      icon: faUserGraduate,
      description: "Administrar estudiantes, ver progreso y gestionar inscripciones",
      path: "/coordinator/students",
    },
    {
      title: "Mi Escuela",
      icon: faSchool,
      description: "Gestionar información y cursos de tu escuela",
      path: "/coordinator/school",
    },
    {
      title: "Control de Asistencia",
      icon: faClipboardCheck,
      description: "Registrar y gestionar asistencias de estudiantes",
      path: "/coordinator/attendance",
    },
    {
      title: "Reportes",
      icon: faChartBar,
      description: "Generar y visualizar reportes de progreso y asistencia",
      path: "/coordinator/reports",
    },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Coordinación</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOut} />
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg">
                  <FontAwesomeIcon icon={item.icon} className="text-2xl text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              </div>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default CoordinatorDashboard 