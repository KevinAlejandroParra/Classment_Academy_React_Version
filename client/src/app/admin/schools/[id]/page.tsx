"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faSchool,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"

// Interfaz para la escuela
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
  }>
}

interface Props {
  params: {
    id: string
  }
}

const SchoolDetailsPage = ({ params }: Props) => {
  const router = useRouter()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchoolDetails()
  }, [])

  const fetchSchoolDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`http://localhost:5000/api/schools/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Error al cargar los detalles de la escuela")

      const data = await response.json()
      setSchool(data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los detalles de la escuela",
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      })
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Escuela no encontrada</div>
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
            <Link
              href="/admin/schools"
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Detalles de la Escuela</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-[rgb(var(--primary-rgb))] p-6 rounded-lg">
              <FontAwesomeIcon icon={faSchool} className="text-4xl text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{school.school_name}</h2>
              <p className="text-gray-400 text-lg mt-2">{school.school_description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Información de Contacto</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Email:</strong> {school.school_email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {school.school_phone}
                </p>
                <p>
                  <strong>Dirección:</strong> {school.school_address}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Información del Coordinador</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Nombre:</strong> {school.coordinators[0]?.user_name} {school.coordinators[0]?.user_lastname}
                </p>
                <p>
                  <strong>Email:</strong> {school.coordinators[0]?.user_email}
                </p>
              </div>
            </div>
          </div>

          {school.courses && school.courses.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Cursos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {school.courses.map((course) => (
                  <div
                    key={course.course_id}
                    className="p-4 rounded-lg bg-black/20 border border-[rgba(var(--primary-rgb),0.2)]"
                  >
                    <h4 className="text-lg font-semibold text-white">{course.course_name}</h4>
                    <p className="text-gray-400 mt-2">{course.course_description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  )
}

export default SchoolDetailsPage 