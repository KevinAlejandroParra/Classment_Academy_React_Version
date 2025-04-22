"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: number[]
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error de autenticación")
        }

        const data = await response.json()
        
        if (!allowedRoles.includes(data.user.role)) {
          // Si el usuario no tiene el rol permitido, redirigir según su rol
          switch (data.user.role) {
            case 1:
              router.push("/student/dashboard")
              break
            case 3:
              router.push("/admin/dashboard")
              break
            case 4:
              router.push("/regulator/dashboard")
              break
            default:
              router.push("/")
          }
          return
        }

        setAuthorized(true)
      } catch (error) {
        console.error("Error de autenticación:", error)
        localStorage.removeItem("token")
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, allowedRoles])

  return authorized ? <>{children}</> : null
}

export default RouteGuard 