"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faCheckCircle, 
  faSpinner, 
  faExclamationTriangle,
  faArrowRight,
  faSchool
} from "@fortawesome/free-solid-svg-icons"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Obtener parámetros de la URL
  const paymentId = searchParams.get('external_reference')
  
  const verifyPayment = async (retryCount = 0) => {
    try {
      if (!paymentId) throw new Error("ID de pago no encontrado")
      
      const token = localStorage.getItem("token")
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/status/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.data.status === 'pending' && retryCount < 5) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return verifyPayment(retryCount + 1)
      }

      if (!data.success) throw new Error(data.message)
      
      setEnrollmentData(data.data)
    } catch (error) {
      // Handle unknown error type
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!paymentId) {
      setError("No se encontró referencia de pago")
      setLoading(false)
      return
    }
    
    verifyPayment()
  }, [paymentId])
  
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
          {loading ? (
            <div className="text-center py-10">
              <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 mb-4 text-[rgb(var(--primary-rgb))]" />
              <p className="text-xl font-medium">Verificando el estado de tu pago...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 mb-4 text-yellow-500" />
              <p className="text-xl font-medium mb-4">Ocurrió un problema</p>
              <p className="text-[rgb(var(--foreground-rgb))] opacity-80 mb-6">{error}</p>
              <Link href="/courses">
                <button className="button-primary">
                  Ver Cursos Disponibles
                </button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <FontAwesomeIcon icon={faCheckCircle} className="h-16 w-16 mb-4 text-green-500" />
              <h1 className="text-2xl font-bold mb-4">¡Pago Exitoso!</h1>
              
              {enrollmentData?.enrollment ? (
                <>
                  <p className="text-[rgb(var(--foreground-rgb))] opacity-80 mb-6">
                    Te has inscrito correctamente en el curso: <br/>
                    <span className="font-semibold">{enrollmentData.enrollment.course_name}</span>
                  </p>
                  
                  <div className="flex flex-col space-y-3">
                    <Link href="/student/dashboard">
                      <button className="button-primary w-full flex items-center justify-center gap-2">
                        <span>Ir a Mi Dashboard</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </Link>
                    
                    <Link href="/courses">
                      <button className="button-secondary w-full flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faSchool} />
                        <span>Ver más Cursos</span>
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[rgb(var(--foreground-rgb))] opacity-80 mb-6">
                    Tu pago ha sido procesado correctamente. Sin embargo, estamos esperando la confirmación final para completar tu inscripción.
                  </p>
                  
                  <div className="flex flex-col space-y-3">
                    <Link href="/student/dashboard">
                      <button className="button-primary w-full flex items-center justify-center gap-2">
                        <span>Ir a Mi Dashboard</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}

