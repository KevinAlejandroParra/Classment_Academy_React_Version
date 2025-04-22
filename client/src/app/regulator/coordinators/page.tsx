"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faUserGear,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"

interface Coordinator {
  user_id: string
  user_name: string
  user_lastname: string
  user_email: string
  user_phone: string
  user_state: string
  managedSchools: Array<{
    school_id: string
    school_name: string
  }>
}

const CoordinatorsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
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

        if (data.user.role !== 3) {
          router.push("/")
          return
        }

        setUser(data.user)
        
        // Obtener todos los coordinadores
        const coordinatorsResponse = await fetch("http://localhost:5000/api/coordinators", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (coordinatorsResponse.ok) {
          const coordinatorsData = await coordinatorsResponse.json()
          setCoordinators(coordinatorsData.data)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleToggleState = async (coordinatorId: string, currentState: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: currentState === 'activo' 
          ? '¿Deseas deshabilitar este coordinador?' 
          : '¿Deseas habilitar este coordinador?',
        icon: 'warning',
        showCancelButton: true,
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: 'rgb(var(--primary-rgb))',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      })
      
      if (result.isConfirmed) {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:5000/api/users/${coordinatorId}/toggle-state`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setCoordinators(coordinators.map(coord => 
            coord.user_id === coordinatorId 
              ? { ...coord, user_state: currentState === 'activo' ? 'inactivo' : 'activo' }
              : coord
          ))
          
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: currentState === 'activo' 
              ? 'Coordinador deshabilitado correctamente' 
              : 'Coordinador habilitado correctamente',
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al cambiar el estado del coordinador',
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <motion.div
      initial="hidden"
      animate="visible"
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
            <h1 className="text-2xl font-bold text-white">Gestión de Coordinadores</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coordinators.map((coordinator) => (
            <motion.div
              key={coordinator.user_id}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                  <FontAwesomeIcon icon={faUserGear} className="text-2xl text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {coordinator.user_name} {coordinator.user_lastname}
                  </h3>
                  <p className="text-gray-400 text-sm">{coordinator.user_email}</p>
                </div>
              </div>

              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Teléfono:</strong> {coordinator.user_phone}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      coordinator.user_state === "activo"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {coordinator.user_state === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </p>
                <p>
                  <strong>Escuelas asignadas:</strong>{" "}
                  {coordinator.managedSchools?.length || 0}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleToggleState(coordinator.user_id, coordinator.user_state)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    coordinator.user_state === "activo"
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={coordinator.user_state === "activo" ? faToggleOff : faToggleOn}
                  />
                  {coordinator.user_state === "activo" ? "Deshabilitar" : "Habilitar"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </motion.div>
  )
}

export default CoordinatorsPage 