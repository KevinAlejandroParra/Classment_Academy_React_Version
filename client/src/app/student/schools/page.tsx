"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { animate, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faSchool,
  faArrowRight,
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faSpinner,
  faBuilding,
  faBook,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"
import Image from "next/image"
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
  coordinators: [{
    user_id: string
    user_name: string
    user_lastname: string
    user_email: string
  }]
  courses: Array<{
    course_id: string
    course_name: string
    course_description: string
    course_duration: string
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
  const { id } = useParams()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No hay sesión activa")
        return
      }
      const response = await fetch("http://localhost:5000/api/schools", {
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

  const handleEnroll = async (schoolId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const result = await Swal.fire({
        title: "¿Deseas inscribirte en esta escuela?",
        text: "Podrás acceder a todos sus cursos disponibles",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, inscribirme",
        cancelButtonText: "Cancelar",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        cancelButtonColor: "#d33",
      })
//BORARR ESTO
      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:5000/api/students/enroll/${schoolId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "¡Inscripción exitosa!",
            text: "Ahora puedes acceder a los cursos de esta escuela",
            confirmButtonColor: "rgb(var(--primary-rgb))",
            background: "#1a1a1a",
            color: "#fff",
          })
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al inscribirse en la escuela")
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo completar la inscripción",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        background: "#1a1a1a",
        color: "#fff",
      })
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
            <h1 className="text-2xl font-bold text-white">Explorar Escuelas</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
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
                        src={school.school_image}
                        alt={school.school_name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faSchool} className="text-2xl text-black" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">{school.school_name}</h2>
                    <p className="text-sm opacity-70 mb-4 line-clamp-2">{school.school_description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBook} className="text-[rgb(var(--primary-rgb))]" />
                        <span className="text-sm">{school.courses?.length || 0} cursos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                        <span className="text-sm">{school.coordinators?.length || 0} coordinadores</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
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
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleEnroll(school.school_id)}
                        className="bg-[rgb(var(--primary-rgb))] text-black px-4 py-2 rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                      >
                        Inscribirse
                      </button>
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
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  )
}

export default SchoolsPage 