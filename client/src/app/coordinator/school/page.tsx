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
} from "@fortawesome/free-solid-svg-icons"

const SchoolPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [school, setSchool] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_description: "",
    course_price: "",
    course_places: "",
    course_age: "",
    course_image: "",
  })
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
          
          // Obtener los cursos de la escuela
          if (schoolData.data) {
            const coursesResponse = await fetch(`http://localhost:5000/api/courses/school/${schoolData.data.school_id}`)
            if (coursesResponse.ok) {
              const coursesData = await coursesResponse.json()
              setCourses(coursesData.data)
            }
          }
        }
        setIsLoading(false)
      } catch (error) {
         .error("Error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

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
          school_id: school.school_id,
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
      } else {
        const errorData = await response.json()
        console.error("Error al crear curso:", errorData.message)
      }
    } catch (error) {
      console.error("Error al crear curso:", error)
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
          No tienes una escuela registrada.
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
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/coordinator/dashboard")}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold">Mi Escuela</h1>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        {/* Información de la Escuela */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
              <FontAwesomeIcon icon={faSchool} className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{school.school_name}</h2>
              <p className="text-gray-400">{school.school_description}</p>
            </div>
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
        </div>

        {/* Sección de Cursos */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Cursos</h3>
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Curso
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
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
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
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
                <button className="p-2 hover:bg-gray-700 rounded-lg text-[rgb(var(--primary-rgb))]">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal para crear curso */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Crear Nuevo Curso</h2>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nombre del Curso</label>
                  <input
                    type="text"
                    value={newCourse.course_name}
                    onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={newCourse.course_description}
                    onChange={(e) => setNewCourse({ ...newCourse, course_description: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Precio</label>
                  <input
                    type="number"
                    value={newCourse.course_price}
                    onChange={(e) => setNewCourse({ ...newCourse, course_price: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Plazas Disponibles</label>
                  <input
                    type="number"
                    value={newCourse.course_places}
                    onChange={(e) => setNewCourse({ ...newCourse, course_places: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Edad Requerida</label>
                  <input
                    type="number"
                    value={newCourse.course_age}
                    onChange={(e) => setNewCourse({ ...newCourse, course_age: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">URL de la Imagen</label>
                  <input
                    type="text"
                    value={newCourse.course_image}
                    onChange={(e) => setNewCourse({ ...newCourse, course_image: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[rgb(var(--primary-rgb))] rounded-lg text-black hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                  >
                    Crear Curso
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SchoolPage 