"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faSchool,
  faArrowLeft,
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faBook,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"

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
    teacher?: {
      user_id: string
      user_name: string
      user_lastname: string
      user_email: string
    }
  }>
}

const SchoolDetailsPage = () => {
  const router = useRouter()
  const params = useParams();
  const schoolId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (schoolId) {
      fetchSchoolDetails()
    } else {
      setError('ID de escuela no válido')
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [schoolId])

  const fetchSchoolDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`http://localhost:5000/api/schools/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al cargar los detalles de la escuela")
      }

      const data = await response.json()
      setSchool(data.data)
      setError(null)
    } catch (error: any) {
      setError(error.message || "Error al cargar los detalles de la escuela")
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudieron cargar los detalles de la escuela",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        background: "#1a1a1a",
        color: "#fff",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
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

  const handleCourseEnroll = async (course_id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const result = await Swal.fire({
        title: "¿Deseas inscribirte en este curso?",
        text: "Este curso es parte de la escuela",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, inscribirme",
        cancelButtonText: "Cancelar",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        cancelButtonColor: "#d33",
      })

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:5000/api/enrollments/schools/${schoolId}/courses/${course_id}/enroll`, {
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
            text: "Ahora puedes acceder a este curso",
            confirmButtonColor: "rgb(var(--primary-rgb))",
            background: "#1a1a1a",
            color: "#fff",
          })
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al inscribirse en el curso")
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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Error al cargar la escuela</h2>
          <p className="text-gray-400 mb-4">{error || "Escuela no encontrada"}</p>
          <button
            onClick={() => router.push("/student/schools")}
            className="bg-[rgb(var(--primary-rgb))] text-black px-4 py-2 rounded-lg"
          >
            Volver a escuelas
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/student/schools")}
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">{school.school_name}</h1>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div>
              {school.school_image ? (
                <img
                  src={school.school_image}
                  alt={school.school_name}
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <FontAwesomeIcon icon={faSchool} className="text-4xl text-black" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{school.school_name}</h2>
              <p className="text-gray-400 text-lg mt-2">{school.school_description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Información de Contacto</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[rgb(var(--primary-rgb))]" />
                  <span>{school.school_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-[rgb(var(--primary-rgb))]" />
                  <span>{school.school_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[rgb(var(--primary-rgb))]" />
                  <span>{school.school_address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Información del Coordinador</h3>
              {school.coordinators && school.coordinators.length > 0 ? (
                <div className="space-y-2 text-gray-300">
                  {school.coordinators.map((coordinator) => (
                    <div key={coordinator.user_id} className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                      <span>{coordinator.user_name} {coordinator.user_lastname}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[rgb(var(--primary-rgb))]" />
                    <span>{school.coordinators[0].user_email}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No hay coordinador asignado</p>
              )}
            </div>
          </div>
        </div>

        {/* Cursos */}
        <div className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]">
          <h2 className="text-2xl font-bold text-white mb-6">Cursos Disponibles</h2>
          {school.courses.length === 0 ? (
            <p className="text-gray-400 text-center">No hay cursos disponibles en esta escuela</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {school.courses.map((course) => (
                <motion.div
                  key={course.course_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-black/20 p-6 rounded-xl shadow-lg border border-[rgba(var(--primary-rgb),0.3)] flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                      <FontAwesomeIcon icon={faBook} className="text-2xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{course.course_name}</h3>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-gray-300">{course.course_description}</p>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/courses/${course.course_id}`}
                        className="bg-[rgb(var(--primary-rgb))] text-black px-4 py-2 rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors flex-1 text-center"
                      >
                        Ver más detalles
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </motion.div>
  )
}

export default SchoolDetailsPage