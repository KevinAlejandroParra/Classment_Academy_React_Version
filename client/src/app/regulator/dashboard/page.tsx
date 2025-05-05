"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faUser,
  faSignOut,
  faToggleOn,
  faToggleOff,
  faSchool,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"
import Swal from "sweetalert2"

interface School {
  school_id: string
  school_name: string
  school_description: string
  school_email: string
  school_phone: string
  school_address: string
}

interface Administrator {
  user_id: string
  user_name: string
  user_lastname: string
  user_email: string
  user_phone: string
  user_state: string
  schools: School[]
}

interface PendingAdmin {
  user_id: string
  user_name: string
  user_lastname: string
  user_email: string
}

const RegulatorDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([])
  const [loadingPendingAdmins, setLoadingPendingAdmins] = useState(true)
  const [errorPendingAdmins, setErrorPendingAdmins] = useState<string | null>(null)

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

        if (data.user.role_id !== 4) {
          router.push("/")
          return
        }

        setUser(data.user)
        fetchAdministrators(token)
      } catch (error) {
        console.error("Error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const fetchAdministrators = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/administrators", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      setAdministrators(data.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error al cargar administradores:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los administradores",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        background: "#1a1a1a",
        color: "#fff",
      })
    }
  }

  const handleToggleState = async (adminId: string, currentState: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`http://localhost:5000/api/administrators/${adminId}/toggle-state`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: currentState })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const data = await response.json()

      setAdministrators(admins =>
        admins.map(admin =>
          admin.user_id === adminId
            ? { ...admin, user_state: data.data.user_state }
            : admin
        )
      )

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: data.message,
        confirmButtonColor: "rgb(var(--primary-rgb))",
        background: "#1a1a1a",
        color: "#fff",
      })
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo actualizar el estado del administrador",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        background: "#1a1a1a",
        color: "#fff",
      })
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión actual",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FFD700",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#1a1a1a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        router.push("/login")
      }
    })
  }

  const fetchPendingAdmins = async () => {
    setLoadingPendingAdmins(true)
    setErrorPendingAdmins(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/admin/pending-admins", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setPendingAdmins(data.data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar solicitudes"
      setErrorPendingAdmins(errorMessage)
    } finally {
      setLoadingPendingAdmins(false)
    }
  }

  useEffect(() => {
    fetchPendingAdmins()
  }, [])

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token")
    const url = `http://localhost:5000/api/admin/${action}-admin/${userId}`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      Swal.fire({
        icon: "success",
        title: action === "approve" ? "Aprobado" : "Rechazado",
        text: data.message,
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      })
      fetchPendingAdmins()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la solicitud"
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
            <h1 className="text-2xl font-bold text-white">Panel de Regulador</h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-3 px-4 py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{user?.user_name} {user?.user_lastname}</span>
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faSignOut} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 gap-6">
          {administrators.map((admin) => (
            <motion.div
              key={admin.user_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                    <FontAwesomeIcon icon={faUser} className="text-2xl text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {admin.user_name} {admin.user_lastname}
                    </h3>
                    <p className="text-gray-400">{admin.user_email}</p>
                    <p className="text-gray-400">{admin.user_phone}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleToggleState(admin.user_id, admin.user_state)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    admin.user_state === "activo"
                      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                      : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon
                    icon={admin.user_state === "activo" ? faToggleOn : faToggleOff}
                    className="text-xl"
                  />
                  <span>{admin.user_state === "activo" ? "Habilitado" : "Deshabilitado"}</span>
                </motion.button>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-[rgb(var(--primary-rgb))] mb-3">
                  Escuelas Asignadas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {admin.schools && admin.schools.length > 0 ? (
                    admin.schools.map((school) => (
                      <div
                        key={school.school_id}
                        className="bg-black/20 p-4 rounded-lg border border-[rgba(var(--primary-rgb),0.2)]"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <FontAwesomeIcon
                            icon={faSchool}
                            className="text-[rgb(var(--primary-rgb))]"
                          />
                          <h5 className="text-white font-medium">{school.school_name}</h5>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{school.school_description}</p>
                        <div className="text-gray-400 text-sm">
                          <p>{school.school_email}</p>
                          <p>{school.school_phone}</p>
                          <p>{school.school_address}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-full">No hay escuelas asignadas</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <PendingAdminsBlock />
      </main>
    </motion.div>
  )
}

function PendingAdminsBlock() {
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/admin/pending-admins", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setPendingAdmins(data.data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar solicitudes"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingAdmins()
  }, [])

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token")
    const url = `http://localhost:5000/api/admin/${action}-admin/${userId}`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      Swal.fire({
        icon: "success",
        title: action === "approve" ? "Aprobado" : "Rechazado",
        text: data.message,
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      })
      fetchPendingAdmins()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la solicitud"
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      })
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Solicitudes de Administrador Pendientes</h2>
      {loading ? (
        <div className="text-white">Cargando...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : pendingAdmins.length === 0 ? (
        <div className="text-gray-400">No hay solicitudes pendientes.</div>
      ) : (
        <div className="space-y-4">
          {pendingAdmins.map((user) => (
            <div key={user.user_id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 rounded-lg p-4">
              <div>
                <div className="font-semibold text-white">{user.user_name} {user.user_lastname}</div>
                <div className="text-gray-400 text-sm">{user.user_email}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => handleAction(user.user_id, "approve")}
                >
                  Aprobar
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => handleAction(user.user_id, "reject")}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RegulatorDashboard 