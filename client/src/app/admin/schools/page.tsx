"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faSchool,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"
import { param } from "framer-motion/client"

interface School {
  school_id: string
  school_name: string
  school_description: string
  school_email: string
  school_phone: string
  school_address: string
  school_image: string
  users: [{
    user_id: string
    user_name: string
    user_lastname: string
    user_email: string
  }]
}

const SchoolsPage = () => {
  const router = useRouter()
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
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/get-school`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al cargar las escuelas")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Error al cargar las escuelas")
      }

      setSchools(data.data)
      setError(null)
      setLoading(false)
    } catch (error: any) {
      setError(error.message || "Error al cargar las escuelas")
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudieron cargar las escuelas",
        confirmButtonColor: "#FFD700",
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Gestión de Escuelas</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center text-white">
            <h2 className="text-2xl mb-4">No hay escuelas registradas, porfavor registra tu escuela en el panel de control</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => {
              const imageUrl = school.school_image
                ? `${process.env.NEXT_PUBLIC_API_URL}${school.school_image}`
                : null;

              const coordinator = school.users && school.users.length > 0 ? school.users[0] : null;

              return (
                <motion.div
                  key={school.school_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] cursor-pointer hover:border-[rgb(var(--primary-rgb))] transition-colors"
                  onClick={() => router.push(`/admin/schools/${school.school_id}`)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[rgb(var(--primary-rgb))] rounded-lg">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={school.school_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSchool} className="text-2xl text-black" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{school.school_name}</h3>
                      <p className="text-gray-400 text-sm">{school.school_description}</p>
                    </div>
                  </div>
                  <div className="text-gray-300 space-y-2">
                    <p>
                      <strong>Coordinador:</strong>{" "}
                      {coordinator
                        ? `${coordinator.user_name} ${coordinator.user_lastname}`
                        : "No asignado"}
                    </p>
                    <p>
                      <strong>Email coordinador:</strong>{" "}
                      {coordinator ? coordinator.user_email : "No asignado"}
                    </p>
                    <p>
                      <strong>Email escuela:</strong> {school.school_email}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {school.school_phone}
                    </p>
                    <p>
                      <strong>Dirección:</strong> {school.school_address}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-[rgb(var(--primary-rgb))] flex items-center gap-2"
                    >
                      Ver detalles
                      <FontAwesomeIcon icon={faArrowRight} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </motion.div>
  )
}

export default SchoolsPage