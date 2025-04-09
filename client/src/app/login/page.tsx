"use client"
import { useState, useEffect, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Particles } from "@/components/particles"
import {
  faHome,
  faUser,
  faEnvelope,
  faSignIn, 
  faLock,
} from "@fortawesome/free-solid-svg-icons"
import { motion } from "framer-motion"

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

const Login: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Verificar si hay un token almacenado
    const token = localStorage.getItem("token")
    if (token) {
      checkAuthAndRedirect(token)
    }
  }, [])

  const checkAuthAndRedirect = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        
        // Redirigir según el rol
        switch (data.user.role) {
          case 1: // Estudiante
            router.push("/student/dashboard")
            break
          case 3: // Administrador
            router.push("/admin/dashboard")
            break
          case 4: // Coordinador
            router.push("/coordinator/dashboard")
            break
          default:
            router.push("/")
        }
      } else {
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error)
      localStorage.removeItem("token")
      setIsAuthenticated(false)
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email || !password) {
      setError("Por favor, complete todos los campos")
      setIsLoading(false)
      return
    }

    const data = {
      user: {
        user_email: email,
        user_password: password,
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Error al validar usuario")
      }

      const accessToken = result?.data?.token
      if (accessToken) {
        localStorage.setItem("token", accessToken)
        checkAuthAndRedirect(accessToken)
      } else {
        throw new Error("No se recibió el token de acceso")
      }
    } catch (error: unknown) {
      const err = error as Error
      console.error("Error en login:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Si ya está autenticado, no mostrar el formulario
  if (isAuthenticated) {
    return null
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black"
    >
      <Particles />
      {/* Home button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Link
          href="/"
          className="fixed top-4 left-4 z-40 p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
        >
          <FontAwesomeIcon icon={faHome} className="w-5 h-5" /> 
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 z-10">
        <motion.div 
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto"
        >
          {/* Left side - Call to action */}
          <motion.div 
            variants={itemVariants}
            className="text-center lg:text-left text-white space-y-4 lg:w-2/5"
          >
            <motion.h1 
              className="text-3xl lg:text-5xl font-bold"
              whileHover={{ x: 5 }}
            >
              ¿No tienes cuenta aún?
            </motion.h1>
            <motion.p 
              className="text-lg pb-6 max-w-md mx-auto lg:mx-0"
              whileHover={{ x: 5 }}
            >
              Si no te has creado tu cuenta puedes registrarte en el siguiente botón.
            </motion.p>
            <motion.div
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all bg-transparent hover:bg-[rgba(var(--primary-rgb),0.2)] text-white border border-[rgb(var(--primary-rgb))]"
              >
                <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" /> 
                <span>Registrate</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div 
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] w-full max-w-md lg:w-3/5"
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className="relative bg-black/40 p-6 rounded-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >

                </motion.div>
                <motion.h2 
                  className="text-3xl font-bold text-white"
                  whileHover={{ scale: 1.02 }}
                >
                  Inicio de sesión
                </motion.h2>
                <motion.p 
                  className="text-gray-300 mt-2"
                  whileHover={{ scale: 1.01 }}
                >
                  Ingresa tus credenciales para acceder a todas las funcionalidades.
                </motion.p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div 
                  className="space-y-1"
                  variants={itemVariants}
                >
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[rgb(var(--primary-rgb))]" />
                    <span>
                      Correo Electrónico <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                <motion.div 
                  className="space-y-1"
                  variants={itemVariants}
                >
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} className="text-[rgb(var(--primary-rgb))]" />
                    <span>
                      Contraseña <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[rgb(var(--primary-rgb))] focus:ring-[rgb(var(--primary-rgb))] border-gray-700 rounded bg-black/50"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Recordarme
                    </label>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-[rgb(var(--primary-rgb))] hover:text-[rgba(var(--primary-rgb),0.8)]"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.9)] text-black font-bold py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  {isLoading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSignIn} /> 
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </motion.button>

                {error && (
                  <motion.div 
                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-red-400 text-center text-sm">{error}</p>
                  </motion.div>
                )}

                <motion.div 
                  className="text-center"
                  variants={itemVariants}
                >
                  <p className="text-white text-sm">
                    ¿Aún no tienes cuenta?{" "}
                    <Link 
                      href="/register" 
                      className="text-[rgb(var(--primary-rgb))] hover:text-[rgba(var(--primary-rgb),0.8)] transition-colors"
                    >
                      Crear una ahora
                    </Link>
                  </p>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Login