"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faArrowLeft, 
  faCalendarAlt, 
  faMoneyBillWave, 
  faUser, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faSpinner, 
  faExclamationTriangle, 
  faCheckCircle,
  faSchool,
  faGraduationCap,
  faTimes,
  faUserTie
} from "@fortawesome/free-solid-svg-icons"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"
import Image from "next/image"
import Link from "next/link"
import Swal from "sweetalert2"

interface SchoolAdmin {
  user_id: string
  user_name: string
  user_lastname: string
  user_email: string
  UserSchoolRol: {
    role_id: number
  }
}

interface Course {
  course_id: string
  course_name: string
  course_description: string
  course_price: string
  course_places: number
  course_age: number
  course_image: string
  school: {
    school_id: string
    school_name: string
    school_description: string
    school_phone: string
    school_address: string
    school_email: string
    school_image: string
    users?: SchoolAdmin[]
  }
}

// Componente Modal para la selección del plan
const EnrollmentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  coursePrice 
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  isLoading: boolean
  coursePrice: string
}) => {

 // Función para formatear el precio
 const formatPrice = (price: string) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(price))
}

if (!isOpen) return null

  

return (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[rgb(var(--background-rgb))] rounded-xl p-6 w-full max-w-md border border-[rgba(var(--foreground-rgb),0.1)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Confirmación de Pago</h3>
          <button 
            onClick={onClose} 
            className="text-[rgb(var(--foreground-rgb))] opacity-70 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="mb-6 py-4 border-y border-[rgba(var(--foreground-rgb),0.1)]">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">Valor del curso:</span>
            <span className="font-medium">{formatPrice(coursePrice)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-semibold">Total a pagar:</span>
            <span className="text-lg font-bold text-[rgb(var(--primary-rgb))]">{formatPrice(coursePrice)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm opacity-80">
            Al hacer clic en "Proceder al Pago", serás redirigido a Mercado Pago para completar la transacción de forma segura.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="button-primary flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMoneyBillWave} />
                <span>Proceder al Pago</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
)
}

export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollSuccess, setEnrollSuccess] = useState(false)
  const [enrollError, setEnrollError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [schoolAdmin, setSchoolAdmin] = useState<SchoolAdmin | null>(null)

  // Buscar detalles del curso
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const coursesResponse = await fetch("http://localhost:5000/api/courses/")
        const coursesData = await coursesResponse.json()
        
        if (coursesData.success) {
          const courseFound = coursesData.data.find((c: Course) => c.course_id === courseId)
          if (courseFound) {
            setCourse(courseFound)
            
            // Buscar información de la escuela para obtener el administrador
            const schoolsResponse = await fetch("http://localhost:5000/api/schools/")
            const schoolsData = await schoolsResponse.json()
            
            if (schoolsData.success) {
              const schoolFound = schoolsData.data.find((s: any) => s.school_id === courseFound.school.school_id);
              if (schoolFound && schoolFound.users && schoolFound.users.length > 0) {
                // Buscar el administrador (role_id = 3)
                const admin = schoolFound.users.find((user: SchoolAdmin) => 
                  user.UserSchoolRol && user.UserSchoolRol.role_id === 3
                );
                if (admin) {
                  setSchoolAdmin(admin);
                }
              }
            }
          } else {
            setError("Curso no encontrado")
          }
        } else {
          setError("Error al cargar el curso")
        }
      } catch (err) {
        setError("Error de conexión al servidor")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId])

  // Función para formatear el precio
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(price))
  }

  // Abrir modal para inscripción
  const handleOpenEnrollModal = () => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(`/courses/${courseId}`))
      return
    }
    
    setIsModalOpen(true)
  }

  // Manejar la inscripción en el curso
  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollError(null);
  
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push('/login?redirect=' + encodeURIComponent(`/courses/${courseId}`));
        return;
      }
      
      if (course) {
        const response = await fetch(`http://localhost:5000/api/payments/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            courseId: courseId,
            amount: course.course_price,
            description: `Inscripción al curso: ${course.course_name}`
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          window.open(data.paymentUrl, '_blank');
        } else {
          throw new Error(data.message || "Error al procesar el pago");
        }
      }
    } catch (error) {
      console.error('Error completo:', error);
      setEnrollError(error.message);
      
      Swal.fire({
        title: 'Error en el pago',
        text: error.message || "Ocurrió un error al procesar tu pago",
        icon: 'error',
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      });
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Particles />
        <Sidebar />
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 mb-4 text-[rgb(var(--primary-rgb))]" />
            <p className="text-xl font-medium">Cargando detalles del curso...</p>
          </motion.div>
        </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-screen">
        <Particles />
        <Sidebar />
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 mb-4 text-red-500" />
            <p className="text-xl font-medium">{error || "Curso no encontrado"}</p>
            <Link href="/courses">
              <button className="button-primary mt-4">
                Volver a Cursos
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Particles />
      <Sidebar />
      
      {/* Modal de inscripción */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEnroll}
        isLoading={enrolling}
        coursePrice={course.course_price}
      />
      
      <div className="py-12 px-4 md:px-8 lg:px-12 ml-0 md:ml-16">
        {/* Botón de regresar */}
        <Link href="/courses">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 mb-8 text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Volver a Cursos</span>
          </motion.button>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal del curso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6">
              {course.course_image ? (
                <Image
                  src={course.course_image}
                  alt={course.course_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-16 w-16 text-[rgb(var(--primary-rgb))]" />
                </div>
              )}
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {course.course_name}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-[rgb(var(--primary-rgb))]">
                {course.school.school_image ? (
                  <Image
                    src={course.school.school_image}
                    alt={course.school.school_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-[rgba(var(--primary-rgb),0.2)] h-full w-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faSchool} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                )}
              </div>
              <Link 
                href={`/student/schools/${course.school.school_id}`}
                className="text-lg font-medium hover:underline hover:text-[rgb(var(--primary-rgb))] transition-colors"
              >
                {course.school.school_name}
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Descripción del Curso</h2>
              <p className="text-[rgb(var(--foreground-rgb))] opacity-90">{course.course_description}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Información del Curso</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Precio</p>
                    <p className="font-semibold">{formatPrice(course.course_price)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Plazas Disponibles</p>
                    <p className="font-semibold">{course.course_places}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Edad Mínima</p>
                    <p className="font-semibold">{course.course_age} años</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Barra lateral con información de la escuela e inscripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-1"
          >
            {/* Llamada a la acción para inscribirse */}
            <div className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Inscribirse al curso</h2>
              <p className="mb-6 text-sm opacity-80">
                Para inscribirte a este curso, primero debes estar inscrito en la escuela. Al hacer clic en el botón, seleccionarás tu plan de inscripción.
              </p>
              
              <button
                onClick={handleOpenEnrollModal}
                disabled={enrollSuccess}
                className={`button-primary w-full flex items-center justify-center gap-2 ${
                  enrollSuccess ? 'bg-green-500 hover:bg-green-600' : ''
                }`}
              >
                {enrollSuccess ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>¡Inscripción Exitosa!</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span>Inscribirme Ahora</span>
                  </>
                )}
              </button>
              
              {/* Mensaje de error de inscripción */}
              <AnimatePresence>
                {enrollError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500"
                  >
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mt-0.5" />
                      <p className="text-sm">{enrollError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Mensaje de éxito con enlace al dashboard */}
              <AnimatePresence>
                {enrollSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <Link href="/student/dashboard">
                      <button className="button-secondary w-full">
                        Ir a Mi Dashboard
                      </button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Información del Administrador de la Escuela */}
            {schoolAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6 mb-6"
              >
                <h2 className="text-xl font-semibold mb-4">Administrador de la Escuela</h2>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserTie} className="h-6 w-6 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{schoolAdmin.user_name} {schoolAdmin.user_lastname}</p>
                    <p className="text-sm opacity-70 mt-1">{schoolAdmin.user_email}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Información de la Escuela */}
            <div className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faSchool} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Escuela</p>
                    <p className="font-medium">{course.school.school_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Dirección</p>
                    <p className="font-medium">{course.school.school_address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Teléfono</p>
                    <p className="font-medium">{course.school.school_phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Email</p>
                    <p className="font-medium">{course.school.school_email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href={`/student/schools/${course.school.school_id}`}>
                  <button className="button-secondary w-full">
                    Ver Escuela
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}