"use client"
import { useState, type FormEvent } from "react"
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
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import { motion } from "framer-motion"

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
    role_id: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (formData.user_password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      //Datos JSON
      const userData = {
        user: {
          user_name: formData.user_name,
          user_lastname: formData.user_lastname,
          user_document_type: formData.user_document_type,
          user_document: formData.user_document,
          user_email: formData.user_email,
          user_password: formData.user_password,
          user_phone: formData.user_phone,
          user_birth: formData.user_birth,
          role_id: formData.role_id,
        }
      }

      console.log("Enviando datos:", userData) 
      //uso API
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(userData),
        mode: "cors",
        credentials: "include",
      })
      
      //respuesta en consola
      console.log("Respuesta Status", response.status);
      console.log("Respuesta Headers", [...response.headers.entries()]);

      // Verifica si la respuesta es JSON
      const contentType = response.headers.get("content-type")
      
      let result
      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        const text = await response.text()
        console.error("Respuesta no JSON:", text)
        throw new Error("El servidor no respondió con JSON. Verifica la URL del endpoint.")
      }

      if (!response.ok) {
        throw new Error(result.message || "Error al registrar usuario")
      }

      console.log("Registro exitoso:", result)
      router.push("/login")
    } catch (error: unknown) {
      const err = error as Error
      setError(err.message)
      console.error("Error completo:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

      <div className="container mx-auto px-4 z-10">
        <motion.div
          variants={containerVariants}
          className="flex flex-col items-center justify-center max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] w-full"
            whileHover={{ y: -5 }}
          >
            <motion.h2 className="text-3xl font-bold text-white text-center mb-6">Crear Cuenta</motion.h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campos */}
              {[
                { name: "user_name", label: "Nombre", icon: faUser },
                { name: "user_lastname", label: "Apellido", icon: faUser },
                { name: "user_document", label: "Documento", icon: faIdCard },
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
                { name: "user_email", label: "Correo Electrónico", icon: faEnvelope, type: "email" },
                { name: "user_password", label: "Contraseña (mín. 8 caracteres)", icon: faLock, type: "password" },
                { name: "user_phone", label: "Teléfono", icon: faPhone },
                { name: "user_birth", label: "Fecha de Nacimiento", icon: faBirthdayCake, type: "date" },
                {
                  name: "role_id",
                  label: "Rol",
                  icon: faUserTag,
                  isSelect: true,
                  options: [
                    { value: "1", label: "Administrador" },
                    { value: "2", label: "Profesor" },
                    { value: "3", label: "Estudiante" },
                  ],
                },
              ].map((field, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col">
                  <label className="text-sm font-medium text-yellow-300 flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={field.icon} className="text-[rgb(var(--primary-rgb))]" />
                    {field.label}
                  </label>
                  {field.isSelect ? (
                    <select
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all font-medium"
                      style={{ color: "white", fontWeight: "500" }}
                      required
                    >
                      <option value="" style={{ backgroundColor: "#1a1a1a", color: "white" }}>
                        Seleccionar {field.label.toLowerCase()}
                      </option>
                      {field.options?.map((option, idx) => (
                        <option key={idx} value={option.value} style={{ backgroundColor: "#1a1a1a", color: "white" }}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <motion.input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={field.label}
                      className="p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all font-medium"
                      style={{ color: "white", fontWeight: "500" }}
                      required
                    />
                  )}
                </motion.div>
              ))}

              <div className="md:col-span-2 mt-2">
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

              {error && (
                <motion.div
                  className="md:col-span-2 p-3 bg-red-500/20 border border-red-500/30 rounded-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-red-400 text-center text-sm">{error}</p>
                </motion.div>
              )}
            </form>

            <div className="text-center text-white text-sm pt-4">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-[rgb(var(--primary-rgb))] hover:underline">
                Inicia sesión
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Estilos globales para los select */}
      <style jsx global>{`
        select option {
          background-color: #1a1a1a;
          color: white;
          font-weight: 500;
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        /* Mejora la apariencia del selector de fecha */
        input[type="date"] {
          color-scheme: dark;
        }
        
        /* Mejora la apariencia del selector */
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FFD700' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }
      `}</style>
    </motion.div>
  )
}

export default Register