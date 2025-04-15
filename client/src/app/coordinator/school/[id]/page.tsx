"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSchool,
  faPlus,
  faEdit,
  faTrash,
  faArrowLeft,
  faGraduationCap,
  faBook,
  faCalendar,
  faClock,
  faDollarSign,
  faUsers,
  faSave,
  faTimes,
  faHome,
} from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
}

const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 10 }
}

const buttonTap = {
  scale: 0.98
}

const SchoolManagementPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [school, setSchool] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_description: "",
    course_price: "",
    course_places: "",
    course_age: "",
    course_image: "",
  })
  const [editedSchool, setEditedSchool] = useState({
    school_name: "",
    school_description: "",
    school_phone: "",
    school_address: "",
    school_image: "",
    school_email: "",
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
        
        // Obtener la escuela
        const schoolResponse = await fetch(`http://localhost:5000/api/schools/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json()
          setSchool(schoolData.data)
          setEditedSchool({
            school_name: schoolData.data.school_name,
            school_description: schoolData.data.school_description,
            school_phone: schoolData.data.school_phone,
            school_address: schoolData.data.school_address,
            school_image: schoolData.data.school_image,
            school_email: schoolData.data.school_email,
          })
          
          // Obtener los cursos de la escuela
          const coursesResponse = await fetch(`http://localhost:5000/api/courses/school/${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json()
            setCourses(coursesData.data)
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error:", error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar los datos',
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
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, params.id])

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/schools/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedSchool),
      })

      if (response.ok) {
        const updatedSchool = await response.json()
        setSchool(updatedSchool.data)
        setShowEditSchoolModal(false)
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Escuela actualizada correctamente',
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
        throw new Error(errorData.message)
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al actualizar la escuela',
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
          school_id: params.id,
          ...newCourse
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCourses([...courses, data.data])
        setShowCourseModal(false)
        setNewCourse({
          course_name: "",
          course_description: "",
          course_price: "",
          course_places: "",
          course_age: "",
          course_image: "",
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
        throw new Error(errorData.message)
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al crear el curso',
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

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/courses/${editingCourse.course_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingCourse),
      })

      if (response.ok) {
        const updatedCourse = await response.json()
        setCourses(courses.map(course => 
          course.course_id === updatedCourse.data.course_id ? updatedCourse.data : course
        ))
        setEditingCourse(null)
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Curso actualizado correctamente',
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
        throw new Error(errorData.message)
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al actualizar el curso',
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

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        customClass: {
          popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
      })

      if (result.isConfirmed) {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setCourses(courses.filter(course => course.course_id !== courseId))
          
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Curso eliminado correctamente',
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
          throw new Error(errorData.message)
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error al eliminar el curso',
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="text-white text-xl text-center">
          Escuela no encontrada.
          <button
            onClick={() => router.push("/coordinator/dashboard")}
            className="block mx-auto mt-4 px-6 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)]"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <Particles />
      <Sidebar />
      


      <div className="container mx-auto px-4 py-8 z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Información de la Escuela */}
          <motion.div 
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                  <FontAwesomeIcon icon={faSchool} className="text-3xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{school.school_name}</h2>
                  <p className="text-gray-300">{school.school_description}</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowEditSchoolModal(true)}
                className="p-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <FontAwesomeIcon icon={faEdit} />
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-[rgb(var(--primary-rgb))]" />
                <span>Teléfono: {school.school_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBook} className="text-[rgb(var(--primary-rgb))]" />
                <span>Email: {school.school_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-[rgb(var(--primary-rgb))]" />
                <span>Dirección: {school.school_address}</span>
              </div>
            </div>
          </motion.div>

          {/* Sección de Cursos */}
          <motion.div 
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Cursos</h3>
              <motion.button
                onClick={() => setShowCourseModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <FontAwesomeIcon icon={faPlus} />
                Agregar Curso
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 rounded-lg p-6 border border-[rgba(var(--primary-rgb),0.2)] hover:border-[rgba(var(--primary-rgb),0.4)] transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={course.course_image}
                      alt={course.course_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{course.course_name}</h4>
                      <p className="text-gray-400 text-sm">{course.course_description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-[rgb(var(--primary-rgb))]" />
                      <span>${course.course_price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-[rgb(var(--primary-rgb))]" />
                      <span>{course.course_places} plazas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-[rgb(var(--primary-rgb))]" />
                      <span>Edad: {course.course_age} años</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <motion.button
                      onClick={() => setEditingCourse(course)}
                      className="p-2 hover:bg-gray-700 rounded-lg text-[rgb(var(--primary-rgb))]"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteCourse(course.course_id)}
                      className="p-2 hover:bg-gray-700 rounded-lg text-red-500"
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
        </motion.div>
      </div>

      {/* Modal para editar escuela */}
      {showEditSchoolModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 rounded-lg p-6 w-full max-w-md border border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Editar Escuela</h2>
              <button
                onClick={() => setShowEditSchoolModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleUpdateSchool} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Nombre de la Escuela</label>
                <input
                  type="text"
                  value={editedSchool.school_name}
                  onChange={(e) => setEditedSchool({ ...editedSchool, school_name: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={editedSchool.school_description}
                  onChange={(e) => setEditedSchool({ ...editedSchool, school_description: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">URL del Logo</label>
                <input
                  type="text"
                  value={editedSchool.school_image}
                  onChange={(e) => setEditedSchool({ ...editedSchool, school_image: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={editedSchool.school_phone}
                  onChange={(e) => setEditedSchool({ ...editedSchool, school_phone: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Dirección</label>
                <input
                  type="text"
                  value={editedSchool.school_address}
                  onChange={(e) => setEditedSchool({ ...editedSchool, school_address: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editedSchool.school_email}
                  onChange={(e) => setEditedSchool({ ...editedSchool, school_email: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={() => setShowEditSchoolModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-[rgb(var(--primary-rgb))] rounded-lg text-black hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Guardar Cambios
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal para crear/editar curso */}
      {(showCourseModal || editingCourse) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 rounded-lg p-6 w-full max-w-md border border-[rgba(var(--primary-rgb),0.4)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
              </h2>
              <button
                onClick={() => {
                  setShowCourseModal(false)
                  setEditingCourse(null)
                }}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Nombre del Curso</label>
                <input
                  type="text"
                  value={editingCourse ? editingCourse.course_name : newCourse.course_name}
                  onChange={(e) => editingCourse 
                    ? setEditingCourse({ ...editingCourse, course_name: e.target.value })
                    : setNewCourse({ ...newCourse, course_name: e.target.value })
                  }
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={editingCourse ? editingCourse.course_description : newCourse.course_description}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, course_description: e.target.value })
                    : setNewCourse({ ...newCourse, course_description: e.target.value })
                  }
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Precio</label>
                <input
                  type="number"
                  value={editingCourse ? editingCourse.course_price : newCourse.course_price}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, course_price: e.target.value })
                    : setNewCourse({ ...newCourse, course_price: e.target.value })
                  }
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Plazas Disponibles</label>
                <input
                  type="number"
                  value={editingCourse ? editingCourse.course_places : newCourse.course_places}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, course_places: e.target.value })
                    : setNewCourse({ ...newCourse, course_places: e.target.value })
                  }
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Edad Requerida</label>
                <input
                  type="number"
                  value={editingCourse ? editingCourse.course_age : newCourse.course_age}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, course_age: e.target.value })
                    : setNewCourse({ ...newCourse, course_age: e.target.value })
                  }
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">URL de la Imagen</label>
                <input
                  type="text"
                  value={editingCourse ? editingCourse.course_image : newCourse.course_image}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, course_image: e.target.value })
                    : setNewCourse({ ...newCourse, course_image: e.target.value })
                  }
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowCourseModal(false)
                    setEditingCourse(null)
                  }}
                  className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-[rgb(var(--primary-rgb))] rounded-lg text-black hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  {editingCourse ? 'Guardar Cambios' : 'Crear Curso'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SchoolManagementPage 