"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSchool,
  faBook,
  faChartLine,
  faComments,
  faHome,
  faGraduationCap,
  faClock,
  faDollarSign,
  faUser,
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

const StudentDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

        if (data.user.role_id !== 1) {
          router.push("/")
          return
        }

        setUser(data.user)
        
        // Obtener los cursos disponibles
        const coursesResponse = await fetch("http://localhost:5000/api/courses")
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData.data)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error:", error)
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
      title: "Explorar Escuelas",
      icon: faSchool,
      description: "Descubre las escuelas disponibles y sus programas",
      path: "/student/schools",
    },
    {
      title: "Mis Cursos",
      icon: faBook,
      description: "Accede a tus cursos y material de estudio",
      path: "/student/courses",
    },
    {
      title: "Mi Progreso",
      icon: faChartLine,
      description: "Visualiza tu avance y calificaciones",
      path: "/student/progress",
    },
    {
      title: "Comunicaciones",
      icon: faComments,
      description: "Mensajes y notificaciones de tus coordinadores",
      path: "/student/messages",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

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
            <h1 className="text-2xl font-bold text-white">Panel de Estudiante</h1>
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
        {/* Menú de navegación */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center gap-4">
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

        {/* Sección de Cursos Disponibles */}
        <motion.div
          variants={containerVariants}
          className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Cursos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-black/30 rounded-xl p-6 border border-[rgba(var(--primary-rgb),0.2)] hover:border-[rgba(var(--primary-rgb),0.4)] transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-xl text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{course.course_name}</h3>
                    <p className="text-gray-400 text-sm">{course.course_description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faClock} className="text-[rgb(var(--primary-rgb))]" />
                    <span>{course.course_duration} horas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faDollarSign} className="text-[rgb(var(--primary-rgb))]" />
                    <span>${course.course_price}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="w-full py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
                  onClick={() => router.push(`/student/courses/${course.course_id}`)}
                >
                  Ver Detalles
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}

export default StudentDashboard 