"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSchool } from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2"

const SchoolsPage = () => {
  const router = useRouter()
  const [schools, setSchools] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/school`)
        const data = await response.json()
        if (data.success) {
          setSchools(data.data)
        } else {
          Swal.fire({
            title: "Error",
            text: "No se pudieron cargar las escuelas.",
            icon: "error",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
        }
      } catch (error) {
        console.error("Error:", error)
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las escuelas. Por favor intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "rgb(var(--primary-rgb))",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando escuelas...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 pt-24 pb-8"
    >
      <h1 className="text-3xl font-bold mb-6">Escuelas Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <motion.div
            key={school.school_id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold">{school.school_name}</h2>
            <p className="text-gray-600">{school.school_description}</p>
            <p className="text-gray-600">Teléfono: {school.school_phone}</p>
            <p className="text-gray-600">Dirección: {school.school_address}</p>
            <p className="text-gray-600">Email: {school.school_email}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => router.push(`/schools/${school.school_id}`)}
              >
                Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default SchoolsPage
