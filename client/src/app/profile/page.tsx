"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { Particles } from "@/components/particles"
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faEdit,
  faTrash,
  faSignOutAlt,
  faSchool,
  faBook,
  faSave,
  faTimes,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons"

// Tipos para los datos del usuario
interface UserData {
  id: string
  email: string
  role: number
  name: string
  lastname: string
  image: string
  document_type?: string
  document?: string
  phone?: string
  birth?: string
}

// Tipos para los cursos
interface Course {
  id: string
  name: string
  description: string
  image: string
}

// Tipos para la escuela
interface School {
  id: string
  name: string
  logo: string
  description: string
}

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

const ProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para los modales
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // Estado para el formulario de edición
  const [editForm, setEditForm] = useState<Partial<UserData>>({})
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }
        
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (!response.ok) {
          throw new Error("Error al obtener datos del usuario")
        }
        
        const data = await response.json()
        
        if (data.success && data.user) {
          setUserData(data.user)
          setEditForm(data.user)
          
          // Aquí se cargarían los cursos y la escuela del usuario
          // Por ahora usamos datos de ejemplo
          setCourses([
            {
              id: "1",
              name: "Fútbol Avanzado",
              description: "Técnicas avanzadas de fútbol para jugadores intermedios",
              image: "/Images/resources/futbol.jpg"
            },
            {
              id: "2",
              name: "Baloncesto Básico",
              description: "Fundamentos del baloncesto para principiantes",
              image: "/Images/resources/basquetbol.jpg"
            }
          ])
          
          setSchool({
            id: "1",
            name: "Academia Deportiva Elite",
            logo: "/Images/resources/school-logo.png",
            description: "Centro de formación deportiva de alto rendimiento"
          })
        } else {
          throw new Error("Datos de usuario no válidos")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error al cargar datos del usuario:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [router])
  
  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }
  
  // Función para guardar los cambios del perfil
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${userData?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: editForm }),
      })
      
      if (!response.ok) {
        throw new Error("Error al actualizar el perfil")
      }
      
      const data = await response.json()
      
      if (data.success) {
        setUserData(prev => ({ ...prev, ...editForm } as UserData))
        setShowEditModal(false)
      } else {
        throw new Error(data.message || "Error al actualizar el perfil")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error al actualizar perfil:", err)
    }
  }
  
  // Función para eliminar (desactivar) el perfil
  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${userData?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          user: { 
            user_state: "inactivo" 
          } 
        }),
      })
      
      if (!response.ok) {
        throw new Error("Error al desactivar el perfil")
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Cerrar sesión después de desactivar el perfil
        handleLogout()
      } else {
        throw new Error(data.message || "Error al desactivar el perfil")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error al desactivar perfil:", err)
    }
  }
  
  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[rgb(var(--primary-rgb))] text-xl">Cargando perfil...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">No se encontraron datos del usuario</div>
      </div>
    )
  }
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full relative overflow-hidden bg-black"
    >
      <Particles />
      
      <div className="container mx-auto px-4 py-12 z-10">
        <motion.div 
          variants={itemVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Encabezado del perfil */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[rgb(var(--primary-rgb))]"
            >
              <img
                src={userData.image} 
                alt={`${userData.name} ${userData.lastname}`}
                className="object-cover w-full h-full"
              />
            </motion.div>
            
            <div className="text-center md:text-left">
              <motion.h1 
                className="text-4xl font-bold text-white mb-2"
                variants={itemVariants}
              >
                {userData.name} {userData.lastname}
              </motion.h1>
              
              <motion.p 
                className="text-[rgb(var(--primary-rgb))] text-xl mb-4"
                variants={itemVariants}
              >
                {userData.email}
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-3 justify-center md:justify-start"
                variants={itemVariants}
              >
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-md"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Editar Perfil</span>
                </motion.button>
                
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Eliminar Perfil</span>
                </motion.button>
                
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Cerrar Sesión</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
          
          {/* Información del usuario */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {/* Información personal */}
            <div className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                <span>Información Personal</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faIdCard} className="text-[rgb(var(--primary-rgb))] w-5" />
                  <div>
                    <p className="text-gray-400 text-sm">Documento</p>
                    <p className="text-white">{userData.document_type} {userData.document}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faPhone} className="text-[rgb(var(--primary-rgb))] w-5" />
                  <div>
                    <p className="text-gray-400 text-sm">Teléfono</p>
                    <p className="text-white">{userData.phone || "No registrado"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-[rgb(var(--primary-rgb))] w-5" />
                  <div>
                    <p className="text-gray-400 text-sm">Fecha de Nacimiento</p>
                    <p className="text-white">{userData.birth ? new Date(userData.birth).toLocaleDateString() : "No registrado"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Escuela */}
            <div className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faSchool} className="text-[rgb(var(--primary-rgb))]" />
                <span>Mi Escuela</span>
              </h2>
              
              {school ? (
                <div className="space-y-4">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image 
                      src={school.logo} 
                      alt={school.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white text-center">{school.name}</h3>
                  <p className="text-gray-300 text-center">{school.description}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-center">No estás inscrito en ninguna escuela</p>
              )}
            </div>
            
            {/* Cursos */}
            <div className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faBook} className="text-[rgb(var(--primary-rgb))]" />
                <span>Mis Cursos</span>
              </h2>
              
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                      <div className="relative w-16 h-16">
                        <Image 
                          src={course.image} 
                          alt={course.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{course.name}</h3>
                        <p className="text-gray-400 text-sm">{course.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">No estás inscrito en ningún curso</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-xl bg-black/90 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Editar Perfil</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 block mb-1">Nombre</label>
                <input 
                  type="text" 
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleEditChange}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))]"
                />
              </div>
              
              <div>
                <label className="text-gray-300 block mb-1">Apellido</label>
                <input 
                  type="text" 
                  name="lastname"
                  value={editForm.lastname || ""}
                  onChange={handleEditChange}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))]"
                />
              </div>
              
              <div>
                <label className="text-gray-300 block mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleEditChange}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))]"
                />
              </div>
              
              <div>
                <label className="text-gray-300 block mb-1">Teléfono</label>
                <input 
                  type="text" 
                  name="phone"
                  value={editForm.phone || ""}
                  onChange={handleEditChange}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))]"
                />
              </div>
              
              <div>
                <label className="text-gray-300 block mb-1">Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  name="birth"
                  value={editForm.birth ? new Date(editForm.birth).toISOString().split('T')[0] : ""}
                  onChange={handleEditChange}
                  className="w-full p-3 bg-white/10 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))]"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} />
                <span>Guardar</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-xl bg-black/90 p-8 rounded-2xl shadow-2xl border-2 border-red-500/50 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Eliminar Perfil</h2>
            
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar tu perfil? Esta acción cambiará tu estado a inactivo y no podrás acceder a la plataforma.
            </p>
            
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={handleDeleteProfile}
                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>Eliminar</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Cierre de Sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-xl bg-black/90 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Cerrar Sesión</h2>
            
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas cerrar sesión?
            </p>
            
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={handleLogout}
                className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Cerrar Sesión</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default ProfilePage
