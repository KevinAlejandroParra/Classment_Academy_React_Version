"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

interface Escuela {
  escuela_id: number
  escuela_nombre: string
  escuela_descripcion: string
  escuela_direccion: string
  escuela_imagen_url: string
}

export function SchoolsCarousel() {
  const [escuelas, setEscuelas] = useState<Escuela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const swiperRef = useRef<any>(null)

  const fetchEscuelas = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/api/escuelas")
      if (!response.ok) {
        throw new Error("Error al obtener las escuelas")
      }
      const data = await response.json()
      setEscuelas(data)
    } catch (error) {
      console.error("Error al obtener las escuelas:", error)
      setError("No se pudieron cargar las escuelas")
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
        <p className="text-red-500">{error}</p>
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
      className="relative overflow-hidden py-16 flex justify-center items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 space-y-8 max-w-7xl w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[rgb(var(--foreground-rgb))]">
          <span className="relative inline-block">
            Escuelas destacadas
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
          {escuelas.map((escuela) => (
            <SwiperSlide
              key={escuela.escuela_id}
              className="bg-center bg-cover w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
            >
              <div className="card bg-[rgb(var(--background-rgb))] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 border border-[rgba(var(--foreground-rgb),0.1)]">
                <figure className="relative h-[200px] w-full">
                  <Image
                    src={escuela.escuela_imagen_url || "/placeholder.svg"}
                    alt={escuela.escuela_nombre}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-xl font-semibold mb-2 text-[rgb(var(--foreground-rgb))]">
                    {escuela.escuela_nombre}
                  </h2>
                  <p className="text-lg mb-2 text-[rgba(var(--foreground-rgb),0.8)] line-clamp-2">
                    {escuela.escuela_descripcion}
                  </p>
                  <p className="text-sm mb-2 text-[rgba(var(--foreground-rgb),0.6)]">
                    Dirección: {escuela.escuela_direccion}
                  </p>
                  <div className="card-actions justify-end pt-2 pb-2">
                    <Link
                      href={`/escuela/${escuela.escuela_id}`}
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
    </motion.div>
  )
}

