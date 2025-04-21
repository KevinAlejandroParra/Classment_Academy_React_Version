"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faHome } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { motion } from "framer-motion"
import { Particles } from "@/components/particles"

const ForgotPassword = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al procesar la solicitud")
            }

            setSuccess("Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña")
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al procesar la solicitud")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black"
        >
            <Particles />
            <Link
                href="/"
                className="fixed top-4 left-4 z-40 p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg"
            >
                <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>

            <div className="container mx-auto px-4 z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md mx-auto"
                >
                    <div className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]">
                        <h2 className="text-3xl font-bold text-white text-center mb-6">
                            Recuperar Contraseña
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-yellow-300 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-[rgb(var(--primary-rgb))]" />
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.9)] text-black font-bold py-3 px-6 rounded-md transition-all duration-300"
                            >
                                {isLoading ? "Enviando..." : "Enviar Instrucciones"}
                            </button>

                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                                    <p className="text-red-400 text-center text-sm">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-md">
                                    <p className="text-green-400 text-center text-sm">{success}</p>
                                </div>
                            )}
                        </form>

                        <div className="text-center text-white text-sm mt-4">
                            <Link href="/login" className="text-[rgb(var(--primary-rgb))] hover:underline">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ForgotPassword 