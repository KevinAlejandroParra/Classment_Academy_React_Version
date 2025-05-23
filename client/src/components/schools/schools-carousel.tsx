"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Autoplay, Navigation } from "swiper/modules"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"

interface Escuela {
  school_id: string
  school_name: string
  school_description: string
  school_address: string
  school_image: string
}

// Remove this line:
// const API_BASE_URL = "http://localhost:5000"

// Add this instead:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function SchoolsCarousel() {
  const [escuelas, setEscuelas] = useState<Escuela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const swiperRef = useRef<any>(null)
  const navigationPrevRef = useRef<HTMLDivElement>(null)
  const navigationNextRef = useRef<HTMLDivElement>(null)

  const fetchEscuelas = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Iniciando petición a la API de escuelas...")

      // Obtener el token del localStorage
      const token = localStorage.getItem("token");
      // Intentar hacer la petición con manejo de errores mejorado
      let response
      try {
        response = await fetch(`${API_BASE_URL}/api/schools`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })
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
        throw new Error(data?.message || "Error al obtener las escuelas")
      }

      // Verificar si data.data es un array
      if (!data.data) {
        // Si no hay data.data pero la respuesta es exitosa, intentamos usar data directamente
        if (Array.isArray(data)) {
          setEscuelas(data)
        } else {
          console.warn("Los datos recibidos no tienen el formato esperado:", data)
          setEscuelas([])
        }
      } else if (Array.isArray(data.data)) {
        setEscuelas(data.data)
      } else {
        console.warn("Los datos recibidos no son un array:", data)
        setEscuelas([])
      }
    } catch (error) {
      console.error("Error al obtener las escuelas:", error)
      setError(error instanceof Error ? error.message : "No se pudieron cargar las escuelas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEscuelas()
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
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[rgb(var(--primary-rgb))] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-[rgb(var(--foreground-rgb))]">Cargando escuelas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchEscuelas}
          className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)]"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (escuelas.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[rgb(var(--foreground-rgb))]">No hay escuelas disponibles</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative py-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 space-y-8 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[rgb(var(--foreground-rgb))]">
          <span className="relative inline-block">
            Escuelas destacadas
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[rgb(var(--primary-rgb))]"></span>
          </span>
        </h2>

        <div className="relative px-10">
          {/* Botones de navegación personalizados */}
          <div
            ref={navigationPrevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[rgba(var(--primary-rgb),0.8)] text-black rounded-full p-2 shadow-lg hover:bg-[rgb(var(--primary-rgb))] transition-all"
          >
            <ChevronLeft size={24} />
          </div>
          <div
            ref={navigationNextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[rgba(var(--primary-rgb),0.8)] text-black rounded-full p-2 shadow-lg hover:bg-[rgb(var(--primary-rgb))] transition-all"
          >
            <ChevronRight size={24} />
          </div>

          {/* Contenedor con padding para evitar cortes */}
          <div className="py-8 px-2">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
              className="mySwiper"
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              // Corregir el error de TypeScript en la configuración de navegación
              onSwiper={(swiper) => {
                swiperRef.current = swiper
                // Actualizar la navegación después de que Swiper se inicialice
                if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                  // Asegurarse de que navigation sea un objeto antes de asignar propiedades
                  swiper.params.navigation.prevEl = navigationPrevRef.current
                  swiper.params.navigation.nextEl = navigationNextRef.current
                  swiper.navigation.init()
                  swiper.navigation.update()
                }
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
            >
              {escuelas.map((escuela) => (
                <SwiperSlide key={escuela.school_id} className="w-[300px] sm:w-[320px] md:w-[350px] lg:w-[380px] my-8">
                  <div className="card bg-[rgb(var(--background-rgb))] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 border border-[rgba(var(--foreground-rgb),0.1)] h-full">
                    <figure className="relative h-[200px] w-full">
                      <Image
                        src={getImageUrl(escuela.school_image) || "/placeholder.svg"}
                        alt={escuela.school_name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                    </figure>
                    <div className="card-body p-4">
                      <h2 className="card-title text-xl font-semibold mb-2 text-[rgb(var(--foreground-rgb))]">
                        {escuela.school_name}
                      </h2>
                      <p className="text-lg mb-2 text-[rgba(var(--foreground-rgb),0.8)] line-clamp-2">
                        {escuela.school_description}
                      </p>
                      <p className="text-sm mb-2 text-[rgba(var(--foreground-rgb),0.6)]">
                        Dirección: {escuela.school_address}
                      </p>
                      <div className="card-actions justify-end pt-2 pb-2">
                        <Link
                          href={`/student/schools/${escuela.school_id}`}
                          className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))] text-black font-bold py-2 px-4 min-w-[120px] text-sm transition-transform hover:scale-105 hover:shadow-lg"
                        >
                          Ver Escuela
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(var(--primary-rgb), 0.7);
        }
        
        .swiper-pagination-bullet-active {
          background: rgb(var(--primary-rgb));
        }
        
        .swiper-slide {
          transition: transform 0.3s;
          height: auto !important;
        }
        
        .swiper-slide-active {
          z-index: 1;
        }
        
        .swiper-3d .swiper-slide-shadow-left,
        .swiper-3d .swiper-slide-shadow-right {
          background-image: linear-gradient(to right, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0));
        }
      `}</style>
    </motion.div>
  )
}
