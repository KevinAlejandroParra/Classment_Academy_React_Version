"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSchool,
  faUserGear,
  faChalkboardTeacher,
  faHome,
  faUser,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
}

const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 10 },
}

const buttonTap = {
  scale: 0.98,
}

const AdminDashboard = () => {
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

        // Verificar si el usuario es administrador (role_id: 3)
        if (data.user.role !== 3) {
          router.push("/")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const menuItems = [
    {
      title: "Gestión de Escuelas",
      icon: faSchool,
      description: "Administrar escuelas, crear nuevas y gestionar existentes",
      path: "/admin/schools",
    },
    {
      title: "Gestión de Coordinadores",
      icon: faUserGear,
      description: "Administrar permisos y cuentas de coordinadores",
      path: "/admin/coordinators",
    },
    {
      title: "Reportes y Estadísticas",
      icon: faChartBar,
      description: "Ver reportes de rendimiento y estadísticas del sistema",
      path: "/admin/reports",
    },
  ]

  if (!user) return null

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen w-full relative overflow-hidden bg-black"
    >
      <Particles />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          </div>
          <motion.button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 px-4 py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>{user?.user_name} {user?.user_lastname}</span>
          </motion.button>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                  <FontAwesomeIcon icon={item.icon} className="text-2xl text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </motion.div>
  )
}

export default AdminDashboard 