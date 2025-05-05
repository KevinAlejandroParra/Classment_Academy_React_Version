"use client"
import { useState,  useEffect, type FormEvent } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faUser,
  faEnvelope,
  faLock,
  faIdCard,
  faPhone,
  faBirthdayCake,
  faUserTag,
  faIdBadge,
  faSchool
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import { motion } from "framer-motion"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import Swal from "sweetalert2"

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

const Register: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    user_document: "",
    user_document_type: "",
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    user_birth: "",
    role_id: "1",
    school_id: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [schools, setSchools] = useState<Array<{school_id: string, school_name: string}>>([])
  const [loadingSchools, setLoadingSchools] = useState(false)

  // Cargar escuelas al montar el componente
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true)
        const response = await fetch('http://localhost:5000/api/schools')
        const data = await response.json()
        if (data.success) {
          setSchools(data.data)
        }
      } catch (error) {
        console.error("Error fetching schools:", error)
        showToast('error', 'Error al cargar las escuelas')
      } finally {
        setLoadingSchools(false)
      }
    }
    
    fetchSchools()
  }, [])

  // Custom SweetAlert toast configuration
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const showSuccessAlert = () => {
    Swal.fire({
      title: "¡Registro Exitoso!",
      text: "Tu cuenta ha sido creada correctamente",
      icon: "success",
      confirmButtonText: "Continuar",
      background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "rgb(var(--primary-rgb))",
      confirmButtonColor: "rgb(var(--primary-rgb))",
      customClass: {
        popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
    }).then(() => {
      router.push("/login")
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Log para ver los datos del formulario
      console.log("Datos del formulario:", formData)

      // Validaciones en el frontend
      const requiredFields = [
        'user_name',
        'user_lastname',
        'user_email',
        'user_password',
        'user_phone',
        'user_birth',
        'user_document',
        'user_document_type',
        'role_id'
      ]

      // Verificar campos requeridos
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
      
      // Si el rol es coordinador o profesor, verificar también school_id
      if ((formData.role_id === "4" || formData.role_id === "2") && !formData.school_id) {
        missingFields.push('school_id')
      }

      if (missingFields.length > 0) {
        console.log("Campos faltantes:", missingFields)
        throw new Error("Todos los campos son requeridos")
      }

      // Validación de nombre y apellido (solo letras)
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
      if (!nameRegex.test(formData.user_name) || !nameRegex.test(formData.user_lastname)) {
        throw new Error("El nombre y apellido solo pueden contener letras")
      }

      // Validación de teléfono (solo números)
      const phoneRegex = /^\d+$/
      if (!phoneRegex.test(formData.user_phone)) {
        throw new Error("El teléfono solo puede contener números")
      }

      // Validación de documento (solo números)
      if (!phoneRegex.test(formData.user_document)) {
        throw new Error("El documento solo puede contener números")
      }

      // Validación de contraseña
      if (formData.user_password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      // Asegurar que la fecha esté en formato YYYY-MM-DD
      const formattedDate = new Date(formData.user_birth).toISOString().split("T")[0]

      // Preparar datos para enviar
      const userData = {
        ...formData,
        role_id: Number.parseInt(formData.role_id),
        user_birth: formattedDate,
        user_image: "images/users/default.jpg",
        // Solo incluir school_id si el rol es coordinador o profesor
        school_id: (formData.role_id === "4" || formData.role_id === "2") ? formData.school_id : undefined
      };

      console.log("Datos a enviar al servidor:", userData)
      showToast("info", "Procesando registro...")

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
        mode: "cors",
        credentials: "include",
      })

      const result = await response.json()
      console.log("Respuesta del servidor:", result)

      if (!response.ok) {
        throw new Error(result.message || "Error al registrar usuario")
      }

      console.log("Registro exitoso:", result)
      showSuccessAlert()
    } catch (error: unknown) {
      const err = error as Error
      showErrorAlert(err.message)
      console.error("Error completo:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
            { value: "CC", label: "CC" },
            { value: "TI", label: "TI" },
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
          name: "role_id",
          label: "Rol",
          icon: faUserTag,
          isSelect: true,
          options: [
            { value: "1", label: "Estudiante" },
            { value: "3", label: "Coordinador" }, // admin pendiente
          ],
        },
      ],
    },
  ]

  return (
      <motion.div
          initial="hidden"
          animate="visible"
          className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black"
      >
          <Particles />
          <Link
              href="/"
              className="fixed top-4 left-4 z-40 p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
          >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
          </Link>

          <div className="container mx-auto px-4 z-10 py-8">
              <motion.div
                  variants={containerVariants}
                  className="flex flex-col items-center justify-center max-w-4xl mx-auto"
              >
                  <motion.div
                      variants={itemVariants}
                      className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] w-full"
                      whileHover={{ y: -5 }}
                  >
                      <motion.h2 className="text-3xl font-bold text-white text-center mb-6">
                          Crear Cuenta
                      </motion.h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                          {formFields.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="space-y-4">
                                  <h3 className="text-xl font-semibold text-[rgb(var(--primary-rgb))] mb-3">
                                      {section.section}
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {section.fields.map(
                                          (field, fieldIndex) =>
                                              // Renderizado condicional con showIf
                                              (field.showIf === undefined || field.showIf) && (
                                                  <motion.div
                                                      key={fieldIndex}
                                                      variants={itemVariants}
                                                      className="flex flex-col"
                                                  >
                                                      <label className="text-sm font-medium text-yellow-300 flex items-center gap-2 mb-1">
                                                          <FontAwesomeIcon
                                                              icon={field.icon}
                                                              className="text-[rgb(var(--primary-rgb))]"
                                                          />
                                                          {field.label}
                                                      </label>
                                                      {field.isSelect ? (
                                                          <select
                                                              name={field.name}
                                                              value={
                                                                  formData[
                                                                      field.name as keyof typeof formData
                                                                  ]
                                                              }
                                                              onChange={handleChange}
                                                              className="p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all font-medium"
                                                              style={{
                                                                  color: "white",
                                                                  fontWeight: "500",
                                                              }}
                                                              required={field.required !== false}
                                                          >
                                                              <option
                                                                  value=""
                                                                  style={{
                                                                      backgroundColor: "#1a1a1a",
                                                                      color: "white",
                                                                  }}
                                                              >
                                                                  Seleccionar{" "}
                                                                  {field.label.toLowerCase()}
                                                              </option>
                                                              {field.options?.map((option, idx) => (
                                                                  <option
                                                                      key={idx}
                                                                      value={option.value}
                                                                      style={{
                                                                          backgroundColor:
                                                                              "#1a1a1a",
                                                                          color: "white",
                                                                      }}
                                                                  >
                                                                      {option.label}
                                                                  </option>
                                                              ))}
                                                          </select>
                                                      ) : (
                                                          <motion.input
                                                              type={field.type || "text"}
                                                              name={field.name}
                                                              value={
                                                                  formData[
                                                                      field.name as keyof typeof formData
                                                                  ]
                                                              }
                                                              onChange={handleChange}
                                                              placeholder={field.label}
                                                              className="p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all font-medium"
                                                              style={{
                                                                  color: "white",
                                                                  fontWeight: "500",
                                                              }}
                                                              required={field.required !== false}
                                                              pattern={field.pattern}
                                                              title={field.title}
                                                              minLength={field.minLength}
                                                          />
                                                      )}
                                                  </motion.div>
                                              )
                                      )}
                                  </div>
                              </div>
                          ))}

                          <div className="mt-6">
                              <motion.button
                                  type="submit"
                                  disabled={isLoading}
                                  className="w-full bg-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.9)] text-black font-bold py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
                                  whileHover={buttonHover}
                                  whileTap={buttonTap}
                              >
                                  {isLoading ? "Registrando..." : "Registrarse"}
                              </motion.button>
                          </div>
                      </form>

                      <div className="text-center text-white text-sm pt-4">
                          ¿Ya tienes una cuenta?{" "}
                          <Link
                              href="/login"
                              className="text-[rgb(var(--primary-rgb))] hover:underline"
                          >
                              Inicia sesión
                          </Link>
                      </div>
                  </motion.div>
              </motion.div>
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
  );
}

export default Register
