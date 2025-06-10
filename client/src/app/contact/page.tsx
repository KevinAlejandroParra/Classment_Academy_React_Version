 "use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/navigation"

const ContactPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus({
        type: "success",
        message: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setStatus({
        type: "error",
        message: "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-black">
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
                <p className="text-[rgb(var(--foreground-rgb))] opacity-80">
                  Puedes contactarnos a través de cualquiera de los siguientes medios:
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Email</p>
                    <a href="mailto:contacto@classment.com" className="font-semibold hover:text-[rgb(var(--primary-rgb))] transition-colors">
                      contacto@classment.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Teléfono</p>
                    <a href="tel:+573001234567" className="font-semibold hover:text-[rgb(var(--primary-rgb))] transition-colors">
                      +57 300 123 4567
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-[rgb(var(--primary-rgb))]" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Dirección</p>
                    <p className="font-semibold">Bogotá, Colombia</p>
                  </div>
                </motion.div>
              </div>

              <div className="pt-8">
                <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="opacity-70">Lunes - Viernes:</span>
                    <span className="font-semibold">8:00 AM - 6:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="opacity-70">Sábados:</span>
                    <span className="font-semibold">9:00 AM - 1:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="opacity-70">Domingos:</span>
                    <span className="font-semibold">Cerrado</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage