"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGraduationCap,
  faCalendarAlt,
  faChartLine,
  faUser,
  faHome,
  faBook,
  faExclamationTriangle,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"
import Swal from "sweetalert2"

interface Course {
  course_id: string
  course_name: string
  course_description: string
  course_image?: string
}

interface Enrollment {
  enrollment_id: string
  course_id: string
  plan_type: string
  start_date: string
  end_date: string
  status: string
  progress: number
  course: Course
}

// Actualizada para manejar diferentes estructuras de usuario
interface User {
  id?: string          // Nueva API
  user_id?: string     // API antigua
  user_name?: string
  user_lastname?: string
  first_name?: string  // Nueva API posible
  last_name?: string   // Nueva API posible
  name?: string        // Otra posible estructura 
  email: string
  role_id?: number
}

const UserEnrollmentsPage = () => {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Verificamos la existencia del token
        const token = localStorage.getItem("token")
        if (!token) {
          console.log("No token found, redirecting to login")
          router.push("/login")
          return
        }

        // 1. Obtenemos datos del usuario
        console.log("Fetching user data...")
        const userResponse = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!userResponse.ok) {
          const errorData = await userResponse.json()
          console.error("Error fetching user data:", errorData)
          throw new Error(errorData.message || "Error al autenticar usuario")
        }

        const userData = await userResponse.json()
        console.log("User data raw response:", userData)

        // Extraemos el usuario dependiendo de la estructura
        let userObject: User | null = null
        
        if (userData && userData.user) {
          userObject = userData.user
          console.log("User found in userData.user:", userObject)
        } else if (userData && (userData.id || userData.user_id)) {
          userObject = userData
          console.log("User found directly in userData:", userObject)
        } else {
          console.error("Unknown user data structure:", userData)
          throw new Error("Estructura de datos de usuario inválida")
        }

        // Identificamos el ID del usuario independiente de la estructura
        let userId: string | undefined;
        
        if (userObject) {
          userId = userObject.id || userObject.user_id;
          
          if (!userId) {
            console.error("No user ID found in user data:", userObject)
            throw new Error("No se pudo identificar el ID del usuario")
          }

          console.log(`User ID identified: ${userId}`)
          setUser(userObject)
        } else {
          console.error("User object is null")
          throw new Error("Estructura de datos de usuario inválida")
        }
        
        // 2. Obtenemos matrículas del usuario
        console.log(`Fetching enrollments for user ID: ${userId}...`)
        const enrollmentsResponse = await fetch(
          `http://localhost:5000/api/enrollments/user/${userId}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!enrollmentsResponse.ok) {
          const errorData = await enrollmentsResponse.json()
          console.error("Error fetching enrollments:", errorData)
          throw new Error(errorData.message || "Error al obtener matrículas")
        }

        const enrollmentsData = await enrollmentsResponse.json()
        console.log("Enrollments fetched successfully:", enrollmentsData)
        
        if (!enrollmentsData.data) {
          console.warn("No enrollments data found in API response")
          setEnrollments([])
        } else {
          console.log(`Found ${enrollmentsData.data.length} enrollments`)
          setEnrollments(enrollmentsData.data)
        }

      } catch (error: any) {
        console.error("Error in fetchData:", error)
        setError(error.message || "Error desconocido al cargar los datos")
        
        Swal.fire({
          title: "Error",
          text: error.message || "No se pudieron cargar los datos",
          icon: "error",
          confirmButtonColor: "rgb(var(--primary-rgb))"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Función para obtener el nombre completo del usuario independiente de la estructura
  const getUserFullName = () => {
    if (!user) return "Usuario";
    
    // Diferentes posibilidades según la estructura que venga
    if (user.user_name && user.user_lastname) {
      return `${user.user_name} ${user.user_lastname}`;
    } else if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.name) {
      return user.name;
    } else {
      // Si no hay nombre, usamos el email o algún otro identificador
      return user.email ? user.email.split('@')[0] : "Usuario";
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible"
    
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return "Fecha inválida"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-400'
      case 'completed': return 'text-blue-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'Activo'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return 'Desconocido'
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-[rgba(var(--primary-rgb),0.3)] shadow-lg">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
            <p className="text-white text-xl font-medium">Cargando tus cursos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-red-500/30 shadow-lg max-w-md">
          <div className="flex flex-col items-center justify-center gap-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl" />
            <h2 className="text-xl font-bold text-white">Error al cargar los datos</h2>
            <p className="text-gray-300 text-center">{error}</p>
            <button 
              onClick={() => router.push("/login")}
              className="button-primary mt-4"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Fondo con partículas */}
      <Particles />

      
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg hover:shadow-[rgba(var(--primary-rgb),0.3)] transition-all duration-300"
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Mis Cursos Inscritos</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/profile")}
                className="flex items-center gap-3 px-4 py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>{getUserFullName()}</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Estado vacío */}
        {enrollments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-black/20 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] text-center"
          >
            <FontAwesomeIcon icon={faBook} className="text-[rgb(var(--primary-rgb))] text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No estás inscrito en ningún curso</h2>
            <p className="text-gray-400 mb-6">Explora nuestros cursos disponibles para comenzar tu aprendizaje</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-primary"
              onClick={() => router.push("/courses")}
            >
              Explorar Cursos
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Resumen de estadísticas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-black/20 p-6 rounded-2xl shadow-lg border border-[rgba(var(--primary-rgb),0.4)] flex items-center gap-4"
              >
                <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg">
                  <FontAwesomeIcon icon={faBook} className="text-xl text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{enrollments.length}</h3>
                  <p className="text-gray-400">Cursos inscritos</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-black/20 p-6 rounded-2xl shadow-lg border border-[rgba(var(--primary-rgb),0.4)] flex items-center gap-4"
              >
                <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {enrollments.filter(e => e.status === 'active').length}
                  </h3>
                  <p className="text-gray-400">Cursos activos</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-black/20 p-6 rounded-2xl shadow-lg border border-[rgba(var(--primary-rgb),0.4)] flex items-center gap-4"
              >
                <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg">
                  <FontAwesomeIcon icon={faChartLine} className="text-xl text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {enrollments.length > 0 
                      ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length) 
                      : 0}%
                  </h3>
                  <p className="text-gray-400">Promedio de progreso</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Tarjetas de cursos */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {enrollments.map((enrollment) => (
                <motion.div
                  key={enrollment.enrollment_id}
                  variants={cardVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.3)" }}
                  className="backdrop-blur-xl bg-black/20 rounded-2xl shadow-lg border-2 border-[rgba(var(--primary-rgb),0.4)] overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div className="bg-gradient-to-r from-black to-[rgba(var(--primary-rgb),0.2)] p-6 border-b border-[rgba(var(--primary-rgb),0.2)]">
                    <div className="flex items-start gap-4">
                      <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg shadow-lg">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-xl text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{enrollment.course.course_name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{enrollment.course.course_description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase font-semibold mb-1">Inicio</span>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-[rgb(var(--primary-rgb))]" />
                          <span className="text-sm">{formatDate(enrollment.start_date)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase font-semibold mb-1">Finalización</span>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-[rgb(var(--primary-rgb))]" />
                          <span className="text-sm">{formatDate(enrollment.end_date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase font-semibold mb-1">Progreso</span>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faChartLine} className="text-[rgb(var(--primary-rgb))]" />
                          <span className="text-gray-300">{enrollment.progress || 0}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase font-semibold mb-1">Estado</span>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faBook} className="text-[rgb(var(--primary-rgb))]" />
                          <span className={`${getStatusColor(enrollment.status)}`}>
                            {getStatusText(enrollment.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-800 rounded-full h-2.5 mb-6 overflow-hidden">
                      <div 
                        className="bg-[rgb(var(--primary-rgb))] h-2.5 transition-all duration-700" 
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
                        onClick={() => router.push(`/course/${enrollment.course_id}`)}
                      >
                        Ver Curso
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors font-medium"
                        onClick={() => router.push(`/course/${enrollment.course_id}/classes`)}
                      >
                        Ir a Clases
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </div>
  )
}

export default UserEnrollmentsPage