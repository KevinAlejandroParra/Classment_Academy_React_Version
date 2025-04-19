"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  School,
  Calendar,
  Users,
  Baby,
  MapPin,
  Phone,
  Clock,
  MapPinned,
  UserIcon as ChalkboardUser,
} from "lucide-react"

const API_BASE_URL = "http://localhost:5000"

/**
 * Renders the course header with image and title
 * @param {Object} props
 * @param {Object} props.course - The course object
 * @returns {JSX.Element}
 */
const CourseHeader = ({ course }) => (
  <div className="relative h-64 sm:h-80 md:h-96 mb-8 overflow-hidden rounded-b-3xl shadow-lg">
    <Image
      src={getImageUrl(course.course_image) || "/placeholder.svg"}
      alt={course.course_name || "Imagen del curso"}
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <h1 className="text-[rgb(var(--primary-rgb))] text-3xl md:text-4xl font-bold text-center px-4 drop-shadow-lg">
        {course.course_name || "Curso"}
      </h1>
    </div>
  </div>
)

// Función para validar URLs de imágenes
const isValidImageUrl = (url) => {
  if (!url) return false
  try {
    // Verificar si es una URL válida
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

// Función para obtener la URL de la imagen o una imagen de respaldo
const getImageUrl = (url) => {
  if (!url) return "/placeholder.svg"

  // Si la URL ya es absoluta, la devolvemos tal cual
  if (isValidImageUrl(url)) {
    return url
  }

  // Si es una ruta relativa, la combinamos con la URL base del servidor
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`
}

export default function CourseDetailPage() {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const id = params?.id

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Iniciando petición a la API para el curso ${id}...`)

        // Intentar hacer la petición con manejo de errores mejorado
        let response
        try {
          // Usar la ruta exacta que tienes en tu API
          response = await fetch(`${API_BASE_URL}/api/courses/${id}`)
          console.log("Respuesta recibida:", response.status)
        } catch (fetchError) {
          console.error("Error al conectar con la API:", fetchError)
          throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
        }

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          let errorMessage = `Error del servidor: ${response.status} ${response.statusText}`

          try {
            const errorData = await response.json()
            if (errorData && errorData.message) {
              errorMessage = errorData.message
            }
            console.error("Error en la respuesta:", errorData)
          } catch (jsonError) {
            console.error("No se pudo parsear la respuesta de error:", jsonError)
          }

          throw new Error(errorMessage)
        }

        // Parsear la respuesta JSON con manejo de errores
        let data
        try {
          data = await response.json()
          console.log("Datos recibidos:", data)
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError)
          throw new Error("La respuesta del servidor no es válida")
        }

        // Verificar la estructura de la respuesta
        if (!data || data.success === false) {
          throw new Error(data?.message || "Error al obtener los detalles del curso")
        }

        // Verificar si data.data existe
        if (!data.data) {
          // Si no hay data.data pero la respuesta es exitosa, intentamos usar data directamente
          if (data.course_id) {
            setCourse(data)
          } else {
            console.warn("Los datos recibidos no tienen el formato esperado:", data)
            throw new Error("Formato de datos inesperado")
          }
        } else {
          setCourse(data.data)
        }
      } catch (error) {
        console.error("Error al obtener los detalles del curso:", error)
        setError(error instanceof Error ? error.message : "No se pudieron cargar los detalles del curso")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourseDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[rgb(var(--primary-rgb))] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-[rgb(var(--foreground-rgb))]">Cargando detalles del curso...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-[rgb(var(--background-rgb))] rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">
            <MapPin className="mx-auto" size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--foreground-rgb))]">Error al cargar el curso</h2>
          <p className="text-[rgba(var(--foreground-rgb),0.8)] mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/cursos"
              className="px-4 py-2 bg-[rgba(var(--foreground-rgb),0.1)] rounded-lg hover:bg-[rgba(var(--foreground-rgb),0.2)] transition-colors"
            >
              Ver todos los cursos
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-[rgb(var(--background-rgb))] rounded-xl shadow-lg">
          <div className="text-[rgb(var(--primary-rgb))] text-5xl mb-4">
            <School className="mx-auto" size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--foreground-rgb))]">Curso no encontrado</h2>
          <p className="text-[rgba(var(--foreground-rgb),0.8)] mb-6">
            No pudimos encontrar el curso que estás buscando. Es posible que haya sido eliminado o que la URL sea
            incorrecta.
          </p>
          <Link
            href="/cursos"
            className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
          >
            Ver todos los cursos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[rgb(var(--background-rgb))]"
    >
      <CourseHeader course={course} />

      <main className="container mx-auto px-4 max-w-6xl -mt-16 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[rgb(var(--card-rgb))] rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 space-y-8">
            {/* Información del Curso */}
            <section>
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                    <School className="inline-block mr-3 text-[rgb(var(--primary-rgb))]" />
                    {course.course_name}
                  </h2>
                  <p className="text-[rgba(var(--foreground-rgb),0.8)]">
                    <ChalkboardUser className="inline-block mr-2 text-[rgb(var(--primary-rgb))]" />
                    {course.school?.school_name || "Escuela no especificada"}
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-3xl font-bold text-[rgb(var(--primary-rgb))] mb-2">
                    ${course.course_price?.toFixed(2) || "0.00"}
                  </p>
                  <button className="bg-[rgb(var(--primary-rgb))] text-black hover:bg-opacity-90 rounded-full px-6 py-2 font-semibold transition-colors">
                    <Users className="inline-block mr-2" size={18} />
                    Inscribirse
                  </button>
                </div>
              </div>
            </section>

            {/* Descripción */}
            <section>
              <h3 className="text-2xl font-semibold text-[rgb(var(--foreground-rgb))] mb-4">
                <MapPin className="inline-block mr-3 text-[rgb(var(--primary-rgb))]" />
                Descripción
              </h3>
              <p className="text-[rgba(var(--foreground-rgb),0.8)]">
                {course.course_description || "Sin descripción disponible."}
              </p>
            </section>

            {/* Detalles del Curso */}
            <section className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-4">
                  <Clock className="inline-block mr-3 text-[rgb(var(--primary-rgb))]" />
                  Detalles del Curso
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center text-[rgba(var(--foreground-rgb),0.8)]">
                    <Calendar className="mr-3 text-[rgb(var(--primary-rgb))]" size={20} />
                    Cupos disponibles: {course.course_places || 0}
                  </li>
                  <li className="flex items-center text-[rgba(var(--foreground-rgb),0.8)]">
                    <Baby className="mr-3 text-[rgb(var(--primary-rgb))]" size={20} />
                    Edad mínima: {course.course_age || "N/A"} años
                  </li>
                  <li className="flex items-center text-[rgba(var(--foreground-rgb),0.8)]">
                    <Users className="mr-3 text-[rgb(var(--primary-rgb))]" size={20} />
                    Estudiantes inscritos: {course.students?.length || 0}
                  </li>
                </ul>
              </div>

              {/* Ubicación */}
              <div>
                <h4 className="text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-4">
                  <MapPinned className="inline-block mr-3 text-[rgb(var(--primary-rgb))]" />
                  Ubicación
                </h4>
                <div className="space-y-3">
                  <p className="flex items-center text-[rgba(var(--foreground-rgb),0.8)]">
                    <MapPin className="mr-3 text-[rgb(var(--primary-rgb))]" size={20} />
                    {course.school?.school_address || "Dirección no disponible"}
                  </p>
                  <p className="flex items-center text-[rgba(var(--foreground-rgb),0.8)]">
                    <Phone className="mr-3 text-[rgb(var(--primary-rgb))]" size={20} />
                    {course.school?.school_phone || "Teléfono no disponible"}
                  </p>
                </div>
              </div>
            </section>

            {/* Escuela */}
            <section>
              <h3 className="text-2xl font-semibold text-[rgb(var(--foreground-rgb))] mb-4">
                <School className="inline-block mr-3 text-[rgb(var(--primary-rgb))]" />
                Acerca de la Escuela
              </h3>
              {course.school ? (
                <div className="bg-[rgba(var(--foreground-rgb),0.05)] p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-[rgb(var(--primary-rgb))] mb-2">{course.school.school_name}</h4>
                  <p className="text-[rgba(var(--foreground-rgb),0.8)] mb-4">
                    {course.school.school_description || "Sin descripción disponible."}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <Link
                      href={`/escuela/${course.school.school_id}`}
                      className="inline-flex items-center justify-center rounded-full bg-[rgba(var(--foreground-rgb),0.1)] text-[rgb(var(--foreground-rgb))] font-medium py-2 px-4 hover:bg-[rgba(var(--foreground-rgb),0.15)] transition-colors"
                    >
                      Ver Escuela
                    </Link>
                    <Link
                      href={`/cursos/escuela/${course.school.school_id}`}
                      className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))] text-black font-medium py-2 px-4 hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
                    >
                      Ver Todos los Cursos
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-[rgba(var(--foreground-rgb),0.8)]">Información de la escuela no disponible.</p>
              )}
            </section>

            {/* Estudiantes */}
            {course.students && course.students.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-[rgb(var(--foreground-rgb))] mb-4">
                  <Users className="inline-block mr-3 text-[rgb(var(--primary-rgb))]" />
                  Estudiantes Inscritos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {course.students.map((student) => (
                    <div
                      key={student.user_id}
                      className="bg-[rgba(var(--foreground-rgb),0.05)] p-4 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <p className="text-lg font-semibold text-[rgb(var(--foreground-rgb))]">
                        {student.user_name} {student.user_lastname}
                      </p>
                      <p className="text-[rgba(var(--foreground-rgb),0.6)] text-sm">{student.user_email}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Botones de Acción */}
            <section className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/cursos"
                className="inline-flex items-center justify-center rounded-full bg-[rgba(var(--foreground-rgb),0.1)] text-[rgb(var(--foreground-rgb))] font-medium py-3 px-6 hover:bg-[rgba(var(--foreground-rgb),0.15)] transition-colors"
              >
                Ver Todos los Cursos
              </Link>
              <button className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))] text-black font-medium py-3 px-6 hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors">
                <Users className="mr-2" size={18} />
                Inscribirse Ahora
              </button>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Sección de Cursos Relacionados */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))] mb-8 text-center">
          <span className="relative inline-block">
            Cursos Relacionados
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[rgb(var(--primary-rgb))]"></span>
          </span>
        </h2>

        {/* Aquí puedes incluir un componente de carrusel de cursos relacionados */}
        {course && course.school && (
          <div className="text-center">
            <Link
              href={`/cursos/escuela/${course.school.school_id}`}
              className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))] text-black font-medium py-3 px-6 hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
            >
              Ver todos los cursos de esta escuela
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}
