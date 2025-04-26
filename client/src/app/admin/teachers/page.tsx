"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUserGear,
  faPlus,
  faEdit,
  faTrash,
  faUser,
  faSchool,
  faBook,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
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

const TeachersPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [teachers, setTeachers] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newTeacher, setNewTeacher] = useState({
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_phone: "",
    user_password: "",
    school_id: selectedSchool?.school_id || ""
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

        if (data.user.role_id !== 3) {
          router.push("/")
          return
        }

        setUser(data.user)
        
        // Obtener las escuelas del admin
        const schoolResponse = await fetch(`http://localhost:5000/api/schools`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json()
          setSchools(schoolData.data || [])
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

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTeacher),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const data = await response.json()
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Profesor creado correctamente',
        confirmButtonColor: '#3085d6'
      })

      setShowTeacherModal(false)
      setNewTeacher({
        user_name: "",
        user_lastname: "",
        user_email: "",
        user_phone: "",
        user_password: "",
        school_id: selectedSchool?.school_id || ""
      })

      // Actualizar lista de profesores
      const schoolTeachersResponse = await fetch(`http://localhost:5000/api/teachers/school/${newTeacher.school_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (schoolTeachersResponse.ok) {
        const teachersData = await schoolTeachersResponse.json()
        setTeachers(teachersData.data || [])
      }
    } catch (error: any) {
      console.error("Error al crear profesor:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al crear el profesor',
        confirmButtonColor: '#3085d6'
      })
    }
  }

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:5000/api/teachers/assign-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacher_id: selectedTeacher.user_id,
          course_id: selectedTeacher.course_id,
          school_id: selectedSchool.school_id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Profesor asignado al curso correctamente',
        confirmButtonColor: '#3085d6'
      })

      setShowAssignModal(false)
      setSelectedTeacher(null)
    } catch (error: any) {
      console.error("Error al asignar profesor:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al asignar el profesor',
        confirmButtonColor: '#3085d6'
      })
    }
  }

  const handleSchoolSelect = async (schoolId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`http://localhost:5000/api/teachers/school/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTeachers(data.data || [])
        setSelectedSchool(schools.find(s => s.school_id === schoolId))
      }
    } catch (error) {
      console.error("Error al cargar profesores:", error)
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
      <Particles />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Gestión de Profesores</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-24">
        {/* School selector */}
        <div className="mb-8">
          <label className="block text-gray-300 mb-2">Seleccionar Escuela</label>
          <select
            onChange={(e) => handleSchoolSelect(e.target.value)}
            className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
          >
            <option value="">Selecciona una escuela</option>
            {schools.map((school) => (
              <option key={school.school_id} value={school.school_id}>
                {school.school_name}
              </option>
            ))}
          </select>
        </div>

        {/* Teachers list */}
        {selectedSchool && (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teachers.map((teacher) => (
              <motion.div
                key={teacher.user_id}
                variants={itemVariants}
                className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                    <FontAwesomeIcon icon={faUserGear} className="text-2xl text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {teacher.user_name} {teacher.user_lastname}
                    </h3>
                    <p className="text-gray-400">{teacher.user_email}</p>
                    <p className="text-gray-400">{teacher.user_phone}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <motion.button
                    onClick={() => {
                      setSelectedTeacher(teacher)
                      setShowAssignModal(true)
                    }}
                    className="p-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <FontAwesomeIcon icon={faBook} />
                  </motion.button>
                </div>
              </motion.div>
            ))}

            <motion.button
              onClick={() => setShowTeacherModal(true)}
              variants={itemVariants}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] flex items-center justify-center gap-4 hover:bg-[rgba(var(--primary-rgb),0.1)] transition-colors"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <FontAwesomeIcon icon={faPlus} className="text-2xl text-[rgb(var(--primary-rgb))]" />
              <span className="text-[rgb(var(--primary-rgb))]">Nuevo Profesor</span>
            </motion.button>
          </motion.div>
        )}

        {/* Create teacher modal */}
        {showTeacherModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-[rgba(var(--primary-rgb),0.4)]"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Crear Nuevo Profesor</h2>
              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newTeacher.user_name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, user_name: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Apellido</label>
                  <input
                    type="text"
                    value={newTeacher.user_lastname}
                    onChange={(e) => setNewTeacher({ ...newTeacher, user_lastname: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={newTeacher.user_email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, user_email: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={newTeacher.user_password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, user_password: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={newTeacher.user_phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, user_phone: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Escuela</label>
                  <select
                    value={newTeacher.school_id}
                    onChange={(e) => setNewTeacher({ ...newTeacher, school_id: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  >
                    <option value="">Selecciona una escuela</option>
                    {schools.map((school) => (
                      <option key={school.school_id} value={school.school_id}>
                        {school.school_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowTeacherModal(false)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Assign teacher modal */}
        {showAssignModal && selectedTeacher && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-[rgba(var(--primary-rgb),0.4)]"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Asignar Profesor a Curso</h2>
              <form onSubmit={handleAssignTeacher} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Profesor</label>
                  <input
                    type="text"
                    value={`${selectedTeacher.user_name} ${selectedTeacher.user_lastname}`}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Curso</label>
                  <select
                    value={selectedTeacher.course_id}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, course_id: e.target.value })}
                    className="w-full p-3 bg-black/50 border border-[rgba(var(--primary-rgb),0.3)] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    required
                  >
                    <option value="">Selecciona un curso</option>
                    {selectedSchool?.courses?.map((course: any) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                  >
                    Asignar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TeachersPage 