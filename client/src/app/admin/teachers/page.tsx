"use client"
import { useState, useEffect, type FormEvent } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUserGear,
  faPlus,
  faUser,
  faSchool,
  faBook,
  faEnvelope,
  faLock,
  faIdCard,
  faPhone,
  faBirthdayCake,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Swal from "sweetalert2"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface FormField {
  name: string
  label: string
  icon: IconDefinition
  type?: string
  pattern?: string
  title?: string
  minLength?: number
  isSelect?: boolean
  options?: Array<{
    value: string
    label: string
  }>
  showIf?: boolean
  required?: boolean
}

interface FormSection {
  section: string
  fields: FormField[]
}

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
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTeacher, setNewTeacher] = useState({
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_phone: "",
    user_password: "",
    user_document_type: "",
    user_document: "",
    user_image: "default.jpg",
    user_birth: "",
    school_id: "",
    role_id: 2, 
  })

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer
      toast.onmouseleave = Swal.resumeTimer
    },
  })

  const showToast = (type: "success" | "error" | "warning" | "info", message: string) => {
    Toast.fire({
      icon: type,
      title: message,
      background: "#1a1a1a",
      color: "#ffffff",
      iconColor:
        type === "success"
          ? "rgb(var(--primary-rgb))"
          : type === "error"
            ? "#f87171"
            : type === "warning"
              ? "#fbbf24"
              : "#60a5fa",
    })
  }

  const showErrorAlert = (message: string) => {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonText: "Intentar de nuevo",
      background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "#f87171",
      confirmButtonColor: "rgb(var(--primary-rgb))",
      customClass: {
        popup: "border border-red-500/30 rounded-xl",
        title: "text-red-400",
        htmlContainer: "text-gray-300",
      },
    })
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Error de Autenticación",
            text: "Por favor, inicia sesión para continuar",
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Error de autenticación")
        }

        if (!data.user) {
          throw new Error("No se encontró información del usuario")
        }

        if (data.user.role_id !== 3) {
          Swal.fire({
            icon: "error",
            title: "Acceso Denegado",
            text: "Solo los administradores pueden acceder a esta sección",
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
          router.push("/")
          return
        }

        setUser(data.user)
        const schoolResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-schools`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!schoolResponse.ok) {
          const errorData = await schoolResponse.json()
          throw new Error(errorData.message || "Error al cargar las escuelas")
        }

        const schoolData = await schoolResponse.json()
        
        if (!schoolData.data || schoolData.data.length === 0) {
          Swal.fire({
            icon: "info",
            title: "Sin Escuelas",
            text: "No tienes escuelas asignadas para gestionar",
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
        }

        setSchools(schoolData.data || [])
        setIsLoading(false)
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Ha ocurrido un error al cargar los datos",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTeacher({
      ...newTeacher,
      [name]: value,
    })
  }

  const handleCreateTeacher = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Sesión expirada. Por favor, inicia sesión nuevamente.",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
        })
        router.push("/login")
        return
      }

      if (!newTeacher.user_name || !newTeacher.user_lastname || !newTeacher.user_email || 
          !newTeacher.user_password || !newTeacher.user_phone || !newTeacher.user_birth || 
          !newTeacher.user_document || !newTeacher.user_document_type || !newTeacher.school_id) {
        throw new Error("Todos los campos son requeridos")
      }

      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
      if (!nameRegex.test(newTeacher.user_name) || !nameRegex.test(newTeacher.user_lastname)) {
        throw new Error("El nombre y apellido solo pueden contener letras")
      }

      const phoneRegex = /^\d+$/
      if (!phoneRegex.test(newTeacher.user_phone)) {
        throw new Error("El teléfono solo puede contener números")
      }

      if (!phoneRegex.test(newTeacher.user_document)) {
        throw new Error("El documento solo puede contener números")
      }

      if (newTeacher.user_password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      const formattedDate = new Date(newTeacher.user_birth).toISOString().split("T")[0]
      showToast("info", "Creando profesor...")

      const teacherData = {
        ...newTeacher,
        user_birth: formattedDate,
        role_id: 2,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teacherData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Error al crear profesor")
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Profesor creado correctamente",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      })

      setShowTeacherModal(false)
      setNewTeacher({
        user_name: "",
        user_lastname: "",
        user_email: "",
        user_phone: "",
        user_password: "",
        user_document_type: "",
        user_document: "",
        user_image: "default.jpg",
        user_birth: "",
        school_id: "",
        role_id: 2,
      })

      await handleSchoolSelect(newTeacher.school_id)
    } catch (error: any) {
      showErrorAlert(error.message || "Ha ocurrido un error al crear el profesor")
    } finally {
      setIsSubmitting(false)
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

      if (!selectedTeacher || !selectedTeacher.user_id || !selectedTeacher.course_id) {
        throw new Error("Por favor selecciona un profesor y un curso")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courseteacher/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: selectedTeacher.course_id,
          teacher_id: selectedTeacher.user_id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al asignar el profesor")
      }

      showToast("success", "Profesor asignado al curso correctamente")
      setShowAssignModal(false)
      setSelectedTeacher(null)

      await handleSchoolSelect(selectedSchool.school_id)
    } catch (error: any) {
      showErrorAlert(error.message || "Ha ocurrido un error al asignar el profesor")
    }
  }

  const handleSchoolSelect = async (schoolId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Sesión expirada. Por favor, inicia sesión nuevamente.",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
        })
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teachers/school/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al cargar los profesores")
      }

      const data = await response.json()

      setTeachers(data.data || [])
      const schoolObj = schools.find((s) => s.school_id === schoolId)
      setSelectedSchool({ ...schoolObj, courses: data.courses || [] })
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al cargar los profesores",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      })
    }
  }

  // Definición de los campos del formulario
  const formFields: FormSection[] = [
    {
      section: "Información Personal",
      fields: [
        {
          name: "user_name",
          label: "Nombre",
          icon: faUser,
          pattern: "^[A-Za-zÁÉÍÓÚáéíóúñÑ\\s]+$",
          title: "Solo letras y espacios",
        },
        {
          name: "user_lastname",
          label: "Apellido",
          icon: faUser,
          pattern: "^[A-Za-zÁÉÍÓÚáéíóúñÑ\\s]+$",
          title: "Solo letras y espacios",
        },
        { name: "user_birth", label: "Fecha de Nacimiento", icon: faBirthdayCake, type: "date" },
      ],
    },
    {
      section: "Información de Contacto",
      fields: [
        { name: "user_email", label: "Correo Electrónico", icon: faEnvelope, type: "email" },
        { name: "user_phone", label: "Teléfono", icon: faPhone, pattern: "^\\d+$", title: "Solo números" },
      ],
    },
    {
      section: "Información de Identificación",
      fields: [
        { name: "user_document", label: "Documento", icon: faIdCard, pattern: "^\\d+$", title: "Solo números" },
        {
          name: "user_document_type",
          label: "Tipo de Documento",
          icon: faIdBadge,
          isSelect: true,
          options: [
            { value: "TI", label: "TI" },
            { value: "CC", label: "CC" },
            { value: "CE", label: "CE" },
          ],
        },
      ],
    },
    {
      section: "Información de Cuenta",
      fields: [
        {
          name: "user_password",
          label: "Contraseña (mín. 8 caracteres)",
          icon: faLock,
          type: "password",
          minLength: 8,
        },
        {
          name: "school_id",
          label: "Escuela",
          icon: faSchool,
          isSelect: true,
          options: schools.map((school) => ({
            value: school.school_id,
            label: school.school_name,
          })),
        },
      ],
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
    <motion.div initial="hidden" animate="visible" className="min-h-screen w-full relative overflow-hidden bg-black">
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

        {/* Botón para abrir modal de crear profesor */}
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => setShowTeacherModal(true)}
            className="bg-[rgb(var(--primary-rgb))] text-black p-4 rounded-full shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} className="text-2xl" />
          </motion.button>
        </div>

        {/* Teachers list */}
        {selectedSchool && (
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-4xl border-2 border-[rgba(var(--primary-rgb),0.4)] max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-white">Crear Nuevo Profesor</h2>
              <form onSubmit={handleCreateTeacher} className="space-y-6">
                {formFields.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <h3 className="text-xl font-semibold text-[rgb(var(--primary-rgb))] mb-3">{section.section}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex flex-col">
                          <label className="text-sm font-medium text-yellow-300 flex items-center gap-2 mb-1">
                            <FontAwesomeIcon icon={field.icon} className="text-[rgb(var(--primary-rgb))]" />
                            {field.label}
                          </label>
                          {field.isSelect ? (
                            <select
                              name={field.name}
                              value={newTeacher[field.name as keyof typeof newTeacher]}
                              onChange={handleChange}
                              className="p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all font-medium"
                              required={field.required !== false}
                            >
                              <option value="">Seleccionar {field.label.toLowerCase()}</option>
                              {field.options?.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type || "text"}
                              name={field.name}
                              value={newTeacher[field.name as keyof typeof newTeacher]}
                              onChange={handleChange}
                              placeholder={field.label}
                              className="p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all font-medium"
                              required={field.required !== false}
                              pattern={field.pattern}
                              title={field.title}
                              minLength={field.minLength}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowTeacherModal(false)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                  >
                    {isSubmitting ? "Creando..." : "Crear Profesor"}
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
                    value={selectedTeacher.course_id || ""}
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
                    onClick={() => {
                      setShowAssignModal(false)
                      setSelectedTeacher(null)
                    }}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedTeacher.course_id}
                    className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Asignar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      <style jsx global>{`
        select option {
          background-color: #1a1a1a;
          color: white;
          font-weight: 500;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        input[type="date"] {
          color-scheme: dark;
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FFD700' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }

        /* SweetAlert2 custom styles */
        .swal2-popup {
          font-family: inherit;
        }

        .swal2-styled.swal2-confirm {
          font-weight: 600;
        }

        .swal2-timer-progress-bar {
          background: rgba(var(--primary-rgb), 0.5);
        }
      `}</style>
    </motion.div>
  )
}

export default TeachersPage
