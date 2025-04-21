"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faHome } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { motion } from "framer-motion"
import { Particles } from "@/components/particles"

const ResetPassword = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const tokenParam = searchParams.get("token")
        if (!tokenParam) {
            setError("Token no válido o expirado")
        }
        setToken(tokenParam)
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword: password
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al restablecer la contraseña")
            }

            setSuccess("Contraseña actualizada exitosamente")
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al restablecer la contraseña")
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
                            Restablecer Contraseña
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-yellow-300 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faLock} className="text-[rgb(var(--primary-rgb))]" />
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-yellow-300 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faLock} className="text-[rgb(var(--primary-rgb))]" />
                                    Confirmar Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-[rgba(var(--primary-rgb),0.3)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary-rgb))] transition-all"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !token}
                                className="w-full bg-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.9)] text-black font-bold py-3 px-6 rounded-md transition-all duration-300"
                            >
                                {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
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

export default ResetPassword 