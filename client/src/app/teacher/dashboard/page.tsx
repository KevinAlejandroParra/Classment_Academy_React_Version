"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Swal, { SweetAlertIcon } from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChalkboardTeacher,
  faCalendarPlus,
  faExclamationTriangle,
  faSpinner,
  faClock,
  faUser,
  faUserCheck,
  faUserTimes,
  faUserClock,
  faTrashAlt,
  faEdit,
  faCalendarAlt,
  faGraduationCap,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"

// Interfaces para tipado
interface Course {
  course_id: string
  course_name: string
  course_image: string
  students_count: number
}

interface Class {
  class_id: string
  class_title: string
  class_date: string
  class_description: string
  course_id: string
  duration?: number
}

interface Student {
  user_id: string
  user_name: string
  user_lastname: string
  user_image: string
  attendance_status?: string
  progress?: number
  notes?: string
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("courses")
  const [courses, setCourses] = useState<Course[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showClassForm, setShowClassForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [newClass, setNewClass] = useState({
    title: "",
    date: "",
    description: "",
    duration: 60,
    class_id: ""
  })

  // Toast configuration for alerts using primary colors
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer)
      toast.addEventListener("mouseleave", Swal.resumeTimer)
    }
  })

  // Obtener cursos asignados al profesor
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        // Obtener cursos del profesor
        const coursesRes = await fetch("http://localhost:5000/api/teacher/courses", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const coursesData = await coursesRes.json()
        
        if (coursesData.success) {
          setCourses(coursesData.data)
          if (coursesData.data.length > 0) {
            setSelectedCourse(coursesData.data[0].course_id)
          }
        } else {
          setError("Error al cargar los cursos")
          showAlert("error", "Error al cargar los cursos")
        }
      } catch (err) {
        setError("Error de conexión")
        console.error(err)
        showAlert("error", "Error de conexión al servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherData()
  }, [router])

  // Obtener clases cuando se selecciona un curso
  useEffect(() => {
    if (!selectedCourse) return

    const fetchClasses = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/class/course/${selectedCourse}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        
        if (data.success) {
          setClasses(data.data)
          if (data.data.length > 0) {
            setSelectedClass(data.data[0].class_id)
          } else {
            setSelectedClass(null)
          }
        } else {
          showAlert("error", "Error al cargar las clases")
        }
      } catch (err) {
        console.error("Error al cargar clases:", err)
        showAlert("error", "Error al cargar clases")
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [selectedCourse])

  // Obtener estudiantes cuando se selecciona un curso
  useEffect(() => {
    if (!selectedCourse) return

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/courses/${selectedCourse}/students`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        
        if (data.success) {
          // Inicializar estudiantes con estado de asistencia pendiente
          setStudents(data.data.map((student: Student) => ({
            ...student,
            attendance_status: "pending",
            progress: 0
          })))
        } else {
          showAlert("error", "Error al cargar estudiantes")
        }
      } catch (err) {
        console.error("Error al cargar estudiantes:", err)
        showAlert("error", "Error al cargar estudiantes")
      }
    }

    fetchStudents()
  }, [selectedCourse])

  // Obtener asistencia cuando se selecciona una clase
  useEffect(() => {
    if (!selectedClass || !selectedCourse) return

    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/attendance/class/${selectedClass}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        
        // Primero, actualizar todos los estudiantes para el curso actual
        const studentsRes = await fetch(`http://localhost:5000/api/courses/${selectedCourse}/students`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const studentsData = await studentsRes.json()
        
        if (studentsData.success) {
          // Inicializar todos los estudiantes con estado pendiente
          const updatedStudents = studentsData.data.map((student: Student) => ({
            ...student,
            attendance_status: "pending",
            progress: 0
          }))
          
          // Si hay datos de asistencia, actualizar el estado de asistencia
          if (data.success && data.data.length > 0) {
            data.data.forEach((attendance: any) => {
              const studentIndex = updatedStudents.findIndex(
                (s: Student) => s.user_id === attendance.student.user_id
              )
              if (studentIndex !== -1) {
                updatedStudents[studentIndex].attendance_status = attendance.status
                updatedStudents[studentIndex].progress = attendance.progress || 0
              }
            })
          }
          
          setStudents(updatedStudents)
        }
      } catch (err) {
        console.error("Error al cargar asistencia:", err)
        showAlert("error", "Error al cargar datos de asistencia")
      }
    }

    fetchAttendance()
  }, [selectedClass, selectedCourse])

  // Función para mostrar alertas con colores primarios
  const showAlert = (type: string, message: string) => {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb')
    
    Toast.fire({
      icon: type as SweetAlertIcon,
      title: message,
      background: type === "success" ? `rgba(${primaryColor}, 0.2)` : `rgba(255, 0, 0, 0.1)`,
      color: type === "success" ? `rgb(${primaryColor})` : "#FF3A33"
    })
  }

  // Crear o actualizar clase
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem("token")
      if (!token || !selectedCourse) return

      let url = "http://localhost:5000/api/class"
      let method = "POST"
      let successMessage = "Clase creada exitosamente"
      
      const payload = {
        course_id: selectedCourse,
        class_date: newClass.date,
        class_title: newClass.title,
        class_description: newClass.description,
        duration: newClass.duration
      }
      
      // Si estamos en modo de edición, usamos PUT
      if (isEditMode && newClass.class_id) {
        url = `http://localhost:5000/api/class/${newClass.class_id}`
        method = "PUT"
        successMessage = "Clase actualizada exitosamente"
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      
      if (data.success) {
        // Actualizar la lista de clases
        if (isEditMode) {
          setClasses(classes.map(cls => 
            cls.class_id === newClass.class_id ? {...data.data} : cls
          ))
        } else {
          setClasses([...classes, data.data])
        }
        
        // Limpiar el formulario
        resetClassForm()
        showAlert("success", successMessage)
      } else {
        showAlert("error", data.message || "Error al guardar la clase")
      }
    } catch (err) {
      console.error("Error al guardar clase:", err)
      showAlert("error", "Error al guardar la clase")
    }
  }
  
  // Eliminar clase
  const handleDeleteClass = async (classId: string) => {
    try {
      // Confirmación con SweetAlert2 usando colores primarios
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb')
      
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: `rgb(${primaryColor})`,
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      
      if (result.isConfirmed) {
        const token = localStorage.getItem("token")
        if (!token) return
        
        const res = await fetch(`http://localhost:5000/api/class/${classId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const data = await res.json()
        
        if (data.success) {
          // Actualizar la lista de clases
          setClasses(classes.filter(cls => cls.class_id !== classId))
          if (selectedClass === classId) {
            setSelectedClass(classes.length > 1 ? classes[0].class_id : null)
          }
          showAlert("success", "Clase eliminada exitosamente")
        } else {
          showAlert("error", data.message || "Error al eliminar la clase")
        }
      }
    } catch (err) {
      console.error("Error al eliminar clase:", err)
      showAlert("error", "Error al eliminar la clase")
    }
  }
  
  // Editar clase
  const handleEditClass = (cls: Class) => {
    setNewClass({
      title: cls.class_title,
      date: cls.class_date,
      description: cls.class_description || "",
      duration: cls.duration || 60,
      class_id: cls.class_id
    })
    setIsEditMode(true)
    setShowClassForm(true)
  }
  
  // Resetear formulario de clase
  const resetClassForm = () => {
    setNewClass({
      title: "",
      date: "",
      description: "",
      duration: 60,
      class_id: ""
    })
    setIsEditMode(false)
    setShowClassForm(false)
  }

  // Registrar asistencia
  const handleRecordAttendance = async (studentId: string, status: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token || !selectedClass) return

      const student = students.find(s => s.user_id === studentId)
      const notes = student?.notes || ""

      const res = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          class_id: selectedClass,
          user_id: studentId,
          status: status,
          notes: notes
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.user_id === studentId 
              ? { ...student, attendance_status: status } 
              : student
          )
        )
        
        const statusMap: Record<string, string> = {
          "present": "presente",
          "absent": "ausente",
          "pending": "pendiente"
        }
        
        showAlert("success", `Estudiante marcado como ${statusMap[status] || status}`)
      } else {
        showAlert("error", "Error al registrar asistencia")
      }
    } catch (err) {
      console.error("Error al registrar asistencia:", err)
      showAlert("error", "Error al registrar asistencia")
    }
  }

  // Formatear fecha y hora para mostrar
  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  // Función para manejar el cambio de notas
  const handleNoteChange = (userId: string, note: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.user_id === userId 
          ? { ...student, notes: note }
          : student
      )
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Particles />
        <Sidebar />
        <div className="flex justify-center items-center min-h-screen ml-0 md:ml-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 mb-4 text-[rgb(var(--primary-rgb))]" />
            <p className="text-xl font-medium">Cargando dashboard...</p>
          </motion.div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <Particles />
        <Sidebar />
        <div className="flex justify-center items-center min-h-screen ml-0 md:ml-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 mb-4 text-red-500" />
            <p className="text-xl font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="button-primary mt-4"
            >
              Reintentar
            </button>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Particles />
      <Sidebar />
      
      <div className="py-12 px-4 md:px-8 lg:px-12 ml-0 md:ml-16">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-[rgb(var(--primary-rgb))]" />
            Panel del Profesor
          </h1>
          <p className="text-[rgb(var(--foreground-rgb))] opacity-70">
            Gestiona tus cursos, clases y la asistencia de tus estudiantes
          </p>
        </motion.div>

        {/* Pestañas */}
        <div className="flex border-b border-[rgba(var(--foreground-rgb),0.1)] mb-6">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-all ${activeTab === "courses" ? "border-b-2 border-[rgb(var(--primary-rgb))] text-[rgb(var(--primary-rgb))]" : "hover:bg-[rgba(var(--foreground-rgb),0.03)]"}`}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>Mis Cursos</span>
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-all ${activeTab === "classes" ? "border-b-2 border-[rgb(var(--primary-rgb))] text-[rgb(var(--primary-rgb))]" : "hover:bg-[rgba(var(--foreground-rgb),0.03)]"}`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Mis Clases</span>
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-all ${activeTab === "attendance" ? "border-b-2 border-[rgb(var(--primary-rgb))] text-[rgb(var(--primary-rgb))]" : "hover:bg-[rgba(var(--foreground-rgb),0.03)]"}`}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Asistencia</span>
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6 shadow-sm">
          {/* Pestaña: Mis Cursos */}
          {activeTab === "courses" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Cursos Asignados</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                  >
                    {courses.map(course => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedCourse && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <motion.div
                      key={course.course_id}
                      whileHover={{ y: -5 }}
                      className={`bg-[rgba(var(--foreground-rgb),0.03)] border rounded-xl p-6 cursor-pointer transition-all ${selectedCourse === course.course_id ? "border-[rgb(var(--primary-rgb))] shadow-md" : "border-[rgba(var(--foreground-rgb),0.1)] hover:shadow-md"}`}
                      onClick={() => setSelectedCourse(course.course_id)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                          {course.course_image ? (
                            <img
                              src={course.course_image}
                              alt={course.course_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                              <FontAwesomeIcon icon={faChalkboardTeacher} className="h-8 w-8 text-[rgb(var(--primary-rgb))]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{course.course_name}</h3>
                          <p className="text-sm opacity-70">{course.students_count} estudiantes</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-70">Asignado</span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveTab("classes")
                            }}
                            className="button-secondary text-sm px-3 py-1"
                          >
                            Ver clases
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveTab("attendance")
                            }}
                            className="button-primary text-sm px-3 py-1"
                          >
                            Asistencia
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Pestaña: Mis Clases */}
          {activeTab === "classes" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Clases Programadas</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                  >
                    {courses.map(course => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      resetClassForm()
                      setShowClassForm(true)
                    }}
                    className="button-primary flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCalendarPlus} />
                    <span>Nueva Clase</span>
                  </button>
                </div>
              </div>

              {/* Formulario para crear/editar clase */}
              <AnimatePresence>
                {showClassForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6 shadow-md">
                      <h3 className="text-lg font-semibold mb-4">
                        {isEditMode ? "Editar Clase" : "Programar Nueva Clase"}
                      </h3>
                      <form onSubmit={handleSaveClass}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Título</label>
                            <input
                              type="text"
                              value={newClass.title}
                              onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                              className="w-full bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Fecha y Hora</label>
                            <input
                              type="datetime-local"
                              value={newClass.date}
                              onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                              className="w-full bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Descripción</label>
                            <textarea
                              value={newClass.description}
                              onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                              className="w-full bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Duración (minutos)</label>
                            <input
                              type="number"
                              value={newClass.duration}
                              onChange={(e) => setNewClass({...newClass, duration: parseInt(e.target.value) || 60})}
                              className="w-full bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                              min="30"
                              max="240"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={resetClassForm}
                            className="button-secondary"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="button-primary"
                          >
                            {isEditMode ? "Actualizar" : "Crear"} Clase
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lista de clases */}
              <div className="space-y-4">
                {classes.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faClock} className="h-12 w-12 mb-4 text-[rgb(var(--primary-rgb))] opacity-50" />
                    <p className="text-lg opacity-70">No hay clases programadas para este curso</p>
                    <button
                      onClick={() => {
                        resetClassForm()
                        setShowClassForm(true)
                      }}
                      className="button-primary mt-4"
                    >
                      Programar primera clase
                    </button>
                  </div>
                ) : (
                  classes.map(cls => (
                    <motion.div
                      key={cls.class_id}
                      whileHover={{ scale: 1.01 }}
                      className={`bg-[rgba(var(--foreground-rgb),0.03)] border rounded-xl p-6 cursor-pointer transition-all ${selectedClass === cls.class_id ? "border-[rgb(var(--primary-rgb))] shadow-md" : "border-[rgba(var(--foreground-rgb),0.1)] hover:shadow-md"}`}
                      onClick={() => {
                        setSelectedClass(cls.class_id)
                        setActiveTab("attendance")
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{cls.class_title}</h3>
                          <p className="text-sm opacity-70 mb-2">{new Date(cls.class_date).toLocaleString()}</p>
                          {cls.class_description && (
                            <p className="text-sm opacity-80">{cls.class_description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditClass(cls)
                            }}
                            className="p-2 text-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.1)] rounded-full"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClass(cls.class_id)
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Pestaña: Asistencia */}
          {activeTab === "attendance" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Registro de Asistencia</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedClass || ""}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-rgb))]"
                  >
                    {classes.map(cls => (
                      <option key={cls.class_id} value={cls.class_id}>
                        {cls.class_title} - {new Date(cls.class_date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedClass && (
                <div>
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Estado de la clase:</h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500"></div>
                        <span className="text-sm">Presente: {students.filter(s => s.attendance_status === "present").length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-red-500"></div>
                        <span className="text-sm">Ausente: {students.filter(s => s.attendance_status === "absent").length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Pendiente: {students.filter(s => !s.attendance_status || s.attendance_status === "pending").length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[rgba(var(--foreground-rgb),0.1)]">
                          <th className="text-left py-3 px-4">Estudiante</th>
                          <th className="text-left py-3 px-4">Asistencia</th>
                          <th className="text-left py-3 px-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center py-8">
                              No hay estudiantes inscritos en este curso
                            </td>
                          </tr>
                        ) : (
                          students.map(student => (
                            <tr key={student.user_id} className="border-b border-[rgba(var(--foreground-rgb),0.05)] hover:bg-[rgba(var(--foreground-rgb),0.02)]">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                    {student.user_image ? (
                                      <img
                                        src={student.user_image}
                                        alt={`${student.user_name} ${student.user_lastname}`}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{student.user_name} {student.user_lastname}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  student.attendance_status === "present" 
                                    ? "bg-green-500/10 text-green-500" 
                                    : student.attendance_status === "absent" 
                                      ? "bg-red-500/10 text-red-500" 
                                      : "bg-yellow-500/10 text-yellow-500"
                                }`}>
                                  {student.attendance_status === "present" 
                                    ? "Presente" 
                                    : student.attendance_status === "absent" 
                                      ? "Ausente" 
                                      : "Pendiente"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  placeholder="Notas"
                                  className="border rounded p-1"
                                  onChange={(e) => handleNoteChange(student.user_id, e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRecordAttendance(student.user_id, "present")}
                                    className={`p-2 rounded-full ${student.attendance_status === "present" ? "bg-green-500/20 text-green-500" : "hover:bg-[rgba(var(--foreground-rgb),0.1)]"}`}
                                    title="Marcar como presente"
                                  >
                                    <FontAwesomeIcon icon={faUserCheck} />
                                  </button>
                                  <button
                                    onClick={() => handleRecordAttendance(student.user_id, "absent")}
                                    className={`p-2 rounded-full ${student.attendance_status === "absent" ? "bg-red-500/20 text-red-500" : "hover:bg-[rgba(var(--foreground-rgb),0.1)]"}`}
                                    title="Marcar como ausente"
                                  >
                                    <FontAwesomeIcon icon={faUserTimes} />
                                  </button>
                                  <button
                                    onClick={() => handleRecordAttendance(student.user_id, "pending")}
                                    className={`p-2 rounded-full ${(!student.attendance_status || student.attendance_status === "pending") ? "bg-yellow-500/20 text-yellow-500" : "hover:bg-[rgba(var(--foreground-rgb),0.1)]"}`}
                                    title="Marcar como pendiente"
                                  >
                                    <FontAwesomeIcon icon={faUserClock} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}