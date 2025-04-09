"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUserGraduate,
  faSchool,
  faClipboardCheck,
  faChartBar,
  faSignOut,
  faPlus,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"

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

const CoordinatorDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [school, setSchool] = useState<any>(null)
  const [showSchoolModal, setShowSchoolModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [newSchool, setNewSchool] = useState({
    school_name: "",
    school_description: "",
    school_image: "",
    school_phone: "",
    school_address: "",
    school_email: "",
    teacher_id: ""
  })
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    duration: "",
  })

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

        if (data.user.role !== 4) {
          router.push("/")
          return
        }

        setUser(data.user)
        
        // Obtener la escuela del coordinador
        const schoolResponse = await fetch(`http://localhost:5000/api/schools/coordinator/${data.user.id}`)
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json()
          setSchool(schoolData.data)
        }
      } catch (error) {
        console.error("Error de autenticación:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacher_id: user.id,
          school_name: newSchool.school_name,
          school_description: newSchool.school_description,
          school_phone: newSchool.school_phone,
          school_address: newSchool.school_address,
          school_image: newSchool.school_image,
          school_email: newSchool.school_email
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSchool(data.data)
        setShowSchoolModal(false)
        setNewSchool({
          school_name: "",
          school_description: "",
          school_image: "",
          school_phone: "",
          school_address: "",
          school_email: "",
          teacher_id: ""
        })
      } else {
        const errorData = await response.json()
        console.error("Error al crear escuela:", errorData.message)
      }
    } catch (error) {
      console.error("Error al crear escuela:", error)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: {
            ...newCourse,
            school_id: school.id,
          },
        }),
      })

      if (response.ok) {
        setShowCourseModal(false)
        setNewCourse({ name: "", description: "", duration: "" })
      }
    } catch (error) {
      console.error("Error al crear curso:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const menuItems = [
    {
      title: "Gestión de Estudiantes",
      icon: faUserGraduate,
      description: "Administrar estudiantes, ver progreso y gestionar inscripciones",
      path: "/coordinator/students",
    },
    {
      title: "Mi Escuela",
      icon: faSchool,
      description: "Gestionar información y cursos de tu escuela",
      path: "/coordinator/school",
    },
    {
      title: "Control de Asistencia",
      icon: faClipboardCheck,
      description: "Registrar y gestionar asistencias de estudiantes",
      path: "/coordinator/attendance",
    },
    {
      title: "Reportes",
      icon: faChartBar,
      description: "Generar y visualizar reportes de progreso y asistencia",
      path: "/coordinator/reports",
    },
  ]

  if (!user) return null

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
            <h1 className="text-2xl font-bold text-white">Panel de Coordinación</h1>
          </div>
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

      <main className="container mx-auto px-4 pt-24 pb-8">
        {!school && (
          <motion.div
            variants={containerVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mb-8"
          >
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Bienvenido a tu Panel de Coordinación</h2>
              <p className="text-gray-400 mb-6">
                Para comenzar, necesitas crear una escuela. Esto te permitirá gestionar cursos y estudiantes.
              </p>
              <motion.button
                onClick={() => setShowSchoolModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[rgb(var(--primary-rgb))] text-black rounded-lg mx-auto hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <FontAwesomeIcon icon={faPlus} />
                Crear Escuela
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center gap-4 mb-4">
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

        {/* Modal para crear escuela */}
        {showSchoolModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-[rgba(var(--primary-rgb),0.4)]"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Crear Nueva Escuela</h2>
              <form onSubmit={handleCreateSchool} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nombre de la Escuela</label>
                  <input
                    type="text"
                    value={newSchool.school_name}
                    onChange={(e) => setNewSchool({ ...newSchool, school_name: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={newSchool.school_description}
                    onChange={(e) => setNewSchool({ ...newSchool, school_description: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">URL del Logo</label>
                  <input
                    type="text"
                    value={newSchool.school_image}
                    onChange={(e) => setNewSchool({ ...newSchool, school_image: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={newSchool.school_phone}
                    onChange={(e) => setNewSchool({ ...newSchool, school_phone: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={newSchool.school_address}
                    onChange={(e) => setNewSchool({ ...newSchool, school_address: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newSchool.school_email}
                    onChange={(e) => setNewSchool({ ...newSchool, school_email: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowSchoolModal(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Crear Escuela
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </motion.div>
  )
}

export default CoordinatorDashboard 