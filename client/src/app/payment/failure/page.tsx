"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faTimesCircle, 
  faArrowLeft,
  faCommentDollar
} from "@fortawesome/free-solid-svg-icons"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"
import Link from "next/link"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  
  // Obtener parámetros de la URL
  const paymentId = searchParams.get('external_reference')
  
  return (
    <main className="min-h-screen">
      <Particles />
      <Sidebar />
      
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgba(var(--foreground-rgb),0.03)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center py-6">
            <FontAwesomeIcon icon={faTimesCircle} className="h-16 w-16 mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-4">Pago No Completado</h1>
            
            <p className="text-[rgb(var(--foreground-rgb))] opacity-80 mb-6">
              Lo sentimos, no pudimos procesar tu pago correctamente. Por favor, intenta nuevamente o utiliza otro método de pago.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Link href="/courses">
                <button className="button-primary w-full flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Volver a Cursos</span>
                </button>
              </Link>
              
              <a href="mailto:soporte@tuescuela.com">
                <button className="button-secondary w-full flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faCommentDollar} />
                  <span>Contactar Soporte</span>
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}