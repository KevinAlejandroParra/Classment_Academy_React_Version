"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTimesCircle,
  faExclamationTriangle,
  faCheckCircle,
  faArrowRight,
  faSchool,
  faMoneyBillWave,
  faCalendarAlt,
  faCreditCard,
  faBookOpen,
  faUserGraduate
} from "@fortawesome/free-solid-svg-icons"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const paymentId = searchParams.get('external_reference') || searchParams.get('paymentId')

  const fetchPaymentDetails = async () => {
    try {
      if (!paymentId) throw new Error("ID de pago no encontrado")
      const token = localStorage.getItem("token")
      if (!token) {
        router.push('/login')
        return
      }
      const response = await fetch(`https://594rdxq0-5000.use2.devtunnels.ms/api/payments/status/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message)
      setPaymentData(data.data)
    } catch (error: any) {
      setError(error.message || "Error desconocido")
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
    fetchPaymentDetails()
  }, [paymentId])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible"
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    } catch {
      return "Fecha inválida"
    }
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: "rgb(var(--background-rgb))"
      }}
    >
      <Particles />
      <Sidebar />

      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl relative z-10"
          style={{
            background: "rgba(var(--background-rgb))",
            border: "1.5px solid rgba(var(--primary-rgb), 0.2)"
          }}
        >
          {loading ? (
            <div className="text-center py-10">
              <FontAwesomeIcon icon={faTimesCircle} className="h-12 w-12 mb-4" style={{ color: "rgb(var(--primary-rgb))" }} />
              <p className="text-xl font-medium" style={{ color: "rgb(var(--primary-rgb))" }}>Verificando el estado de tu pago...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 mb-4" style={{ color: "rgb(var(--primary-rgb))" }} />
              <p className="text-xl font-medium mb-4" style={{ color: "rgb(var(--primary-rgb))" }}>Ocurrió un problema</p>
              <p className="opacity-80 mb-6" style={{ color: "rgb(var(--foreground-rgb))" }}>{error}</p>
              <Link href="/courses">
                <button className="button-primary">
                  Ver Cursos Disponibles
                </button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <FontAwesomeIcon icon={faCheckCircle} className="h-16 w-16 mb-4 drop-shadow-lg" style={{ color: "rgb(var(--primary-rgb))" }} />
              <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(var(--primary-rgb))" }}>¡Bienvenido a tu curso!</h1>
              <p className="text-lg mb-6" style={{ color: "rgb(var(--foreground-rgb))" }}>
                Tu pago fue <span className="font-bold" style={{ color: "rgb(34,197,94)" }}>exitoso</span> y tu inscripción está activa.
              </p>

              {/* Detalles del pago */}
              <div
                className="rounded-xl p-5 mb-6 text-left shadow-lg"
                style={{
                  background: "rgba(var(--surface-2), 0.15)",
                  border: "1.5px solid rgba(var(--primary-rgb), 0.3)"
                }}
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: "rgb(var(--primary-rgb))" }}>
                  <FontAwesomeIcon icon={faMoneyBillWave} /> Detalles del Pago
                </h2>
                <div className="grid grid-cols-1 gap-2" style={{ color: "rgb(var(--foreground-rgb))" }}>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faBookOpen} />
                    <span className="font-semibold">Curso:</span>
                    <span>{paymentData?.enrollment?.course_name || paymentData?.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span className="font-semibold">Método:</span>
                    <span>{paymentData?.payment_method?.toUpperCase() || "MercadoPago"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span className="font-semibold">Fecha:</span>
                    <span>{formatDate(paymentData?.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    <span className="font-semibold">Monto:</span>
                    <span>${paymentData?.amount?.toLocaleString("es-CO") || "N/A"} COP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span className="font-semibold">Estado:</span>
                    <span className={
                      paymentData?.status === "completed"
                        ? "text-green-400 font-bold"
                        : paymentData?.status === "pending"
                        ? "text-yellow-400 font-bold"
                        : "text-red-400 font-bold"
                    }>
                      {paymentData?.status === "completed"
                        ? "Completado"
                        : paymentData?.status === "pending"
                        ? "Pendiente"
                        : "Fallido"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensaje de bienvenida */}
              <div
                className="rounded-xl p-5 mb-6 shadow-lg"
                style={{
                  background: "linear-gradient(90deg, rgba(var(--primary-rgb),0.15), rgba(var(--surface-2),0.2))",
                  border: "1.5px solid rgba(var(--primary-rgb), 0.3)"
                }}
              >
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: "rgb(var(--primary-rgb))" }}>
                  <FontAwesomeIcon icon={faUserGraduate} /> ¡Felicidades!
                </h2>
                <p style={{ color: "rgb(var(--foreground-rgb))" }}>
                  Ahora eres parte de la comunidad <span className="font-bold" style={{ color: "rgb(var(--primary-rgb))" }}>Classment Academy</span>.
                  Accede a tu curso y comienza a aprender. Si tienes dudas, nuestro equipo está para ayudarte.
                </p>
              </div>

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
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}

