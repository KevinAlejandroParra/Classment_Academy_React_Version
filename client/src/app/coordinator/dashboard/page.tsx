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
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"
import Swal from "sweetalert2"

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
  const [schools, setSchools] = useState<any[]>([])
  const [showSchoolModal, setShowSchoolModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

        if (data.user.role_id !== 4) {
          router.push("/")
          return
        }

        setUser(data.user)
        
        // Obtener las escuelas del coordinador
        const schoolResponse = await fetch(`http://localhost:5000/api/schools/coordinator`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json()
          setSchools(schoolData.data || [])
        } else {
          console.error("Error al obtener escuelas:", await schoolResponse.json())
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error de autenticación:", error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar tus datos',
          confirmButtonColor: '#3085d6'
        })
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
        setSchools([...schools, data.data])
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
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Escuela creada correctamente',
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          customClass: {
            popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        })
      } else {
        const errorData = await response.json()
        console.error("Error al crear escuela:", errorData.message)
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Ha ocurrido un error al crear la escuela',
          confirmButtonColor: '#3085d6'
        })
      }
    } catch (error) {
      console.error("Error al crear escuela:", error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al crear la escuela',
        confirmButtonColor: '#3085d6'
      })
    }
  }

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))", 
        confirmButtonColor: 'rgb(var(--primary-rgb))',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      
      if (result.isConfirmed) {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:5000/api/schools/${schoolId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setSchools(schools.filter(school => school.school_id !== schoolId))
          
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'La escuela ha sido eliminada correctamente',
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
            customClass: {
              popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
          })
        } else {
          const errorData = await response.json()
          console.error("Error al eliminar escuela:", errorData.message)
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorData.message || 'Ha ocurrido un error al eliminar la escuela',
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
            customClass: {
              popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
              title: "text-white",
              htmlContainer: "text-gray-300",
      },
          })
        }
      }
    } catch (error) {
      console.error("Error al eliminar escuela:", error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al eliminar la escuela',
        background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "rgb(var(--primary-rgb))",
      confirmButtonColor: "rgb(var(--primary-rgb))",
      customClass: {
        popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
      })
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
            school_id: schools[0]?.school_id,
          },
        }),
      })

      if (response.ok) {
        setShowCourseModal(false)
        setNewCourse({ name: "", description: "", duration: "" })
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Curso creado correctamente',
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          customClass: {
            popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        })
      } else {
        const errorData = await response.json()
        console.error("Error al crear curso:", errorData.message)
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Ha ocurrido un error al crear el curso',
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          customClass: {
            popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        })
      }
    } catch (error) {
      console.error("Error al crear curso:", error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al crear el curso',
        background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "rgb(var(--primary-rgb))",
      confirmButtonColor: "rgb(var(--primary-rgb))",
      customClass: {
        popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
      })
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cerrar sesión?",
      icon: 'question',
      background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "rgb(var(--primary-rgb))",
      showCancelButton: true,
      confirmButtonColor: 'rgb(var(--primary-rgb))',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        router.push("/login")
      }
    })
  }

  const menuItems = [
    {
      title: "Gestión de Estudiantes",
      icon: faUserGraduate,
      description: "Administrar estudiantes, ver progreso y gestionar inscripciones",
      path: "/coordinator/students",
    },
    {
      title: "Mis Escuelas",
      icon: faSchool,
      description: "Gestionar información y cursos de tus escuelas",
      path: "/coordinator/schools",
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

      <main className="container mx-auto px-4 pt-24 pb-12">
        {schools.length === 0 && (
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

        {schools.length > 0 && (
          <motion.div
            variants={containerVariants}
            className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Mis Escuelas</h2>
              <motion.button
                onClick={() => setShowSchoolModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <FontAwesomeIcon icon={faPlus} />
                Nueva Escuela
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school, index) => (
                <motion.div
                  key={school.school_id}
                  variants={itemVariants}
                  className="backdrop-blur-xl bg-black/20 p-6 rounded-xl shadow-lg border border-[rgba(var(--primary-rgb),0.3)]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                      <FontAwesomeIcon icon={faSchool} className="text-2xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{school.school_name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{school.school_description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-gray-300 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                      <span>Email: {school.school_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faSchool} className="text-[rgb(var(--primary-rgb))]" />
                      <span>Teléfono: {school.school_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faHome} className="text-[rgb(var(--primary-rgb))]" />
                      <span>Dirección: {school.school_address}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <motion.button
                      onClick={() => router.push(`/coordinator/school/${school.school_id}`)}
                      className="p-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteSchool(school.school_id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
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
              className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-[rgba(var(--primary-rgb),0.4)]"
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