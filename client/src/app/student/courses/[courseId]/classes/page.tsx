"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCalendarAlt,
  faClock,
  faUser,
  faSpinner,
  faExclamationTriangle,
  faChalkboardTeacher,
  faGraduationCap,
  faMapMarkerAlt,
  faVideo
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"
import Image from "next/image"

interface Class {
  class_id: string
  class_title: string
  class_date: string
  class_description: string
  duration: number
  teacher: {
    user_id: string
    user_name: string
    user_lastname: string
  }
}

interface Course {
  course_id: string
  course_name: string
  course_description: string
  course_image: string
  school: {
    school_name: string
  }
}

export default function CourseClasses() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  
  const [classes, setClasses] = useState<Class[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch course details
        const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`)
        const courseData = await courseResponse.json()
        
        if (!courseData.success) {
          throw new Error("Error al cargar el curso")
        }
        
        setCourse(courseData.data)

        // Fetch upcoming classes
        const classesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/class/course/${courseId}/upcoming`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const classesData = await classesResponse.json()
        
        if (!classesData.success) {
          throw new Error("Error al cargar las clases")
        }
        
        setClasses(classesData.data)
      } catch (err: any) {
        console.error("Error:", err)
        setError(err.message || "Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, router])

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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-[rgba(var(--primary-rgb),0.3)] shadow-lg">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
            <p className="text-white text-xl font-medium">Cargando clases...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-red-500/30 shadow-lg max-w-md">
          <div className="flex flex-col items-center justify-center gap-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl" />
            <h2 className="text-xl font-bold text-white">Error al cargar los datos</h2>
            <p className="text-gray-300 text-center">{error || "Curso no encontrado"}</p>
            <button 
              onClick={() => router.push("/student/dashboard")}
              className="button-primary mt-4"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <Particles />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg hover:shadow-[rgba(var(--primary-rgb),0.3)] transition-all duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Clases Programadas</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Course Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-black/20 p-6 rounded-2xl shadow-lg border border-[rgba(var(--primary-rgb),0.4)] mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-xl overflow-hidden">
              {course.course_image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${course.course_image}`}
                  alt={course.course_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-8 w-8 text-[rgb(var(--primary-rgb))]" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{course.course_name}</h2>
              <p className="text-gray-400">{course.school.school_name}</p>
            </div>
          </div>
        </motion.div>

        {/* Classes List */}
        {classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-black/20 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] text-center"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="text-[rgb(var(--primary-rgb))] text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No hay clases programadas</h2>
            <p className="text-gray-400 mb-6">Las clases aparecerán aquí cuando sean programadas por el profesor</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {classes.map((classItem) => (
              <motion.div
                key={classItem.class_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-black/20 rounded-2xl shadow-lg border-2 border-[rgba(var(--primary-rgb),0.4)] overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[rgb(var(--primary-rgb))] p-3 rounded-lg">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{classItem.class_title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{classItem.class_description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-[rgb(var(--primary-rgb))]" />
                      <span className="text-gray-300">{formatDateTime(classItem.class_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faClock} className="text-[rgb(var(--primary-rgb))]" />
                      <span className="text-gray-300">Duración: {formatDuration(classItem.duration)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                      <span className="text-gray-300">
                        Profesor: {classItem.teacher.user_name} {classItem.teacher.user_lastname}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      className="flex-1 py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faVideo} />
                      <span>Unirse a la Clase</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
} 