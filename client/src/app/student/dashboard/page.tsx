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
  faCheckCircle,
  faUser,
  faCalendarAlt,
  faBell
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"
import Swal from "sweetalert2"

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
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        // Obtener datos del usuario
        const userResponse = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userData = await userResponse.json()
        if (!userResponse.ok) throw new Error(userData.message)

        if (userData.user.role_id !== 1) {
          router.push("/")
          return
        }

        setUser(userData.user)

        // Obtener todos los cursos
        const coursesResponse = await fetch("http://localhost:5000/api/courses")
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.data || [])

        // Obtener cursos inscritos
        const enrolledResponse = await fetch(`http://localhost:5000/api/enrollments/user/${userData.user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const enrolledData = await enrolledResponse.json()
        setEnrolledCourses(enrolledData.data || [])

        // Datos de progreso simulados
        const mockProgressData = enrolledData.data.map((enrollment: any) => ({
          course_id: enrollment.course_id,
          course_name: coursesData.data.find((c: any) => c.course_id === enrollment.course_id)?.course_name || "Curso",
          progress: enrollment.progress || 0,
          completed_classes: Math.floor(Math.random() * 10),
          total_classes: 10,
          last_attendance: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        }))
        setProgressData(mockProgressData)

        // Próximas clases simuladas
        const mockUpcomingClasses = [
          {
            class_id: "1",
            course_id: enrolledData.data[0]?.course_id,
            course_name: coursesData.data.find((c: any) => c.course_id === enrolledData.data[0]?.course_id)?.course_name || "Curso",
            class_title: "Introducción al curso",
            class_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            teacher_name: "Profesor Marco"
          }
        ]
        setUpcomingClasses(mockUpcomingClasses)

        setIsLoading(false)
      } catch (error) {
        console.error("Error:", error)
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos. Por favor intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          background: "rgb(var(--background-rgb))",
          color: "rgb(var(--foreground-rgb))"
        })
        router.push("/login")
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  console.log(enrolledCourses)

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
          <div className="flex items-center gap-4">
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
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Resumen rápido */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                <FontAwesomeIcon icon={faBook} className="text-2xl text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{enrolledCourses.length}</h3>
                <p className="text-gray-400 text-sm">Cursos Inscritos</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {progressData.reduce((acc: number, curr: any) => acc + curr.completed_classes, 0)}
                </h3>
                <p className="text-gray-400 text-sm">Clases Completadas</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {progressData.length > 0
                    ? Math.round(progressData.reduce((acc: number, curr: any) => acc + curr.progress, 0) / progressData.length)
                    : 0}%
                </h3>
                <p className="text-gray-400 text-sm">Progreso Promedio</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{upcomingClasses.length}</h3>
                <p className="text-gray-400 text-sm">Clases Próximas</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Próximas Clases */}
        {upcomingClasses.length > 0 && (
          <motion.div
            variants={containerVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Próximas Clases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingClasses.map((classItem: any, index: number) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-black/30 rounded-xl p-6 border border-[rgba(var(--primary-rgb),0.2)] hover:border-[rgba(var(--primary-rgb),0.4)] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{classItem.class_title}</h3>
                      <p className="text-gray-400 text-sm">{classItem.course_name}</p>
                    </div>
                    <div className="bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] px-3 py-1 rounded-full text-xs">
                      {new Date(classItem.class_date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                    <span>Profesor: {classItem.teacher_name}</span>
                  </div>
                  <motion.button
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    className="w-full py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
                    onClick={() => router.push(`/student/classes/${classItem.class_id}`)}
                  >
                    Ver Detalles
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Menú de navegación */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        >
          {[
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
            }
          ].map((item, index) => (
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
      </main>
    </motion.div>
  )
}

export default StudentDashboard