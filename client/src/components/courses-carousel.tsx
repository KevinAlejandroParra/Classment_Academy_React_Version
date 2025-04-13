"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

// Importar estilos de Swiper
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

interface Curso {
  course_id: string
  course_name: string
  course_description: string
  course_price: number
  course_image: string
  school: {
    school_name: string
  }
}

const API_BASE_URL = "http://localhost:5000"

export function CoursesCarousel() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const swiperRef = useRef<any>(null)

  const fetchCursos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }
      
      console.log("Iniciando petición a la API de cursos...")
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      console.log("Respuesta recibida:", response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }))
        console.error("Error en la respuesta:", errorData)
        throw new Error(`Error al obtener los cursos: ${errorData.message || response.statusText}`)
      }
      
      const data = await response.json()
      console.log("Datos recibidos:", data)
      
      if (!data.success) {
        throw new Error(data.message || "Error al obtener los cursos")
      }
      
      if (!data.data || !Array.isArray(data.data)) {
        console.warn("Los datos recibidos no son un array:", data)
        setCursos([])
      } else {
        setCursos(data.data)
      }
    } catch (error) {
      console.error("Error al obtener los cursos:", error)
      setError(error instanceof Error ? error.message : "No se pudieron cargar los cursos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCursos()
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop()
      setIsAutoplayPaused(true)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start()
      setIsAutoplayPaused(false)
    }
  }, [])

  // Función para validar URLs de imágenes
  const isValidImageUrl = (url: string): boolean => {
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
  const getImageUrl = (url: string): string => {
    if (!url) return "/placeholder.svg"
    
    // Si la URL ya es absoluta, la devolvemos tal cual
    if (isValidImageUrl(url)) {
      return url
    }
    
    // Si es una ruta relativa, la combinamos con la URL base del servidor
    return `${API_BASE_URL}${url}`
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[rgb(var(--primary-rgb))] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-[rgb(var(--foreground-rgb))]">Cargando cursos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchCursos}
          className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)]"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (cursos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[rgb(var(--foreground-rgb))]">No hay cursos disponibles</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden py-16 flex justify-center items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 space-y-8 max-w-7xl w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[rgb(var(--foreground-rgb))]">
          <span className="relative inline-block">
            Cursos destacados
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[rgb(var(--primary-rgb))]"></span>
          </span>
        </h2>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper overflow-visible"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
        >
          {cursos.map((curso) => (
            <SwiperSlide
              key={curso.course_id}
              className="bg-center bg-cover w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
            >
              <div className="card bg-[rgb(var(--background-rgb))] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 border border-[rgba(var(--foreground-rgb),0.1)]">
                <figure className="relative h-[200px] w-full">
                  <Image
                    src={getImageUrl(curso.course_image)}
                    alt={curso.course_name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-xl font-semibold mb-2 text-[rgb(var(--foreground-rgb))]">
                    {curso.course_name}
                  </h2>
                  <p className="text-lg mb-2 text-[rgba(var(--foreground-rgb),0.8)] line-clamp-2">
                    {curso.course_description}
                  </p>
                  <p className="text-sm mb-2 text-[rgba(var(--foreground-rgb),0.6)]">Escuela: {curso.school.school_name}</p>
                  <p className="text-lg font-bold mb-2 text-[rgb(var(--primary-rgb))]">${curso.course_price}</p>
                  <div className="card-actions justify-end pt-2 pb-2">
                    <Link
                      href={`/curso/${curso.course_id}`}
                      className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))] text-black font-bold py-2 px-4 min-w-[120px] text-sm transition-transform hover:scale-105 hover:shadow-lg"
                    >
                      Ver Curso
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.div>
  )
}