"use client"

import { Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVolleyball, faDumbbell } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"

export function Banner() {
  return (
    <div className="relative bg-transparent min-h-screen flex items-center overflow-hidden" id="home">
      {/* Decorative Elements */}
      <div className="absolute top-60 right-5 w-32 h-32">
        <FontAwesomeIcon icon={faDumbbell} className="text-primary text-6xl" />
      </div>
      <div className="absolute bottom-32 left-1/2 w-32 h-32">
        <FontAwesomeIcon icon={faVolleyball} className="text-primary text-6xl" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 space-y-8">
            <div className="relative">
              <p
                className="text-primary text-2xl font-bold tracking-wide 
                           before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-2 before:h-12 
                           before:bg-primary before:-translate-y-1/2"
              >
                Academia de Deportistas
              </p>
            </div>

            <h1
              className="text-foreground text-6xl md:text-6xl font-bold leading-tight
                         relative z-10"
            >
              Forjando Grandes <br />
              <span className="text-6xl text-primary relative">
                deportistas
                <span className="absolute -right-4 -top-2 text-2xl text-primary/80">★</span>
              </span>{" "}
              desde <br />
              cualquier lugar!
            </h1>

            <p
              className="text-foreground/70 text-lg leading-relaxed max-w-lg
                        pl-4 border-l-4 border-primary"
            >
              Desarrolla tu potencial deportivo con nuestra plataforma de entrenamiento personalizado y
              acondicionamiento físico.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button color="primary" radius="full" size="lg" className="font-bold">
                ¡Empieza ahora!
              </Button>

              <Button variant="bordered" radius="full" size="lg" color="primary" className="font-bold">
                Soy escuela
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="relative w-full max-w-xl mx-auto">
              <div className="w-full h-[500px] relative">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Basquetbolista"
                  fill
                  className="object-contain transition-all duration-500 hover:scale-105
                           drop-shadow-[0_0_20px_rgba(245,215,66,0.4)]
                           dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

