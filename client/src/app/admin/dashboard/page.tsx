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
  faUserGear,
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

const AdminDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [schools, setSchools] = useState<any[]>([])
  const [showSchoolModal, setShowSchoolModal] = useState(false)
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
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_description: "",
    course_price: "",
    course_places: "",
    course_age: "",
    course_image: ""
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

        // Verificar si el usuario es administrador (role_id: 3)
        if (data.user.role_id !== 3) {
          router.push("/")
          return
        }

        setUser(data.user)
        
        // Obtener las escuelas del administrador
        const schoolResponse = await fetch(`http://localhost:5000/api/schools`, {
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
        credentials: "include",
        body: JSON.stringify({
          school_name: newSchool.school_name,
          school_description: newSchool.school_description,
          school_phone: newSchool.school_phone,
          school_address: newSchool.school_address,
          school_image: newSchool.school_image,
          school_email: newSchool.school_email,
          teacher_id: user.id
        }),
      })

      const data = await response.json()

      if (response.ok) {
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
        throw new Error(data.message || "Error al crear la escuela")
      }
    } catch (error: any) {
      console.error("Error al crear escuela:", error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al crear la escuela',
        confirmButtonColor: '#3085d6',
        background: "#1a1a1a",
        color: "#ffffff"
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include"
        })

        if (response.ok) {
          setSchools(schools.filter(school => school.school_id !== schoolId))
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Escuela eliminada correctamente',
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message)
        }
      }
    } catch (error: any) {
      console.error("Error al eliminar escuela:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al eliminar la escuela',
        confirmButtonColor: '#3085d6',
        background: "#1a1a1a",
        color: "#ffffff"
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
          school_id: selectedSchool.school_id,
          ...newCourse
        }),
      })

      if (response.ok) {
        setShowCourseModal(false)
        setNewCourse({
          course_name: "",
          course_description: "",
          course_price: "",
          course_places: "",
          course_age: "",
          course_image: ""
        })
        
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

  const menuItems = [
    {
      title: "Gestión de Escuelas",
      icon: faSchool,
      description: "Administrar escuelas, crear nuevas y gestionar existentes",
      path: "/admin/schools",
    },
    {
      title: "Gestión de Estudiantes",
      icon: faUserGraduate,
      description: "Administrar estudiantes, ver progreso y gestionar inscripciones",
      path: "/admin/students",
    },
    {
      title: "Gestión de Cursos",
      icon: faChartBar,
      description: "Modifica y Elimina los cursos de las escuelas",
      path: "/admin/courses",
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
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
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
        {/* Sección de Escuelas */}
        <motion.div
          variants={containerVariants}
          className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Escuelas</h2>
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
            {schools.map((school) => (
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
                    onClick={() => {
                      setSelectedSchool(school)
                      setShowCourseModal(true)
                    }}
                    className="p-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </motion.button>
                  <motion.button
                    onClick={() => router.push(`/admin/schools/${school.school_id}`)}
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

        {/* Menú de Opciones */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  <textarea
                    value={newSchool.school_address}
                    onChange={(e) => setNewSchool({ ...newSchool, school_address: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
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

        {/* Modal para crear curso */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-[rgba(var(--primary-rgb),0.4)]"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Crear Nuevo Curso</h2>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nombre del Curso</label>
                  <input
                    type="text"
                    value={newCourse.course_name}
                    onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={newCourse.course_description}
                    onChange={(e) => setNewCourse({ ...newCourse, course_description: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Precio</label>
                  <input
                    type="number"
                    value={newCourse.course_price}
                    onChange={(e) => setNewCourse({ ...newCourse, course_price: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Plazas</label>
                  <input
                    type="number"
                    value={newCourse.course_places}
                    onChange={(e) => setNewCourse({ ...newCourse, course_places: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Edad</label>
                  <input
                    type="number"
                    value={newCourse.course_age}
                    onChange={(e) => setNewCourse({ ...newCourse, course_age: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">URL de la Imagen</label>
                  <input
                    type="text"
                    value={newCourse.course_image}
                    onChange={(e) => setNewCourse({ ...newCourse, course_image: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
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
                    Crear Curso
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

export default AdminDashboard 