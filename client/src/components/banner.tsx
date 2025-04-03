"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVolleyball, faDumbbell } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function Banner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-16"
      id="home"
    >
      {/* Iconos decorativos */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-60 right-5 w-24 h-24 md:w-32 md:h-32 hidden sm:block"
      >
        <FontAwesomeIcon icon={faDumbbell} className="text-[rgb(var(--primary-rgb))] text-4xl md:text-6xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-32 left-1/2 w-24 h-24 md:w-32 md:h-32 hidden sm:block"
      >
        <FontAwesomeIcon icon={faVolleyball} className="text-[rgb(var(--primary-rgb))] text-4xl md:text-6xl" />
      </motion.div>

      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-[rgb(var(--primary-rgb))] text-xl md:text-2xl font-bold tracking-wide mb-0"
            >
              Academia de Deportistas
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[rgb(var(--foreground-rgb))] text-4xl sm:text-5xl md:text-6xl font-bold leading-tight
                         relative z-10"
            >Forjando Grandes <br />
              <span className="text-[rgb(var(--primary-rgb))] relative">
                deportistas
                <span className="absolute -right-4 -top-2 text-xl md:text-2xl text-[rgb(var(--primary-rgb))]"></span>
              </span>{" "}
              desde <br />
              cualquier lugar!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[rgb(var(--foreground-rgb))]/70 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0
                        pl-4 border-l-4 border-[rgb(var(--primary-rgb))]"
            >
              Desarrolla tu potencial deportivo con nuestra plataforma de entrenamiento personalizado y
              acondicionamiento físico.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start"
            >
              <Link
                href="/start"
                className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))] text-black font-bold py-3 px-8 min-w-[160px] h-12 text-base transition-transform hover:scale-105 hover:shadow-lg"
              >
                ¡Empieza ahora!
              </Link>

              <Link
                href="/school"
                className="inline-flex items-center justify-center rounded-full border-2 border-[rgb(var(--primary-rgb))] text-[rgb(var(--foreground-rgb))] font-bold py-3 px-8 min-w-[160px] h-12 text-base transition-transform hover:scale-105 hover:bg-[rgba(var(--primary-rgb),0.1)] hover:shadow-lg"
              >
                Soy escuela
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full lg:w-1/2 mt-8 lg:mt-0"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative">
                <Image
                  src="/Images/resources/basquetbolista.png"
                  alt="Basquetbolista"
                  fill
                  className="object-contain transition-all duration-500 hover:scale-105
                           drop-shadow-[0_0_20px_rgba(245,215,66,0.4)]
                           dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

