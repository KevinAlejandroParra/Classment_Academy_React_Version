"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faSchool,
  faArrowRight,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faBook,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"
import { Particles } from "@/components/particles"
import { Sidebar } from "@/components/sidebar"

interface School {
  school_id: string
  school_name: string
  school_description: string
  school_email: string
  school_phone: string
  school_address: string
  school_image: string
  courses: Array<{
    course_id: string
    course_name: string
    course_description: string
    course_duration?: string
    teacher?: {
      user_id: string
      user_name: string
      user_lastname: string
      user_email: string
    }
  }>
}

const SchoolsPage = () => {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchools()
  }, [])

  // Trae las escuelas del endpoint
  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No hay sesión activa")
        return
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al cargar las escuelas")
      }

      const data = await response.json()
      setSchools(data.data)
      setError(null)
    } catch (error: any) {
      setError(error.message || "Error al cargar las escuelas")
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudieron cargar las escuelas",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        background: "#1a1a1a",
        color: "#fff",
      })
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Error al cargar las escuelas</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchSchools()}
            className="bg-[rgb(var(--primary-rgb))] text-black px-4 py-2 rounded-lg"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full relative overflow-hidden bg-black"
    >
      <Particles />
      <Sidebar />
      {/* Navbar fijo, ajustado para no superponerse al sidebar */}
      <div className="fixed top-0 left-0 right-0 md:left-64 bg-black/50 backdrop-blur-md z-30 border-b border-[rgba(var(--primary-rgb),0.2)]" style={{ width: "auto" }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Explorar Escuelas</h1>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 pt-24 pb-12 md:pl-64">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center text-white">
            <h2 className="text-2xl mb-4">No hay escuelas disponibles</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <motion.div
                key={school.school_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                    {school.school_image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${school.school_image}`}
                        alt={school.school_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faSchool} className="text-2xl text-black" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">{school.school_name}</h2>
                    <p className="text-sm opacity-70 mb-4 line-clamp-2">{school.school_description}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <FontAwesomeIcon icon={faBook} className="text-[rgb(var(--primary-rgb))]" />
                      <span className="text-sm">{school.courses?.length || 0} cursos</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-[rgb(var(--primary-rgb))]" />
                        <span className="text-sm">{school.school_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[rgb(var(--primary-rgb))]" />
                        <span className="text-sm">{school.school_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[rgb(var(--primary-rgb))]" />
                        <span className="text-sm line-clamp-1">{school.school_address}</span>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">
                      <Link
                        href={`/student/schools/${school.school_id}`}
                        className="text-[rgb(var(--primary-rgb))] flex items-center gap-2 hover:text-[rgba(var(--primary-rgb),0.9)] transition-colors"
                      >
                        Ver detalles
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Lista de cursos de la escuela */}
                {school.courses && school.courses.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-white font-semibold mb-2">Cursos:</h3>
                    <ul className="space-y-2">
                      {school.courses.map((course) => (
                        <li key={course.course_id} className="bg-black/20 p-2 rounded-lg text-gray-200">
                          <div className="flex flex-col">
                            <span className="font-bold">{course.course_name}</span>
                            <span className="text-xs">{course.course_description}</span>
                            {course.teacher && (
                              <span className="text-xs text-gray-400">
                                Profesor: {course.teacher.user_name} {course.teacher.user_lastname}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  )
}

export default SchoolsPage